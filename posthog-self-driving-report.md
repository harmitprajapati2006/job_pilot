# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for this web application. Session Replay was already enabled; Error Tracking and Support were enabled with PostHog-managed defaults. Health checks, Error Tracking, and Support responders are enabled, and two Replay Vision monitors now push corroborated findings into the [Self-driving inbox](https://us.posthog.com/project/615472/inbox).

Fresh scout configurations are picked up within about 30 minutes. This project has no recorded sessions yet, so Replay Vision observations will begin once browser sessions are captured.

## AI data processing

Approved by the setup gate.

## GitHub

The PostHog GitHub App was already connected before this run. GitHub Issues was not selected in the integration prompt, so no GitHub Issues warehouse source or inbox responder was added.

## Products enabled

| Product | Result | SDK check |
|---|---|---|
| Session Replay | Already enabled | Clean: the browser SDK initialization does not disable session recording. |
| Error Tracking | Enabled | Clean: the browser SDK sets exception capture to `true`. |
| Support | Enabled | An inbound Support channel is still required before tickets can arrive. |

## Signal sources

| Signal source | Action | Configuration ID |
|---|---|---|
| `health_checks` / `health_issue` | Enabled | `01a0b289-6cab-7660-b79b-ed7b94ce5277` |
| `error_tracking` / `issue_created` | Enabled | `01a0b289-6da1-77dc-832c-1e6ba2739cb4` |
| `error_tracking` / `issue_reopened` | Enabled | `01a0b289-6d93-78a4-aa59-3d7dff7d98c2` |
| `error_tracking` / `issue_spiking` | Enabled | `01a0b289-6c6a-7c77-9d96-c324496fc66b` |
| `conversations` / `ticket` | Enabled | `01a0b289-6d8e-7748-8578-b446aff88278` |
| `signals_scout` / `cross_source_issue` | On by default; no row needed | — |
| Session replay responder | Deliberately skipped; covered by Replay Vision scanners below | — |

## Connected tools

The connected-tools selection was dismissed, so all offered tools are recorded as **not used** for this setup. No external data warehouse sources were detected, and no connected-tool responders were enabled.

## Scout troop

**Active (4):**

| Scout | Why it is active |
|---|---|
| General | Cross-product correlations and uncovered surfaces. |
| Product analytics | Core workflow and behavior regressions. |
| Web analytics | Traffic, acquisition, and landing-page health. |
| Health checks | Actionable telemetry and setup health issues. |

**Disabled (23):** AI observability, anomaly detection, APM, conversations, CSP violations, customer analytics, data pipelines, data warehouse, error tracking, experiments, feature flags, inbox validation, insight alerts, logs, MCP tool calls, observability gaps, Replay Vision, revenue analytics, session replay, skills store, surveys, tasks, and web vitals.

These were paused to keep the recurring troop focused. Error Tracking and Session Replay are intentionally covered by their native responder and Replay Vision scanners, respectively. The other disabled specialists can be enabled later if their product surfaces become active.

| Budget setting | Value |
|---|---|
| Maximum runs per day | 100 |
| Runs used today | 0 |
| Runs remaining today | 100 |
| Per-tick limit | 3 |

> Scouts are in early access. Each project gets up to 100 scout runs a day; the project announcement includes instructions for requesting more.

## Custom scouts

No custom scouts were created. A job-search outcome watcher was proposed to detect persistent empty or lower-quality discovery results, but the proposal was dismissed. It would have complemented the broader Product analytics scout with a domain-specific result-quality discriminator.

Considered but not proposed as separate scouts:

- Profile completion and company research are already within the broad product workflow coverage and lack a confirmed, complete success/failure event pair in the current implementation.
- Error and replay surfaces are covered through their dedicated routes.

If a future custom scout becomes noisy, set `emit: false` on its configuration in PostHog to run it in dry-run mode.

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes what it finds to the inbox. These are the only components in this setup that spend Replay Vision credit. Findings arrive at half weight and need corroboration before promotion into a report.

| Scanner | Status | What it watches | Query scope | Sampling | Estimate |
|---|---|---|---|---|---|
| Broken job discovery experiences | Created | Visible failures in job search, job lists, match scores, details, company research, and profile/resume actions. | Recordings that include `/find-jobs`, the documented job-discovery completion flow. | 50% | 0 observations / 0 credits per month from the current 7-day lookback. |
| Job search user frustration | Created | Visible repeated attempts or abandonment around search, filters, job details, research, profile, and resume controls. | `$rageclick` recordings only. | 100% | 0 observations / 0 credits per month from the current 7-day lookback. |

Replay Vision has 2,500 credits remaining in the current period, with none spent or projected by existing scanners. The scanners are enabled and signal-emitting, but remain idle until recordings arrive.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog so the enabled Support responder has tickets to process.
- [ ] Generate browser traffic and confirm Session Replay recordings arrive; the two Replay Vision scanners will then begin observing automatically.
- [ ] If job-search telemetry is implemented, consider re-enabling the proposed custom job-search outcome scout.
- [ ] The MCP connection lacks event/property-definition read scope, so the scanner targeting could not be independently schema-verified through the API.

## What happens next

Within about 30 minutes, the scout coordinator will pick up the active scouts. Findings cluster into reports in the [Self-driving inbox](https://us.posthog.com/project/615472/inbox); immediately actionable findings can begin coding tasks. Rate Replay Vision observations as they arrive to receive configuration recommendations for each scanner.

## Files modified or created

- Created `posthog-self-driving-report.md`.
- No application source files were modified.
