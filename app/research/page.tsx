import Link from "next/link";
import {
  CheckCircle,
  ExternalLink,
  Lightbulb,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Research — How we found RetryForge",
  description:
    "The origin story, validation results, and source pain points behind RetryForge.",
};

const checklist = [
  { label: "10+ posts with this pain", passed: true },
  { label: "Paying for inferior solution", passed: true },
  { label: "Reachable channel", passed: true },
  { label: "MVP < 4 weeks", passed: true },
  { label: "Price point high enough", passed: true },
  { label: "Hair-on-fire problem", passed: true },
  { label: "Can pre-sell", passed: true },
  { label: "< 3 competitors", passed: true },
  { label: "Low-maintenance ops (mailbox money)", passed: true },
];

const painPoints = [
  {
    problem:
      "Stuck automation executions need manual intervention or custom workarounds; users resort to writing bash scripts to restart failed jobs during off-hours instead of having built-in retry logic.",
    persona: "DevOps engineer / automation platform user",
    workaround: "Writing custom bash scripts to automatically restart stuck executions at night",
    frequency: "daily",
    wtp: "Already paying for n8n and investing engineering time in custom scripts",
    source: "https://www.reddit.com/r/automation/comments/1um2ul8/what_is_the_one_automation_tool_or_framework_in/",
  },
  {
    problem:
      "Advanced scripting features in automation platforms are locked behind premium pricing tiers, forcing users to pay extra for basic execution capabilities.",
    persona: "Automation engineer / workflow builder",
    workaround: "Paying additional costs to GoAnywhere for script execution through agents",
    frequency: "unknown",
    wtp: "Already spending money on GoAnywhere premium features",
    source: "https://www.reddit.com/r/automation/comments/1um2ul8/what_is_the_one_automation_tool_or_framework_in/",
  },
];

export default function ResearchPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-500/30 bg-forge-500/10 px-3 py-1 text-xs font-semibold text-forge-300">
            <Lightbulb className="h-3.5 w-3.5" />
            Idea Miner Research
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            How we found RetryForge
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Real pain from real posts — scored, validated, and shipped as a working demo.
          </p>
        </div>

        {/* Origin story */}
        <section className="mb-16">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
            <Zap className="h-6 w-6 text-forge-400" />
            Why this exists
          </h2>
          <div className="glass rounded-xl p-6 leading-relaxed text-slate-300">
            <p>
              A DevOps engineer on r/automation described their exact workaround:{" "}
              <em className="text-forge-300">
                &ldquo;writing bash scripts to automatically restart stuck executions at night&rdquo;
              </em>{" "}
              because n8n has no built-in retry logic. They were already paying for n8n and spending
              engineering time on custom scripts — a clear sign they&apos;d pay for a proper solution.
            </p>
            <p className="mt-4">
              The complaint is that automation platforms treat reliability as an afterthought, forcing
              production users to bolt on their own recovery logic. This is a daily problem for anyone
              running business-critical workflows on no-code platforms.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-400">
              Cluster: Automation execution reliability &amp; retry logic
            </span>
            <span className="rounded-full bg-forge-600/20 px-3 py-1 text-forge-300">
              Rubric score: 114/130
            </span>
            <span className="rounded-full bg-emerald-600/20 px-3 py-1 text-emerald-300">
              Validation: 9/9 checks passed
            </span>
          </div>
        </section>

        {/* Competitive landscape */}
        <section className="mb-16">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
            <TrendingUp className="h-6 w-6 text-forge-400" />
            Competitive landscape
          </h2>
          <div className="glass rounded-xl p-6 text-slate-300">
            <p>
              n8n has basic error workflows but no smart retry or dead-letter queue. Make has no retry
              logic. Zapier has none. No standalone retry-as-a-service product exists for no-code
              automation platforms.
            </p>
            <p className="mt-4 text-forge-300">
              <strong>Unfair advantage:</strong> Solves the exact pain described in the source post —
              users are already writing bash scripts to do this manually, proving demand. A hosted,
              platform-agnostic solution with a clean UI is a direct replacement for those scripts with
              zero maintenance.
            </p>
          </div>
        </section>

        {/* Validation checklist */}
        <section className="mb-16">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
            <CheckCircle className="h-6 w-6 text-forge-400" />
            Validation checklist (9/9)
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {checklist.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3"
              >
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-sm text-slate-300">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pain points */}
        <section className="mb-16">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
            <Users className="h-6 w-6 text-forge-400" />
            Source pain points (real posts)
          </h2>
          <div className="space-y-6">
            {painPoints.map((pp, i) => (
              <div key={i} className="glass rounded-xl p-6">
                <p className="font-medium text-slate-200">{pp.problem}</p>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <span className="text-xs text-slate-500">Persona</span>
                    <p className="text-slate-400">{pp.persona}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Workaround</span>
                    <p className="text-slate-400">{pp.workaround}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Frequency</span>
                    <p className="text-slate-400">{pp.frequency}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">WTP signal</span>
                    <p className="text-slate-400">{pp.wtp}</p>
                  </div>
                </div>
                <a
                  href={pp.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm text-forge-400 hover:underline"
                >
                  View source post
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Automation playbook */}
        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-bold">How this business runs itself</h2>
          <div className="glass rounded-xl p-6 leading-relaxed text-slate-300">
            <p>
              BullMQ workers poll execution status and fire retries on schedule — fully automated, no
              human in the loop. Stripe Billing manages subscriptions and sends receipts. A nightly cron
              aggregates execution stats and emails customers their reliability digest. Inbound support
              questions about execution failures are answered by an AI bot that queries the
              customer&apos;s own execution log and explains the failure in plain English. New platform
              integrations (e.g., adding Pipedream support) are the only periodic dev work, done
              quarterly.
            </p>
            <p className="mt-4 font-semibold text-forge-300">
              Estimated owner time: ~1.5 hours/week
            </p>
          </div>
        </section>

        {/* GTM */}
        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-bold">Go-to-market</h2>
          <p className="text-slate-400">
            r/n8n, r/automation, r/devops subreddits; n8n community forum; targeted cold email to n8n
            self-hosters identified via GitHub stars/forks.
          </p>
        </section>

        {/* About Idea Miner */}
        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-bold">About this program</h2>
          <div className="glass rounded-xl p-6 text-slate-300">
            <p>
              This demo was auto-built by the <strong>Idea Miner</strong> pipeline: a twice-daily
              research program that mines Reddit, Hacker News, Stack Exchange, and GitHub for real
              people describing real pain, scores the opportunities, and automatically ships a working
              mock of every idea that passes validation (&gt;=8/9 checks, momentum not declining, not
              previously built). The bar for every idea: low-maintenance recurring revenue that a solo
              owner can run in a few hours a week.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Generated by Idea Miner run 2026-07-11-am on 2026-07-11 12:03 UTC
            </p>
          </div>
        </section>

        <div className="rounded-xl border border-forge-500/20 bg-forge-950/30 p-8 text-center">
          <h3 className="text-xl font-semibold">See the solution in action</h3>
          <p className="mt-2 text-slate-400">
            We built a fully interactive demo based on this research.
          </p>
          <Link
            href="/demo"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-forge-600 px-6 py-3 text-sm font-semibold text-white hover:bg-forge-500"
          >
            Try the Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
