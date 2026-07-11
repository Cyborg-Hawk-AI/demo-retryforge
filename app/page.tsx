import Link from "next/link";
import {
  RefreshCw,
  Shield,
  Bell,
  Archive,
  Clock,
  Zap,
  ArrowRight,
  Check,
  Activity,
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Real-time monitoring",
    description:
      "Connect n8n, Make, or Zapier via webhook. Watch execution status live — no more polling dashboards at 2 AM.",
  },
  {
    icon: RefreshCw,
    title: "Smart retry policies",
    description:
      "Exponential backoff, max attempts, and time-window restrictions. Retry only between 6 AM–10 PM if that's your SLA.",
  },
  {
    icon: Archive,
    title: "Dead-letter queue",
    description:
      "Failed executions land in an inspectable queue. View payloads, failure reasons, and re-trigger with one click.",
  },
  {
    icon: Bell,
    title: "Slack & email alerts",
    description:
      "Get notified the moment a job exceeds its retry budget. Route alerts to the right channel per workflow.",
  },
  {
    icon: Clock,
    title: "Execution history",
    description:
      "Full audit log with failure reason tagging. Spot patterns — rate limits, auth errors, timeouts — before they cascade.",
  },
  {
    icon: Shield,
    title: "Platform-agnostic",
    description:
      "One recovery layer for every automation tool. Replace your bash scripts with a hosted service that runs itself.",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: 39,
    executions: "10,000",
    features: [
      "Up to 3 platform connections",
      "5 retry policies",
      "Dead-letter queue (30-day retention)",
      "Slack + email alerts",
      "7-day execution history",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Growth",
    price: 99,
    executions: "100,000",
    features: [
      "Unlimited connections",
      "Unlimited retry policies",
      "Dead-letter queue (90-day retention)",
      "Priority alerting + PagerDuty",
      "90-day execution history",
      "Weekly reliability digest",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-forge-900/30 via-slate-950 to-slate-950" />
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-forge-600/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-forge-500/30 bg-forge-500/10 px-4 py-1.5 text-sm text-forge-300">
            <Zap className="h-3.5 w-3.5" />
            Stop writing bash scripts to restart stuck workflows
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Auto-restart stuck{" "}
            <span className="gradient-text">n8n, Make & Zapier</span>{" "}
            executions
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            RetryForge is the hosted retry and recovery layer for production
            automation. Monitor executions in real time, configure smart retry
            policies, and get alerted before your customers notice — so you can
            finally sleep through the night.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/demo"
              className="glow-forge inline-flex items-center gap-2 rounded-lg bg-forge-600 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-forge-500"
            >
              Explore Live Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/developers"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-8 py-3.5 text-base font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
            >
              Developer Docs
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "9,618", label: "Executions monitored today" },
              { value: "94.2%", label: "Auto-recovery rate" },
              { value: "1.8s", label: "Avg. retry dispatch" },
              { value: "0", label: "Bash scripts required" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4">
                <div className="text-2xl font-bold text-forge-400">{stat.value}</div>
                <div className="mt-1 text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-800 bg-slate-925 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything your automation stack is missing
            </h2>
            <p className="mt-4 text-slate-400">
              n8n, Make, and Zapier treat reliability as an afterthought.
              RetryForge bolts it on — without the maintenance.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass group rounded-xl p-6 transition-colors hover:border-forge-500/30"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-forge-600/20 ring-1 ring-forge-500/20 transition-colors group-hover:bg-forge-600/30">
                  <feature.icon className="h-5 w-5 text-forge-400" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Set up in 5 minutes. Runs itself forever.
            </h2>
            <p className="mt-4 text-slate-400">
              BullMQ workers poll execution status and fire retries on schedule.
              No human in the loop.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Connect your platform",
                desc: "Paste a webhook URL into n8n, Make, or Zapier. RetryForge starts monitoring immediately.",
              },
              {
                step: "02",
                title: "Configure retry policies",
                desc: "Set exponential backoff, max attempts, and business-hour windows per workflow.",
              },
              {
                step: "03",
                title: "Sleep through the night",
                desc: "Stuck jobs auto-retry. Failures land in the dead-letter queue. Slack pings you only when it matters.",
              },
            ].map((item) => (
              <div key={item.step} className="relative glass rounded-xl p-6">
                <span className="font-mono text-3xl font-bold text-forge-600/40">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-slate-800 bg-slate-925 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Simple pricing by execution volume
            </h2>
            <p className="mt-4 text-slate-400">
              No per-retry fees. No surprise overages. Cancel anytime.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl p-8 ${
                  tier.highlighted
                    ? "glow-forge border-2 border-forge-500/50 bg-slate-900"
                    : "glass"
                }`}
              >
                {tier.highlighted && (
                  <span className="mb-4 inline-block rounded-full bg-forge-600/20 px-3 py-1 text-xs font-semibold text-forge-300">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-semibold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Up to {tier.executions} executions/month
                </p>
                <ul className="mt-8 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-forge-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/demo"
                  className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
                    tier.highlighted
                      ? "bg-forge-600 text-white hover:bg-forge-500"
                      : "border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-2xl border border-forge-500/20 bg-gradient-to-br from-forge-950/50 to-slate-900 p-12 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-forge-600/10 to-transparent" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight">
                Replace your retry bash scripts today
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-400">
                DevOps engineers on r/automation are already building this
                themselves. RetryForge does it better — with a UI, dead-letter
                queue, and ~1.5 hours/week of owner time.
              </p>
              <Link
                href="/demo"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-forge-600 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-forge-500"
              >
                Try the interactive demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
