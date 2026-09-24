import { NextResponse, type NextRequest } from "next/server";

import {
  extractProfileFromText,
  extractResumeText,
  MAX_RESUME_BYTES,
  ResumeExtractionError,
  type ResumeExtractionFailureReason,
} from "@/agent/resume-extractor";
import { createInsforgeServer } from "@/lib/insforge-server";
import { getPostHogClient } from "@/lib/posthog-server";

type FailureReason =
  | ResumeExtractionFailureReason
  | "missing_file"
  | "not_pdf"
  | "file_too_large"
  | "unexpected_error";

const REQUEST_FAILURES: Record<
  "missing_file" | "not_pdf" | "file_too_large",
  string
> = {
  missing_file: "No resume file was received. Please select a PDF.",
  not_pdf: "Only PDF files are supported.",
  file_too_large: "This PDF is larger than 5 MB. Please upload a smaller file.",
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const insforge = await createInsforgeServer();
  const { data: authData } = await insforge.auth.getCurrentUser();
  const userId = authData?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  const posthog = getPostHogClient();
  const sessionId = request.headers.get("x-posthog-session-id") ?? undefined;
  const capture = async (
    event: string,
    properties: Record<string, unknown> = {},
  ): Promise<void> => {
    if (!posthog) return;
    posthog.capture({
      distinctId: userId,
      event,
      properties: { userId, $session_id: sessionId, ...properties },
    });
    await posthog.flush();
  };
  const fail = async (
    reason: FailureReason,
    message: string,
    status: number,
  ): Promise<NextResponse> => {
    await capture("resume_extraction_failed", { reason });
    return NextResponse.json({ error: message, reason }, { status });
  };

  await capture("resume_extraction_attempted");

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("resume");
  if (!(file instanceof File) || file.size === 0) {
    return fail("missing_file", REQUEST_FAILURES.missing_file, 400);
  }
  if (file.type !== "application/pdf") {
    return fail("not_pdf", REQUEST_FAILURES.not_pdf, 400);
  }
  if (file.size > MAX_RESUME_BYTES) {
    return fail("file_too_large", REQUEST_FAILURES.file_too_large, 400);
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeText = await extractResumeText(buffer);
    const profile = await extractProfileFromText(resumeText);

    await capture("resume_extraction_completed", {
      fieldsExtracted: Object.keys(profile).length,
      resumeChars: resumeText.length,
    });
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("[api/resume/extract] extraction failed:", error);
    posthog?.captureException(error, userId, { $session_id: sessionId });

    if (error instanceof ResumeExtractionError) {
      const status = error.reason.startsWith("pdf_") ? 422 : 502;
      return fail(error.reason, error.userMessage, status);
    }
    return fail(
      "unexpected_error",
      "Something went wrong while reading your resume. Please try again.",
      500,
    );
  }
}
