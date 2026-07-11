import Link from "next/link";
import {
  Activity,
  Archive,
  Bell,
  Cable,
  Code2,
  Database,
  RefreshCw,
  Server,
  Settings,
  History,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Cable,
    title: "Platform Connections",
    demoPath: "/demo → Connections tab",
    tryIt: "Click 'Copy webhook' on any connection, or 'View executions' to filter the monitor.",
    mocked: "Webhook URLs and ping times are static. No real platform API calls.",
    production:
      "Fastify endpoint receives platform webhooks. Connection registry in Supabase. Health checks poll platform APIs every 30s via BullMQ scheduled jobs.",
    dataFlow:
      "n8n/Make/Zapier → POST webhook → RetryForge ingress → enqueue status-check job → BullMQ worker → update execution record → WebSocket push to dashboard.",
  },
  {
    icon: Activity,
    title: "Real-time Execution Monitor",
    demoPath: "/demo → Live Monitor tab",
    tryIt: "Filter by status/platform, search by workflow name, click eye icon for details, or rotate icon to force retry.",
    mocked: "Execution list is hardcoded. Retry button updates local React state and shows a toast.",
    production:
      "BullMQ workers poll platform execution APIs every 15s. Status changes written to Supabase and pushed via WebSocket (Socket.io or SSE).",
    dataFlow:
      "Worker polls platform API → compares status → if stuck/failed, evaluate retry policy → schedule retry job with calculated backoff → update UI.",
  },
  {
    icon: Settings,
    title: "Configurable Retry Policies",
    demoPath: "/demo → Retry Policies tab",
    tryIt: "Toggle policies on/off, click Edit to change max attempts, backoff strategy, base delay, and time windows.",
    mocked: "Policy edits persist in component state only. No server-side validation.",
    production:
      "Policies stored in Postgres. At retry time, BullMQ job reads policy config: exponential delay = baseDelay * 2^attempt. Time-window check rejects retries outside business hours.",
    dataFlow:
      "User saves policy → API validates → Postgres upsert → cache invalidation → next retry job reads fresh config.",
  },
  {
    icon: Archive,
    title: "Dead-Letter Queue",
    demoPath: "/demo → Dead Letter tab",
    tryIt: "Click 'Inspect' to view payload JSON, or 'Re-trigger' to remove from DLQ and create a new running execution.",
    mocked: "DLQ items are static until re-triggered. Payload is a hardcoded JSON string.",
    production:
      "When retry budget exhausted, BullMQ moves job to dead-letter queue. Payload stored in S3, metadata in Supabase. Re-trigger enqueues fresh execution job.",
    dataFlow:
      "Max attempts reached → DLQ insert → Slack/email alert → user inspects in UI → re-trigger → new BullMQ job with attempt=1.",
  },
  {
    icon: Bell,
    title: "Slack & Email Alerting",
    demoPath: "/demo → Alerts tab",
    tryIt: "Filter by Slack/email channel. Click 'Acknowledge' on unacked alerts.",
    mocked: "No real Slack or email delivery. Acknowledgment updates local state.",
    production:
      "Alert rules per workflow. On retry-budget-exceeded event, worker fires Slack webhook (incoming webhook URL) or SendGrid transactional email. Acknowledgment stored in DB.",
    dataFlow:
      "DLQ event → alert worker → Slack API / SendGrid API → alert record in Supabase → dashboard polls or WebSocket.",
  },
  {
    icon: History,
    title: "Execution History & Failure Tags",
    demoPath: "/demo → History tab",
    tryIt: "Click failure tag pills to filter. Click any row to open execution detail modal.",
    mocked: "Tags pre-assigned in mock data. History is the same execution list filtered.",
    production:
      "Full audit log in Supabase with indexed failure_tag column. Classifier (regex + LLM) tags errors on ingest. Weekly cron aggregates tag distribution for reliability digest email.",
    dataFlow:
      "Execution fails → error message parsed → tag assigned → stored with execution → aggregated nightly → emailed in digest.",
  },
  {
    icon: RefreshCw,
    title: "Overview Dashboard & Charts",
    demoPath: "/demo → Overview tab",
    tryIt: "Switch 7d/30d/90d time range. Click failure tag cards to jump to filtered history.",
    mocked: "Chart bars are CSS-height divs with static data. Activity feed is hardcoded.",
    production:
      "Stats aggregated by nightly cron from Supabase. Chart API returns time-bucketed counts. Activity feed is real-time event stream from Redis pub/sub.",
    dataFlow:
      "Cron job → aggregate executions/retries/failures → write to stats table → API serves chart data → React renders.",
  },
  {
    icon: Cable,
    title: "Add Connection Wizard",
    demoPath: "/demo → 'Add Connection' button (top right)",
    tryIt: "3-step wizard: select platform → copy webhook URL → verify connection.",
    mocked: "Verification always succeeds. No connection actually created.",
    production:
      "Wizard creates connection record, generates unique webhook token, returns setup instructions per platform. Test ping validates connectivity before marking active.",
    dataFlow:
      "User clicks Add → API creates connection + token → user configures platform → test execution received → status=connected.",
  },
];

