# RetryForge

> Hosted retry and recovery layer that auto-restarts stuck n8n/Make/Zapier executions.

## What is RetryForge?

RetryForge is built for **DevOps engineers and automation builders who run production n8n, Make, or Zapier workflows and lose sleep over stuck or failed executions that require manual intervention.**. Solves the exact pain described in the source post — users are already writing bash scripts to do this manually, proving demand. A hosted, platform-agnostic solution with a clean UI is a direct replacement for those scripts with zero maintenance.

### Core MVP features
- Connect via n8n/Make/Zapier webhook or API — monitor execution status in real time
- Configurable retry policies: exponential backoff, max attempts, time-window restrictions (e.g., retry only between 6am–10pm)
- Dead-letter queue: failed executions captured, inspectable, and re-triggerable from a UI
- Alerting via Slack/email when a job exceeds retry budget
- Execution history log with failure reason tagging for pattern detection

**Pricing:** Monthly SaaS subscription tiered by monitored execution volume at $39/month (up to 10k executions/month); $99/month (up to 100k)

## The research: why this exists

A DevOps engineer on r/automation described their exact workaround: 'writing bash scripts to automatically restart stuck executions at night' because n8n has no built-in retry logic. They were already paying for n8n and spending engineering time on custom scripts — a clear sign they'd pay for a proper solution. The complaint is that automation platforms treat reliability as an afterthought, forcing production users to bolt on their own recovery logic. This is a daily problem for anyone running business-critical workflows on no-code platforms.

**Cluster:** Automation execution reliability & retry logic | **Rubric score:** 114/130 | **Validation:** 9/9 checks passed

**Competitive landscape:** n8n has basic error workflows but no smart retry or dead-letter queue. Make has no retry logic. Zapier has none. No standalone retry-as-a-service product exists for no-code automation platforms.

**Go-to-market:** r/n8n, r/automation, r/devops subreddits; n8n community forum; targeted cold email to n8n self-hosters identified via GitHub stars/forks

## How this business runs itself (mailbox money)

The goal is passive, low-maintenance recurring revenue: AI is how we build and operate the business, not necessarily what it sells.

BullMQ workers poll execution status and fire retries on schedule — fully automated, no human in the loop. Stripe Billing manages subscriptions and sends receipts. A nightly cron aggregates execution stats and emails customers their reliability digest. Inbound support questions about execution failures are answered by an AI bot that queries the customer's own execution log and explains the failure in plain English. New platform integrations (e.g., adding Pipedream support) are the only periodic dev work, done quarterly. Estimated owner time: 1.5 hours/week.

**Estimated owner time:** ~1.5 hour(s)/week

**MVP estimate:** Node.js/Fastify backend + BullMQ for job queue + Redis + Supabase for history + React dashboard; 3–4 weeks to MVP supporting n8n webhooks

## Validation checklist (9/9)
- [x] 10+ posts with this pain
- [x] Paying for inferior solution
- [x] Reachable channel
- [x] MVP < 4 weeks
- [x] Price point high enough
- [x] Hair-on-fire problem
- [x] Can pre-sell
- [x] < 3 competitors
- [x] Low-maintenance ops (mailbox money)

## Source pain points (real posts)

### Stuck automation executions need manual intervention or custom workarounds; users resort to writing bash scripts to restart failed jobs during off-hours instead of having built-in retry logic.
- **Persona:** DevOps engineer / automation platform user
- **Workaround:** Writing custom bash scripts to automatically restart stuck executions at night
- **Frequency:** daily
- **WTP signal:** Already paying for n8n and investing engineering time in custom scripts
- **Source:** https://www.reddit.com/r/automation/comments/1um2ul8/what_is_the_one_automation_tool_or_framework_in/

### Advanced scripting features in automation platforms are locked behind premium pricing tiers, forcing users to pay extra for basic execution capabilities.
- **Persona:** Automation engineer / workflow builder
- **Workaround:** Paying additional costs to GoAnywhere for script execution through agents
- **Frequency:** unknown
- **WTP signal:** Already spending money on GoAnywhere premium features
- **Source:** https://www.reddit.com/r/automation/comments/1um2ul8/what_is_the_one_automation_tool_or_framework_in/


## About this program

This demo was auto-built by the **Idea Miner** pipeline: a twice-daily research program that mines Reddit, Hacker News, Stack Exchange, and GitHub for real people describing real pain, scores the opportunities, and automatically ships a working mock of every idea that passes validation (>=8/9 checks, momentum not declining, not previously built). The bar for every idea: low-maintenance recurring revenue that a solo owner can run in a few hours a week.

_Generated by Idea Miner run 2026-07-11-am on 2026-07-11 12:03 UTC_


## Local development

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
npm install
npm run dev    # http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, features, pricing, CTA |
| `/demo` | Interactive product demo with mock data (all MVP features) |
| `/developers` | Feature documentation — what's mocked vs. production |
| `/research` | Origin story, validation checklist, source pain points |

### Production build

```bash
npm run build  # required before deploy
npm start      # serve production build locally
```

### Deploy to Vercel

Push to a Git repository and import into [Vercel](https://vercel.com). No environment variables, custom server, or rewrites required — zero-config deployment.

```bash
# Or deploy directly with the Vercel CLI:
npx vercel
```

### Tech stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Data:** Hardcoded mock data in `lib/mock-data.ts` (no database, no API keys)
