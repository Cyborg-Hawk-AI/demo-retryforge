export type Platform = "n8n" | "Make" | "Zapier";
export type ExecutionStatus = "running" | "success" | "retrying" | "failed" | "stuck" | "dead_letter";
export type FailureTag = "timeout" | "rate_limit" | "auth_error" | "network" | "payload_error" | "platform_error";

export interface Connection {
  id: string;
  platform: Platform;
  name: string;
  company: string;
  webhookUrl: string;
  status: "connected" | "degraded" | "disconnected";
  lastPing: string;
  executionsToday: number;
}

export interface Execution {
  id: string;
  workflow: string;
  platform: Platform;
  company: string;
  status: ExecutionStatus;
  startedAt: string;
  duration: string;
  attempt: number;
  maxAttempts: number;
  failureTag?: FailureTag;
  failureReason?: string;
}

export interface DeadLetterItem {
  id: string;
  workflow: string;
  platform: Platform;
  company: string;
  failedAt: string;
  attempts: number;
  failureTag: FailureTag;
  failureReason: string;
  payload: string;
}

export interface RetryPolicy {
  id: string;
  name: string;
  workflow: string;
  platform: Platform;
  maxAttempts: number;
  backoff: "exponential" | "linear" | "fixed";
  baseDelay: number;
  windowStart: string;
  windowEnd: string;
  enabled: boolean;
}

export interface Alert {
  id: string;
  channel: "slack" | "email";
  destination: string;
  workflow: string;
  triggeredAt: string;
  message: string;
  acknowledged: boolean;
}

export interface ActivityItem {
  id: string;
  time: string;
  message: string;
  type: "retry" | "success" | "alert" | "connect" | "dead_letter";
}

export const connections: Connection[] = [
  {
    id: "conn-1",
    platform: "n8n",
    name: "Order Fulfillment Pipeline",
    company: "Meridian Commerce",
    webhookUrl: "https://hooks.retryforge.io/v1/n8n/meridian-ord-7f3a",
    status: "connected",
    lastPing: "12s ago",
    executionsToday: 2847,
  },
  {
    id: "conn-2",
    platform: "Make",
    name: "CRM Sync — HubSpot ↔ Salesforce",
    company: "Brightpath Analytics",
    webhookUrl: "https://hooks.retryforge.io/v1/make/brightpath-crm-9b2c",
    status: "connected",
    lastPing: "8s ago",
    executionsToday: 1203,
  },
  {
    id: "conn-3",
    platform: "Zapier",
    name: "Invoice Processing Automation",
    company: "Ledgerly FinOps",
    webhookUrl: "https://hooks.retryforge.io/v1/zapier/ledgerly-inv-4d1e",
    status: "degraded",
    lastPing: "2m ago",
    executionsToday: 891,
  },
  {
    id: "conn-4",
    platform: "n8n",
    name: "Inventory Webhook Router",
    company: "StockPulse Retail",
    webhookUrl: "https://hooks.retryforge.io/v1/n8n/stockpulse-inv-2a8f",
    status: "connected",
    lastPing: "5s ago",
    executionsToday: 4521,
  },
  {
    id: "conn-5",
    platform: "Make",
    name: "Employee Onboarding Flow",
    company: "Northwind HR Systems",
    webhookUrl: "https://hooks.retryforge.io/v1/make/northwind-onb-6c4d",
    status: "connected",
    lastPing: "15s ago",
    executionsToday: 156,
  },
];

