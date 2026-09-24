import Groq from "groq-sdk";
import { InvalidPDFException, PasswordException, PDFParse } from "pdf-parse";

import type { EducationItem, Profile, WorkExperienceItem } from "@/types";

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

// ~3k tokens. Resumes longer than this are almost always boilerplate or
// multi-page appendices; the model gets the top of the document.
const MAX_RESUME_CHARS = 12000;
const MIN_RESUME_CHARS = 100;
const MAX_OUTPUT_TOKENS = 2000;
const MAX_GROQ_ATTEMPTS = 2;

export type ResumeExtractionFailureReason =
  | "pdf_password_protected"
  | "pdf_invalid"
  | "pdf_no_text"
  | "pdf_parse_failed"
  | "ai_rate_limited"
  | "ai_invalid_json"
  | "ai_request_failed";

const FAILURE_MESSAGES: Record<ResumeExtractionFailureReason, string> = {
  pdf_password_protected:
    "This PDF is password-protected. Remove the password and upload it again.",
  pdf_invalid: "This file is not a valid PDF. Please upload a different file.",
  pdf_no_text:
    "Could not extract text from this PDF. Please try a different file.",
  pdf_parse_failed:
    "We could not read this PDF. Please try again or upload a different file.",
  ai_rate_limited:
    "The AI service is busy right now. Please try again in a minute.",
  ai_invalid_json:
    "The AI could not read this resume. Please try again or fill in your profile manually.",
  ai_request_failed:
    "The AI service is unavailable right now. Please try again later.",
};

export class ResumeExtractionError extends Error {
  readonly reason: ResumeExtractionFailureReason;
  readonly userMessage: string;

  constructor(reason: ResumeExtractionFailureReason, cause?: unknown) {
    super(reason, { cause });
    this.name = "ResumeExtractionError";
    this.reason = reason;
    this.userMessage = FAILURE_MESSAGES[reason];
  }
}

export type ExtractedProfile = Partial<
  Pick<
    Profile,
    | "full_name"
    | "phone"
    | "location"
    | "current_title"
    | "experience_level"
    | "years_experience"
    | "skills"
    | "industries"
    | "work_experience"
    | "education"
    | "job_titles_seeking"
    | "linkedin_url"
    | "portfolio_url"
  >
>;

export async function extractResumeText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });

  try {
    const result = await parser.getText({ pageJoiner: "" });
    const text = result.text.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();

    if (text.length < MIN_RESUME_CHARS) {
      throw new ResumeExtractionError("pdf_no_text");
    }
    return text;
  } catch (error) {
    if (error instanceof ResumeExtractionError) throw error;
    if (error instanceof PasswordException) {
      throw new ResumeExtractionError("pdf_password_protected", error);
    }
    if (error instanceof InvalidPDFException) {
      throw new ResumeExtractionError("pdf_invalid", error);
    }
    throw new ResumeExtractionError("pdf_parse_failed", error);
  } finally {
    await parser.destroy();
  }
}

const SYSTEM_PROMPT = `You extract structured profile data from resume text. Return ONLY a valid JSON object with these keys. Use null for any value the resume does not state. Never invent data.

{
  "full_name": string | null,
  "phone": string | null,
  "location": string | null,
  "current_title": string | null,
  "experience_level": "junior" | "mid" | "senior" | "lead" | null,
  "years_experience": number | null,
  "skills": string[],
  "industries": string[],
  "work_experience": [{ "company": string, "title": string, "startDate": string, "endDate": string | null, "current": boolean, "responsibilities": string }],
  "education": [{ "degree": string, "field": string, "institution": string, "year": string }],
  "job_titles_seeking": string[],
  "linkedin_url": string | null,
  "portfolio_url": string | null
}

Rules:
- work_experience: the 3 most recent roles only. responsibilities: one plain sentence, max 300 characters.
- education: the highest degree only.
- skills: max 20 items. industries and job_titles_seeking: max 5 items each.
- Dates as "YYYY-MM" when known, otherwise "YYYY".`;

export async function extractProfileFromText(
  resumeText: string,
): Promise<ExtractedProfile> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const truncatedText = resumeText.slice(0, MAX_RESUME_CHARS);
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_GROQ_ATTEMPTS; attempt++) {
    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: MAX_OUTPUT_TOKENS,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `RESUME TEXT:\n${truncatedText}` },
        ],
      });

      const choice = response.choices[0];
      if (!choice?.message.content || choice.finish_reason === "length") {
        lastError = new Error(`Groq finish_reason: ${choice?.finish_reason}`);
        continue;
      }
      return sanitizeProfile(JSON.parse(choice.message.content));
    } catch (error) {
      if (error instanceof SyntaxError || isJsonValidateFailed(error)) {
        lastError = error;
        continue;
      }
      if (error instanceof Groq.RateLimitError) {
        throw new ResumeExtractionError("ai_rate_limited", error);
      }
      throw new ResumeExtractionError("ai_request_failed", error);
    }
  }

  throw new ResumeExtractionError("ai_invalid_json", lastError);
}

function isJsonValidateFailed(error: unknown): boolean {
  if (!(error instanceof Groq.BadRequestError)) return false;
  const body = error.error;
  if (!isRecord(body) || !isRecord(body.error)) return false;
  return body.error.code === "json_validate_failed";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.map(asString).filter((item): item is string => !!item);
  return items.length ? items : undefined;
}

function sanitizeWorkExperience(value: unknown): WorkExperienceItem[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items: WorkExperienceItem[] = [];
  for (const item of value.slice(0, 3)) {
    if (!isRecord(item)) continue;
    const company = asString(item.company);
    const title = asString(item.title);
    if (!company || !title) continue;
    items.push({
      company,
      title,
      startDate: asString(item.startDate) ?? "",
      endDate: asString(item.endDate),
      current: item.current === true,
      responsibilities: asString(item.responsibilities),
    });
  }
  return items.length ? items : undefined;
}

function sanitizeEducation(value: unknown): EducationItem[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items: EducationItem[] = [];
  for (const item of value.slice(0, 1)) {
    if (!isRecord(item)) continue;
    const institution = asString(item.institution);
    if (!institution) continue;
    items.push({
      degree: asString(item.degree) ?? "",
      field: asString(item.field) ?? "",
      institution,
      year: asString(item.year) ?? (typeof item.year === "number" ? item.year : ""),
    });
  }
  return items.length ? items : undefined;
}

function sanitizeProfile(raw: unknown): ExtractedProfile {
  if (!isRecord(raw)) throw new SyntaxError("Groq response is not an object");

  const experienceLevel = asString(raw.experience_level);
  const years = raw.years_experience;

  const profile: ExtractedProfile = {
    full_name: asString(raw.full_name),
    phone: asString(raw.phone),
    location: asString(raw.location),
    current_title: asString(raw.current_title),
    experience_level:
      experienceLevel && ["junior", "mid", "senior", "lead"].includes(experienceLevel)
        ? experienceLevel
        : undefined,
    years_experience:
      typeof years === "number" && Number.isFinite(years) && years >= 0
        ? Math.round(years)
        : undefined,
    skills: asStringArray(raw.skills),
    industries: asStringArray(raw.industries),
    work_experience: sanitizeWorkExperience(raw.work_experience),
    education: sanitizeEducation(raw.education),
    job_titles_seeking: asStringArray(raw.job_titles_seeking),
    linkedin_url: asString(raw.linkedin_url),
    portfolio_url: asString(raw.portfolio_url),
  };

  return Object.fromEntries(
    Object.entries(profile).filter(([, value]) => value !== undefined),
  );
}