const architecture = [
  { layer: "Frontend", tech: "Next.js 14 + React dashboard", role: "Workspace UI, real-time execution views, policy editor" },
  { layer: "API", tech: "Node.js / Fastify", role: "Webhook ingress, REST API for CRUD, WebSocket gateway" },
  { layer: "Queue", tech: "BullMQ + Redis", role: "Status polling, retry scheduling, alert dispatch" },
  { layer: "Storage", tech: "Supabase (Postgres) + S3", role: "Execution history, policies, DLQ payloads" },
  { layer: "Billing", tech: "Stripe Billing", role: "Subscription tiers, usage metering, receipts" },
  { layer: "Alerts", tech: "Slack webhooks + SendGrid", role: "Retry-budget-exceeded notifications" },
  { layer: "Support", tech: "AI triage bot", role: "Queries customer's execution log to explain failures" },
];

export const metadata = {
  title: "Developer Docs — RetryForge",
  description: "Feature documentation for RetryForge: what's mocked in the demo vs. production architecture.",
};

export default function DevelopersPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-500/30 bg-forge-500/10 px-3 py-1 text-xs font-semibold text-forge-300">
            <Code2 className="h-3.5 w-3.5" />
            Developer Documentation
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Every feature in the demo — mapped to production
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            This page documents each interactive section in the{" "}
            <Link href="/demo" className="text-forge-400 hover:underline">
              live demo
            </Link>
            : what it does, where to click, what&apos;s mocked, and how it would work in a real deployment.
          </p>
        </div>

        {/* Architecture overview */}
        <section className="mb-16">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
            <Server className="h-6 w-6 text-forge-400" />
            Production Architecture
          </h2>
          <div className="glass overflow-hidden rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-xs text-slate-500">
                  <th className="px-4 py-3">Layer</th>
                  <th className="px-4 py-3">Technology</th>
                  <th className="px-4 py-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {architecture.map((row) => (
                  <tr key={row.layer} className="border-b border-slate-800/50">
                    <td className="px-4 py-3 font-medium">{row.layer}</td>
                    <td className="px-4 py-3 font-mono text-xs text-forge-400">{row.tech}</td>
                    <td className="px-4 py-3 text-slate-400">{row.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            MVP estimate: Node.js/Fastify backend + BullMQ for job queue + Redis + Supabase for history + React dashboard — 3–4 weeks to MVP supporting n8n webhooks.
          </p>
        </section>

        {/* Feature docs */}
        <section className="space-y-8">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Database className="h-6 w-6 text-forge-400" />
            Feature Reference
          </h2>
          {features.map((feature, i) => (
            <div key={feature.title} className="glass rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forge-600/20">
                  <feature.icon className="h-5 w-5 text-forge-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">
                      {i + 1}. {feature.title}
                    </h3>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Where to try it
                      </p>
                      <p className="mt-1 text-sm text-forge-300">{feature.demoPath}</p>
                      <p className="mt-2 text-sm text-slate-400">{feature.tryIt}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-500/80">
                        Mocked in demo
                      </p>
                      <p className="mt-1 text-sm text-slate-400">{feature.mocked}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500/80">
                      Production implementation
                    </p>
                    <p className="mt-1 text-sm text-slate-300">{feature.production}</p>
                  </div>
                  <div className="mt-4 rounded-lg bg-slate-800/50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Data flow
                    </p>
                    <p className="mt-1 font-mono text-xs leading-relaxed text-slate-400">
                      {feature.dataFlow}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* DEV NOTE badges */}
        <section className="mt-16">
          <h2 className="mb-4 text-2xl font-bold">DEV NOTE Tooltips</h2>
          <p className="text-slate-400">
            Throughout the demo, amber <span className="font-semibold text-amber-400">DEV NOTE</span> badges appear beside major controls. Click any badge to see a tooltip explaining what that feature does in production and how it integrates with the backend. These are the in-demo equivalent of this documentation page — scoped to the specific control you&apos;re looking at.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-16 rounded-xl border border-forge-500/20 bg-forge-950/30 p-8 text-center">
          <h3 className="text-xl font-semibold">Ready to explore?</h3>
          <p className="mt-2 text-slate-400">
            Every button in the demo is wired. No dead controls, no placeholders.
          </p>
          <Link
            href="/demo"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-forge-600 px-6 py-3 text-sm font-semibold text-white hover:bg-forge-500"
          >
            Open Live Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