export const executions: Execution[] = [
  {
    id: "exec-88421",
    workflow: "Order Fulfillment Pipeline",
    platform: "n8n",
    company: "Meridian Commerce",
    status: "running",
    startedAt: "2026-07-11 11:58:42 UTC",
    duration: "4m 18s",
    attempt: 1,
    maxAttempts: 5,
  },
  {
    id: "exec-88419",
    workflow: "CRM Sync — HubSpot ↔ Salesforce",
    platform: "Make",
    company: "Brightpath Analytics",
    status: "retrying",
    startedAt: "2026-07-11 11:55:03 UTC",
    duration: "7m 57s",
    attempt: 3,
    maxAttempts: 5,
    failureTag: "rate_limit",
    failureReason: "Salesforce API rate limit exceeded (429)",
  },
  {
    id: "exec-88415",
    workflow: "Invoice Processing Automation",
    platform: "Zapier",
    company: "Ledgerly FinOps",
    status: "stuck",
    startedAt: "2026-07-11 11:42:11 UTC",
    duration: "20m 49s",
    attempt: 2,
    maxAttempts: 4,
    failureTag: "timeout",
    failureReason: "Zapier task exceeded 15-minute execution window",
  },
  {
    id: "exec-88410",
    workflow: "Inventory Webhook Router",
    platform: "n8n",
    company: "StockPulse Retail",
    status: "success",
    startedAt: "2026-07-11 11:40:22 UTC",
    duration: "1m 12s",
    attempt: 2,
    maxAttempts: 5,
    failureTag: "network",
    failureReason: "Transient DNS resolution failure on attempt 1",
  },
  {
    id: "exec-88405",
    workflow: "Employee Onboarding Flow",
    platform: "Make",
    company: "Northwind HR Systems",
    status: "success",
    startedAt: "2026-07-11 11:38:55 UTC",
    duration: "45s",
    attempt: 1,
    maxAttempts: 3,
  },
  {
    id: "exec-88398",
    workflow: "Order Fulfillment Pipeline",
    platform: "n8n",
    company: "Meridian Commerce",
    status: "failed",
    startedAt: "2026-07-11 11:30:00 UTC",
    duration: "12m 30s",
    attempt: 5,
    maxAttempts: 5,
    failureTag: "auth_error",
    failureReason: "Shopify OAuth token expired mid-execution",
  },
  {
    id: "exec-88390",
    workflow: "CRM Sync — HubSpot ↔ Salesforce",
    platform: "Make",
    company: "Brightpath Analytics",
    status: "success",
    startedAt: "2026-07-11 11:22:18 UTC",
    duration: "2m 08s",
    attempt: 1,
    maxAttempts: 5,
  },
  {
    id: "exec-88385",
    workflow: "Invoice Processing Automation",
    platform: "Zapier",
    company: "Ledgerly FinOps",
    status: "retrying",
    startedAt: "2026-07-11 11:15:44 UTC",
    duration: "47m 16s",
    attempt: 4,
    maxAttempts: 4,
    failureTag: "payload_error",
    failureReason: "QuickBooks line item schema mismatch",
  },
];

export const deadLetterQueue: DeadLetterItem[] = [
  {
    id: "dlq-301",
    workflow: "Order Fulfillment Pipeline",
    platform: "n8n",
    company: "Meridian Commerce",
    failedAt: "2026-07-11 11:30:00 UTC",
    attempts: 5,
    failureTag: "auth_error",
    failureReason: "Shopify OAuth token expired mid-execution",
    payload: '{"order_id":"ORD-92841","shop":"meridian-store.myshopify.com","items":12}',
  },
  {
    id: "dlq-298",
    workflow: "Invoice Processing Automation",
    platform: "Zapier",
    company: "Ledgerly FinOps",
    failedAt: "2026-07-10 22:14:33 UTC",
    attempts: 4,
    failureTag: "payload_error",
    failureReason: "QuickBooks line item schema mismatch",
    payload: '{"invoice_id":"INV-44102","vendor":"Acme Supplies","amount":4820.50}',
  },
  {
    id: "dlq-295",
    workflow: "CRM Sync — HubSpot ↔ Salesforce",
    platform: "Make",
    company: "Brightpath Analytics",
    failedAt: "2026-07-10 18:45:12 UTC",
    attempts: 5,
    failureTag: "rate_limit",
    failureReason: "Salesforce composite API daily limit reached",
    payload: '{"contact_id":"hs-882910","sync_direction":"hubspot_to_sf"}',
  },
  {
    id: "dlq-290",
    workflow: "Inventory Webhook Router",
    platform: "n8n",
    company: "StockPulse Retail",
    failedAt: "2026-07-09 03:22:08 UTC",
    attempts: 5,
    failureTag: "platform_error",
    failureReason: "n8n worker node OOM killed during peak load",
    payload: '{"sku":"SP-44291","warehouse":"us-east-1","qty_delta":-150}',
  },
];

export const retryPolicies: RetryPolicy[] = [
  {
    id: "pol-1",
    name: "Production — Exponential",
    workflow: "Order Fulfillment Pipeline",
    platform: "n8n",
    maxAttempts: 5,
    backoff: "exponential",
    baseDelay: 30,
    windowStart: "06:00",
    windowEnd: "22:00",
    enabled: true,
  },
  {
    id: "pol-2",
    name: "CRM Sync — Rate Limit Aware",
    workflow: "CRM Sync — HubSpot ↔ Salesforce",
    platform: "Make",
    maxAttempts: 5,
    backoff: "exponential",
    baseDelay: 120,
    windowStart: "06:00",
    windowEnd: "22:00",
    enabled: true,
  },
  {
    id: "pol-3",
    name: "Invoice — Business Hours Only",
    workflow: "Invoice Processing Automation",
    platform: "Zapier",
    maxAttempts: 4,
    backoff: "linear",
    baseDelay: 300,
    windowStart: "08:00",
    windowEnd: "18:00",
    enabled: true,
  },
  {
    id: "pol-4",
    name: "Inventory — Aggressive Retry",
    workflow: "Inventory Webhook Router",
    platform: "n8n",
    maxAttempts: 5,
    backoff: "fixed",
    baseDelay: 15,
    windowStart: "00:00",
    windowEnd: "23:59",
    enabled: true,
  },
  {
    id: "pol-5",
    name: "Onboarding — Conservative",
    workflow: "Employee Onboarding Flow",
    platform: "Make",
    maxAttempts: 3,
    backoff: "exponential",
    baseDelay: 60,
    windowStart: "07:00",
    windowEnd: "19:00",
    enabled: false,
  },
];

