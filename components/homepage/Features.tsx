type JobRow = {
  company: string;
  score: number;
  salary: string;
  source: "LinkedIn" | "URL";
  scoreColor: string;
};

const mockJobs: JobRow[] = [
  {
    company: "Vercel",
    score: 94,
    salary: "$160k - $200k",
    source: "LinkedIn",
    scoreColor: "bg-success",
  },
  {
    company: "Stripe",
    score: 88,
    salary: "$180k - $240k",
    source: "URL",
    scoreColor: "bg-info-dark",
  },
  {
    company: "Linear",
    score: 96,
    salary: "$150k - $190k",
    source: "LinkedIn",
    scoreColor: "bg-success",
  },
  {
    company: "Notion",
    score: 72,
    salary: "$130k - $170k",
    source: "LinkedIn",
    scoreColor: "bg-warning",
  },
  {
    company: "OpenAI",
    score: 91,
    salary: "$200k - $280k",
    source: "LinkedIn",
    scoreColor: "bg-success",
  },
  {
    company: "Figma",
    score: 85,
    salary: "$170k - $220k",
    source: "URL",
    scoreColor: "bg-info-dark",
  },
];

function CompanyIcon({ name }: { name: string }) {
  if (name === "Vercel") {
    return (
      <div className="w-7 h-7 rounded-md bg-surface-secondary border border-border-light flex items-center justify-center">
        <svg width="12" height="10" viewBox="0 0 12 10" fill="currentColor">
          <path d="M6 0L12 10H0L6 0Z" />
        </svg>
      </div>
    );
  }
  if (name === "Stripe") {
    return (
      <div className="w-7 h-7 rounded-md bg-surface-secondary border border-border-light flex items-center justify-center font-bold text-xs text-text-primary">
        S
      </div>
    );
  }
  if (name === "Linear") {
    return (
      <div className="w-7 h-7 rounded-md bg-surface-secondary border border-border-light flex items-center justify-center font-bold text-xs text-text-primary">
        L
      </div>
    );
  }
  if (name === "Notion") {
    return (
      <div className="w-7 h-7 rounded-md bg-surface-secondary border border-border-light flex items-center justify-center font-serif font-bold text-xs text-text-primary">
        N
      </div>
    );
  }
  if (name === "OpenAI") {
    return (
      <div className="w-7 h-7 rounded-md bg-surface-secondary border border-border-light flex items-center justify-center font-mono font-bold text-xs text-text-primary">
        O
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-md bg-surface-secondary border border-border-light flex items-center justify-center font-bold text-xs text-text-primary">
      F
    </div>
  );
}

export function Features() {
  return (
    <div className="space-y-16 md:space-y-24 py-12 md:py-20">
      {/* FEATURE 1: Manage Your Job Search With Ease */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-6">
        <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 lg:p-16 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Heading + Value Props */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-[1.15]">
                Manage Your Job <br />
                Search With Ease
              </h2>

              <div className="mt-8 sm:mt-10 space-y-6">
                {/* Active Card / Feature 1 */}
                <div className="border-l-2 border-accent pl-5 py-1">
                  <h3 className="text-base font-semibold text-text-primary">
                    Find jobs that actually fit
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    Search by title and location or paste a job link. Get matched roles you can quickly scan.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-base font-semibold text-text-primary">
                    Know the Company Before You Apply
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    Stop guessing what a company is about. JobPilot browses their site and gives you everything you need to apply with confidence.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-base font-semibold text-text-primary">
                    Keep track of every application
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    Keep a clear view of every job you&apos;ve found, tailored. Your activity and progress all stay in one simple place.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Jobs Table Visual Card */}
            <div className="lg:col-span-7 bg-surface rounded-2xl border border-border p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border pb-3">
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Company
                      </th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Match Score
                      </th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Salary Est.
                      </th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Source
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockJobs.map((job) => (
                      <tr key={job.company} className="hover:bg-surface-secondary/60 transition-colors">
                        {/* Company */}
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <CompanyIcon name={job.company} />
                            <span className="text-sm font-semibold text-text-primary">
                              {job.company}
                            </span>
                          </div>
                        </td>

                        {/* Match Score */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-16 bg-border-light rounded-full h-1 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${job.scoreColor}`}
                                style={{ width: `${job.score}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-text-primary">
                              {job.score}%
                            </span>
                          </div>
                        </td>

                        {/* Salary */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-text-secondary font-normal">
                          {job.salary}
                        </td>

                        {/* Source Badge */}
                        <td className="py-4 pl-4 whitespace-nowrap">
                          {job.source === "LinkedIn" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-linkedin-light text-linkedin">
                              LinkedIn
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-secondary text-text-secondary border border-border-light">
                              URL
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 2: Apply With More Confidence, Every Time */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-6">
        <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 lg:p-16 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Terminal Card */}
            <div className="lg:col-span-6 rounded-2xl border border-[#272835] bg-[#131316] text-[#e5e7eb] shadow-xl overflow-hidden font-mono text-xs sm:text-[13px] leading-relaxed">
              {/* Terminal Window Header */}
              <div className="bg-[#1c1d24] px-4 py-3 flex items-center border-b border-[#2b2c3a]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="mx-auto text-xs text-text-muted">agent_log.ts</span>
                <div className="w-12" />
              </div>

              {/* Terminal Content */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-start">
                  <span className="w-8 text-text-muted select-none flex-shrink-0">1</span>
                  <div>
                    <span className="text-[#61a8ff] font-semibold">[SYSTEM]</span>{" "}
                    <span>Initializing JobPilot Agent...</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="w-8 text-text-muted select-none flex-shrink-0">2</span>
                  <div>
                    <span className="text-[#a78bfa] font-semibold">[SCAN]</span>{" "}
                    <span>Found 14 matching roles</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="w-8 text-text-muted select-none flex-shrink-0">3</span>
                  <div className="text-text-muted">
                    <span>↳ Filtered out 3 roles (below salary cap)</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="w-8 text-text-muted select-none flex-shrink-0">4</span>
                  <div>
                    <span className="text-[#34d399] font-semibold">[ACTION]</span>{" "}
                    <span>Tailoring resume for Stripe (Frontend)</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="w-8 text-text-muted select-none flex-shrink-0">5</span>
                  <div>
                    <span className="text-[#fbbf24] font-semibold">...</span>{" "}
                    <span>Generating cover letter</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Heading + Value Props */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-[1.15]">
                Apply With More <br />
                Confidence, Every Time
              </h2>

              <div className="mt-8 sm:mt-10 space-y-6">
                {/* Feature 1 */}
                <div>
                  <h3 className="text-base font-semibold text-text-primary">
                    Understand your match score
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what&apos;s missing.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-base font-semibold text-text-primary">
                    AI-Powered Job Matching
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    Stop guessing which jobs are worth applying to. JobPilot scores every role against your actual skills so you focus on the ones that matter.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-base font-semibold text-text-primary">
                    Focus on the right roles
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