export const alerts: Alert[] = [
  {
    id: "alert-88",
    channel: "slack",
    destination: "#ops-alerts",
    workflow: "Order Fulfillment Pipeline",
    triggeredAt: "2026-07-11 11:30:05 UTC",
    message: "exec-88398 exceeded retry budget (5/5 attempts). Moved to dead-letter queue.",
    acknowledged: false,
  },
  {
    id: "alert-87",
    channel: "email",
    destination: "devops@ledgerly.io",
    workflow: "Invoice Processing Automation",
    triggeredAt: "2026-07-11 11:15:50 UTC",
    message: "exec-88385 on attempt 4/4 — final retry scheduled in 5 minutes.",
    acknowledged: true,
  },
  {
    id: "alert-86",
    channel: "slack",
    destination: "#automation-health",
    workflow: "CRM Sync — HubSpot ↔ Salesforce",
    triggeredAt: "2026-07-11 11:55:10 UTC",
    message: "exec-88419 retry attempt 3 triggered — backoff 240s (rate_limit).",
    acknowledged: false,
  },
  {
    id: "alert-85",
    channel: "email",
    destination: "sre@brightpath.com",
    workflow: "CRM Sync — HubSpot ↔ Salesforce",
    triggeredAt: "2026-07-10 18:45:18 UTC",
    message: "exec-88312 exceeded retry budget. Dead-letter: dlq-295.",
    acknowledged: true,
  },
];

export const activityFeed: ActivityItem[] = [
  { id: "act-1", time: "12:03:18", message: "Retry scheduled for exec-88419 (attempt 4) in 240s", type: "retry" },
  { id: "act-2", time: "12:02:44", message: "Slack alert sent to #automation-health", type: "alert" },
  { id: "act-3", time: "12:01:12", message: "exec-88410 recovered on attempt 2 — success", type: "success" },
  { id: "act-4", time: "11:58:42", message: "New execution exec-88421 started (Meridian Commerce)", type: "connect" },
  { id: "act-5", time: "11:30:05", message: "exec-88398 moved to dead-letter queue (dlq-301)", type: "dead_letter" },
  { id: "act-6", time: "11:30:00", message: "Final retry failed for exec-88398 — auth_error", type: "retry" },
  { id: "act-7", time: "11:22:26", message: "exec-88390 completed successfully (1 attempt)", type: "success" },
  { id: "act-8", time: "11:15:50", message: "Email alert sent to devops@ledgerly.io", type: "alert" },
];

export const chartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  executions: [8420, 9103, 8876, 9241, 9618, 3204, 2891],
  retries: [142, 168, 155, 189, 201, 48, 39],
  failures: [12, 18, 14, 22, 19, 5, 4],
};

export const failureTagStats: { tag: FailureTag; count: number; pct: number }[] = [
  { tag: "rate_limit", count: 47, pct: 28 },
  { tag: "timeout", count: 38, pct: 23 },
  { tag: "auth_error", count: 31, pct: 19 },
  { tag: "network", count: 24, pct: 14 },
  { tag: "payload_error", count: 18, pct: 11 },
  { tag: "platform_error", count: 8, pct: 5 },
];

export const statusColors: Record<ExecutionStatus, string> = {
  running: "bg-blue-500/20 text-blue-400 ring-blue-500/30",
  success: "bg-emerald-500/20 text-emerald-400 ring-emerald-500/30",
  retrying: "bg-amber-500/20 text-amber-400 ring-amber-500/30",
  failed: "bg-red-500/20 text-red-400 ring-red-500/30",
  stuck: "bg-orange-500/20 text-orange-400 ring-orange-500/30",
  dead_letter: "bg-purple-500/20 text-purple-400 ring-purple-500/30",
};

export const platformColors: Record<Platform, string> = {
  n8n: "bg-orange-500/20 text-orange-300",
  Make: "bg-purple-500/20 text-purple-300",
  Zapier: "bg-amber-500/20 text-amber-300",
};
