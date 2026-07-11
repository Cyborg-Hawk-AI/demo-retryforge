"use client";

import { useState, useMemo } from "react";
import {
  Activity,
  Archive,
  Bell,
  Cable,
  Clock,
  Filter,
  History,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  X,
  Zap,
  CheckCircle,
  Mail,
  MessageSquare,
  Eye,
  Copy,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import DevNote from "@/components/DevNote";
import { useToast } from "@/components/Toast";
import {
  connections as initialConnections,
  executions as initialExecutions,
  deadLetterQueue as initialDLQ,
  retryPolicies as initialPolicies,
  alerts as initialAlerts,
  activityFeed,
  chartData,
  failureTagStats,
  statusColors,
  platformColors,
  type Execution,
  type DeadLetterItem,
  type RetryPolicy,
  type Alert,
  type Platform,
  type ExecutionStatus,
  type FailureTag,
} from "@/lib/mock-data";

type Tab = "overview" | "connections" | "monitor" | "policies" | "dlq" | "alerts" | "history";

const tabs: { id: Tab; label: string; icon: typeof Activity }[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "connections", label: "Connections", icon: Cable },
  { id: "monitor", label: "Live Monitor", icon: Zap },
  { id: "policies", label: "Retry Policies", icon: Settings },
  { id: "dlq", label: "Dead Letter", icon: Archive },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "history", label: "History", icon: History },
];

export default function DemoDashboard() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [executions, setExecutions] = useState(initialExecutions);
  const [dlq, setDlq] = useState(initialDLQ);
  const [policies, setPolicies] = useState(initialPolicies);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [connections] = useState(initialConnections);

  const [statusFilter, setStatusFilter] = useState<ExecutionStatus | "all">("all");
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null);
  const [selectedDLQ, setSelectedDLQ] = useState<DeadLetterItem | null>(null);
  const [editingPolicy, setEditingPolicy] = useState<RetryPolicy | null>(null);
  const [showConnectWizard, setShowConnectWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardPlatform, setWizardPlatform] = useState<Platform>("n8n");
  const [tagFilter, setTagFilter] = useState<FailureTag | "all">("all");
  const [alertChannelFilter, setAlertChannelFilter] = useState<"all" | "slack" | "email">("all");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");

  const filteredExecutions = useMemo(() => {
    return executions.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (platformFilter !== "all" && e.platform !== platformFilter) return false;
      if (searchQuery && !e.workflow.toLowerCase().includes(searchQuery.toLowerCase()) && !e.id.includes(searchQuery)) return false;
      return true;
    });
  }, [executions, statusFilter, platformFilter, searchQuery]);

  const filteredHistory = useMemo(() => {
    return executions.filter((e) => {
      if (tagFilter !== "all" && e.failureTag !== tagFilter) return false;
      if (platformFilter !== "all" && e.platform !== platformFilter) return false;
      return true;
    });
  }, [executions, tagFilter, platformFilter]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => alertChannelFilter === "all" || a.channel === alertChannelFilter);
  }, [alerts, alertChannelFilter]);

  const handleRetryExecution = (exec: Execution) => {
    setExecutions((prev) =>
      prev.map((e) =>
        e.id === exec.id ? { ...e, status: "retrying" as const, attempt: e.attempt + 1 } : e
      )
    );
    showToast(`Retry triggered for ${exec.id} — attempt ${exec.attempt + 1}`);
    setSelectedExecution(null);
  };

  const handleRetriggerDLQ = (item: DeadLetterItem) => {
    setDlq((prev) => prev.filter((d) => d.id !== item.id));
    setExecutions((prev) => [
      {
        id: `exec-${Date.now().toString().slice(-5)}`,
        workflow: item.workflow,
        platform: item.platform,
        company: item.company,
        status: "running",
        startedAt: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
        duration: "0s",
        attempt: 1,
        maxAttempts: 5,
      },
      ...prev,
    ]);
    showToast(`${item.id} re-triggered from dead-letter queue`);
    setSelectedDLQ(null);
  };

  const handleAckAlert = (alert: Alert) => {
    setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, acknowledged: true } : a)));
    showToast(`Alert ${alert.id} acknowledged`);
  };

  const togglePolicy = (policy: RetryPolicy) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === policy.id ? { ...p, enabled: !p.enabled } : p))
    );
    showToast(`Policy "${policy.name}" ${policy.enabled ? "disabled" : "enabled"}`);
  };

  const savePolicy = () => {
    if (!editingPolicy) return;
    setPolicies((prev) => prev.map((p) => (p.id === editingPolicy.id ? editingPolicy : p)));
    showToast(`Policy "${editingPolicy.name}" saved`);
    setEditingPolicy(null);
  };

  const copyWebhook = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast("Webhook URL copied to clipboard", "info");
  };

  const maxChartVal = Math.max(...chartData.executions);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Demo header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">RetryForge Dashboard</h1>
            <p className="text-sm text-slate-500">
              Meridian Commerce workspace · Growth plan ($99/mo)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DevNote note="In production, workspace context comes from authenticated session + Stripe subscription tier." />
            <button
              type="button"
              onClick={() => {
                setShowConnectWizard(true);
                setWizardStep(1);
              }}
              className="flex items-center gap-2 rounded-lg bg-forge-600 px-4 py-2 text-sm font-medium text-white hover:bg-forge-500"
            >
              <Cable className="h-4 w-4" />
              Add Connection
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800">
        <div className="mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-forge-500 text-forge-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-6">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Reliability Overview</h2>
              <div className="flex items-center gap-2">
                <DevNote note="Nightly cron aggregates these stats and emails customers their reliability digest." />
                {(["7d", "30d", "90d"] as const).map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => {
                      setTimeRange(range);
                      showToast(`Chart range set to ${range}`, "info");
                    }}
                    className={`rounded-md px-3 py-1 text-xs font-medium ${
                      timeRange === range
                        ? "bg-forge-600/20 text-forge-400"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Executions Monitored", value: "9,618", change: "+12.4%", icon: Activity },
                { label: "Auto-Recovered", value: "847", change: "94.2% rate", icon: RefreshCw },
                { label: "In Dead Letter", value: String(dlq.length), change: "4 items", icon: Archive },
                { label: "Pending Alerts", value: String(alerts.filter((a) => !a.acknowledged).length), change: "2 unacked", icon: Bell },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <stat.icon className="h-5 w-5 text-forge-400" />
                    <span className="text-xs text-emerald-400">{stat.change}</span>
                  </div>
                  <div className="mt-3 text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Chart */}
              <div className="glass rounded-xl p-5 lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">Execution Volume</h3>
                  <DevNote note="Chart data aggregated from Supabase execution history table, refreshed every 5 minutes." />
                </div>
                <div className="flex h-48 items-end gap-3">
                  {chartData.labels.map((label, i) => (
                    <div key={label} className="flex flex-1 flex-col items-center gap-1">
                      <div className="relative w-full">
                        <div
                          className="w-full rounded-t bg-forge-600/60 transition-all hover:bg-forge-500/70"
                          style={{ height: `${(chartData.executions[i] / maxChartVal) * 160}px` }}
                          title={`${chartData.executions[i]} executions`}
                        />
                        <div
                          className="absolute bottom-0 w-full rounded-t bg-amber-500/40"
                          style={{ height: `${(chartData.retries[i] / maxChartVal) * 160}px` }}
                          title={`${chartData.retries[i]} retries`}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-forge-600/60" /> Executions</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-500/40" /> Retries</span>
                </div>
              </div>

              {/* Activity feed */}
              <div className="glass rounded-xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">Live Activity</h3>
                  <DevNote note="WebSocket stream from BullMQ worker events. Production uses Redis pub/sub." />
                </div>
                <div className="space-y-3">
                  {activityFeed.map((item) => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <span className="shrink-0 font-mono text-xs text-slate-600">{item.time}</span>
                      <span className="text-slate-400">{item.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Failure tags */}
            <div className="glass rounded-xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Failure Pattern Detection</h3>
                <DevNote note="Tags auto-assigned by classifier analyzing error messages. Powers weekly digest insights." />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {failureTagStats.map((stat) => (
                  <button
                    key={stat.tag}
                    type="button"
                    onClick={() => {
                      setTagFilter(stat.tag);
                      setActiveTab("history");
                      showToast(`Filtered history by tag: ${stat.tag}`, "info");
                    }}
                    className="flex items-center justify-between rounded-lg border border-slate-800 p-3 text-left transition-colors hover:border-forge-500/30 hover:bg-slate-800/50"
                  >
                    <span className="font-mono text-sm text-slate-300">{stat.tag}</span>
                    <div className="text-right">
                      <div className="font-semibold">{stat.count}</div>
                      <div className="text-xs text-slate-500">{stat.pct}%</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONNECTIONS */}
        {activeTab === "connections" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Platform Connections</h2>
              <DevNote note="Each connection registers a webhook endpoint. RetryForge polls platform APIs or receives status callbacks." />
            </div>
            <div className="grid gap-4">
              {connections.map((conn) => (
                <div key={conn.id} className="glass rounded-xl p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <span className={`rounded px-2 py-1 text-xs font-semibold ${platformColors[conn.platform]}`}>
                        {conn.platform}
                      </span>
                      <div>
                        <h3 className="font-semibold">{conn.name}</h3>
                        <p className="text-sm text-slate-500">{conn.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <div className="text-slate-400">{conn.executionsToday.toLocaleString()} today</div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <span className={`h-2 w-2 rounded-full ${conn.status === "connected" ? "bg-emerald-400" : conn.status === "degraded" ? "bg-amber-400" : "bg-red-400"}`} />
                          {conn.status} · ping {conn.lastPing}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyWebhook(conn.webhookUrl)}
                        className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-600 hover:text-white"
                      >
                        <Copy className="h-3 w-3" />
                        Copy webhook
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("monitor");
                          setPlatformFilter(conn.platform);
                          showToast(`Filtered monitor by ${conn.platform}`, "info");
                        }}
                        className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
                      >
                        View executions
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 font-mono text-xs text-slate-600">{conn.webhookUrl}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIVE MONITOR */}
        {activeTab === "monitor" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold">Live Execution Monitor</h2>
              <DevNote note="BullMQ workers poll platform APIs every 15s. Status updates pushed via WebSocket to this view." />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search workflows or IDs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-forge-500 focus:outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ExecutionStatus | "all")}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300"
              >
                <option value="all">All statuses</option>
                <option value="running">Running</option>
                <option value="retrying">Retrying</option>
                <option value="stuck">Stuck</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value as Platform | "all")}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300"
              >
                <option value="all">All platforms</option>
                <option value="n8n">n8n</option>
                <option value="Make">Make</option>
                <option value="Zapier">Zapier</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setPlatformFilter("all");
                  setSearchQuery("");
                  showToast("Filters cleared", "info");
                }}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300"
              >
                <Filter className="h-3 w-3" /> Clear filters
              </button>
            </div>
            <div className="glass overflow-hidden rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-xs text-slate-500">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Workflow</th>
                    <th className="px-4 py-3">Platform</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Attempt</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExecutions.map((exec) => (
                    <tr
                      key={exec.id}
                      className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-forge-400">{exec.id}</td>
                      <td className="px-4 py-3">
                        <div>{exec.workflow}</div>
                        <div className="text-xs text-slate-500">{exec.company}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded px-2 py-0.5 text-xs ${platformColors[exec.platform]}`}>
                          {exec.platform}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusColors[exec.status]}`}>
                          {exec.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {exec.attempt}/{exec.maxAttempts}
                      </td>
                      <td className="px-4 py-3 text-slate-400">{exec.duration}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedExecution(exec)}
                            className="text-xs text-forge-400 hover:text-forge-300"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {(exec.status === "stuck" || exec.status === "failed" || exec.status === "retrying") && (
                            <button
                              type="button"
                              onClick={() => handleRetryExecution(exec)}
                              className="text-xs text-amber-400 hover:text-amber-300"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RETRY POLICIES */}
        {activeTab === "policies" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Retry Policies</h2>
              <DevNote note="Policies stored in Postgres. BullMQ reads config at job enqueue time. Backoff calculated per policy." />
            </div>
            <div className="grid gap-4">
              {policies.map((policy) => (
                <div key={policy.id} className="glass rounded-xl p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{policy.name}</h3>
                        <span className={`rounded px-2 py-0.5 text-xs ${platformColors[policy.platform]}`}>
                          {policy.platform}
                        </span>
                        {!policy.enabled && (
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-500">Disabled</span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{policy.workflow}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{policy.backoff} · {policy.baseDelay}s base</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {policy.windowStart}–{policy.windowEnd}
                      </span>
                      <span>{policy.maxAttempts} max attempts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => togglePolicy(policy)}
                        className="text-slate-400 hover:text-white"
                      >
                        {policy.enabled ? (
                          <ToggleRight className="h-6 w-6 text-forge-400" />
                        ) : (
                          <ToggleLeft className="h-6 w-6" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPolicy({ ...policy })}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:border-slate-600"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DEAD LETTER QUEUE */}
        {activeTab === "dlq" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Dead-Letter Queue</h2>
              <DevNote note="Jobs exceeding retry budget land here. Payload stored in S3, metadata in Supabase. Re-trigger enqueues new BullMQ job." />
            </div>
            <div className="glass overflow-hidden rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-xs text-slate-500">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Workflow</th>
                    <th className="px-4 py-3">Failed At</th>
                    <th className="px-4 py-3">Tag</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Attempts</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dlq.map((item) => (
                    <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-mono text-xs text-purple-400">{item.id}</td>
                      <td className="px-4 py-3">
                        <div>{item.workflow}</div>
                        <div className="text-xs text-slate-500">{item.company}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{item.failedAt}</td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-red-500/10 px-2 py-0.5 font-mono text-xs text-red-400">
                          {item.failureTag}
                        </span>
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-slate-400">{item.failureReason}</td>
                      <td className="px-4 py-3">{item.attempts}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedDLQ(item)}
                            className="text-xs text-forge-400 hover:text-forge-300"
                          >
                            Inspect
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRetriggerDLQ(item)}
                            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
                          >
                            <Play className="h-3 w-3" /> Re-trigger
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ALERTS */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Alerting</h2>
              <DevNote note="Alerts fire via Slack webhook or SendGrid when retry budget exceeded. Configurable per workflow." />
            </div>
            <div className="flex gap-2">
              {(["all", "slack", "email"] as const).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setAlertChannelFilter(ch)}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium ${
                    alertChannelFilter === ch
                      ? "bg-forge-600/20 text-forge-400"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {ch === "slack" && <MessageSquare className="h-3 w-3" />}
                  {ch === "email" && <Mail className="h-3 w-3" />}
                  {ch.charAt(0).toUpperCase() + ch.slice(1)}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`glass rounded-xl p-4 ${!alert.acknowledged ? "border-l-2 border-l-amber-500" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {alert.channel === "slack" ? (
                        <MessageSquare className="mt-0.5 h-4 w-4 text-purple-400" />
                      ) : (
                        <Mail className="mt-0.5 h-4 w-4 text-blue-400" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-500">{alert.id}</span>
                          <span className="text-xs text-slate-500">→ {alert.destination}</span>
                        </div>
                        <p className="mt-1 text-sm">{alert.message}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {alert.workflow} · {alert.triggeredAt}
                        </p>
                      </div>
                    </div>
                    {!alert.acknowledged ? (
                      <button
                        type="button"
                        onClick={() => handleAckAlert(alert)}
                        className="shrink-0 rounded-lg bg-amber-600/20 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-600/30"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="flex shrink-0 items-center gap-1 text-xs text-emerald-400">
                        <CheckCircle className="h-3.5 w-3.5" /> Acked
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Execution History & Failure Tags</h2>
              <DevNote note="Full audit log in Supabase. Tags assigned by regex + LLM classifier for pattern detection in weekly digest." />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-slate-500">Filter by tag:</span>
              {(["all", ...failureTagStats.map((s) => s.tag)] as const).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTagFilter(tag as FailureTag | "all")}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    tagFilter === tag
                      ? "bg-forge-600/20 text-forge-400"
                      : "bg-slate-800 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="glass overflow-hidden rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-xs text-slate-500">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Workflow</th>
                    <th className="px-4 py-3">Started</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Failure Tag</th>
                    <th className="px-4 py-3">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((exec) => (
                    <tr
                      key={exec.id}
                      className="cursor-pointer border-b border-slate-800/50 hover:bg-slate-800/30"
                      onClick={() => setSelectedExecution(exec)}
                    >
                      <td className="px-4 py-3 font-mono text-xs">{exec.id}</td>
                      <td className="px-4 py-3">{exec.workflow}</td>
                      <td className="px-4 py-3 text-slate-400">{exec.startedAt}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${statusColors[exec.status]}`}>
                          {exec.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {exec.failureTag ? (
                          <span className="rounded bg-red-500/10 px-2 py-0.5 font-mono text-xs text-red-400">
                            {exec.failureTag}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-slate-400">
                        {exec.failureReason || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Execution detail modal */}
      {selectedExecution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Execution Details</h3>
              <button type="button" onClick={() => setSelectedExecution(null)} className="text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">ID</span><span className="font-mono text-forge-400">{selectedExecution.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Workflow</span><span>{selectedExecution.workflow}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Company</span><span>{selectedExecution.company}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Platform</span><span>{selectedExecution.platform}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status</span><span className={`rounded-full px-2 py-0.5 text-xs ring-1 ${statusColors[selectedExecution.status]}`}>{selectedExecution.status}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Attempt</span><span>{selectedExecution.attempt}/{selectedExecution.maxAttempts}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Duration</span><span>{selectedExecution.duration}</span></div>
              {selectedExecution.failureTag && (
                <>
                  <div className="flex justify-between"><span className="text-slate-500">Failure Tag</span><span className="font-mono text-red-400">{selectedExecution.failureTag}</span></div>
                  <div><span className="text-slate-500">Reason</span><p className="mt-1 rounded bg-slate-800 p-2 text-slate-300">{selectedExecution.failureReason}</p></div>
                </>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => handleRetryExecution(selectedExecution)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-forge-600 py-2 text-sm font-medium text-white hover:bg-forge-500"
              >
                <RotateCcw className="h-4 w-4" /> Force Retry
              </button>
              <button
                type="button"
                onClick={() => setSelectedExecution(null)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DLQ detail modal */}
      {selectedDLQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Dead-Letter Item</h3>
              <button type="button" onClick={() => setSelectedDLQ(null)} className="text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">ID</span><span className="font-mono text-purple-400">{selectedDLQ.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Workflow</span><span>{selectedDLQ.workflow}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Failed At</span><span>{selectedDLQ.failedAt}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tag</span><span className="font-mono text-red-400">{selectedDLQ.failureTag}</span></div>
              <div><span className="text-slate-500">Reason</span><p className="mt-1 rounded bg-slate-800 p-2">{selectedDLQ.failureReason}</p></div>
              <div><span className="text-slate-500">Payload</span><pre className="mt-1 overflow-x-auto rounded bg-slate-800 p-2 font-mono text-xs text-emerald-300">{selectedDLQ.payload}</pre></div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => handleRetriggerDLQ(selectedDLQ)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                <Play className="h-4 w-4" /> Re-trigger Execution
              </button>
              <button
                type="button"
                onClick={() => setSelectedDLQ(null)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Policy edit modal */}
      {editingPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass w-full max-w-md rounded-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Edit Retry Policy</h3>
              <button type="button" onClick={() => setEditingPolicy(null)} className="text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs text-slate-500">Policy Name</label>
                <input
                  type="text"
                  value={editingPolicy.name}
                  onChange={(e) => setEditingPolicy({ ...editingPolicy, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Max Attempts</label>
                <input
                  type="number"
                  value={editingPolicy.maxAttempts}
                  onChange={(e) => setEditingPolicy({ ...editingPolicy, maxAttempts: parseInt(e.target.value) || 1 })}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Backoff Strategy</label>
                <select
                  value={editingPolicy.backoff}
                  onChange={(e) => setEditingPolicy({ ...editingPolicy, backoff: e.target.value as RetryPolicy["backoff"] })}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                >
                  <option value="exponential">Exponential</option>
                  <option value="linear">Linear</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500">Base Delay (seconds)</label>
                <input
                  type="number"
                  value={editingPolicy.baseDelay}
                  onChange={(e) => setEditingPolicy({ ...editingPolicy, baseDelay: parseInt(e.target.value) || 30 })}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500">Window Start</label>
                  <input
                    type="time"
                    value={editingPolicy.windowStart}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, windowStart: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Window End</label>
                  <input
                    type="time"
                    value={editingPolicy.windowEnd}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, windowEnd: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={savePolicy} className="flex-1 rounded-lg bg-forge-600 py-2 text-sm font-medium text-white hover:bg-forge-500">
                Save Policy
              </button>
              <button type="button" onClick={() => setEditingPolicy(null)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect wizard modal */}
      {showConnectWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass w-full max-w-md rounded-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Add Platform Connection</h3>
              <button type="button" onClick={() => setShowConnectWizard(false)} className="text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1 flex-1 rounded ${s <= wizardStep ? "bg-forge-500" : "bg-slate-800"}`} />
              ))}
            </div>
            {wizardStep === 1 && (
              <div className="mt-6 space-y-3">
                <p className="text-sm text-slate-400">Select your automation platform:</p>
                {(["n8n", "Make", "Zapier"] as Platform[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setWizardPlatform(p)}
                    className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                      wizardPlatform === p ? "border-forge-500 bg-forge-600/10" : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <span className={`rounded px-2 py-0.5 text-xs font-semibold ${platformColors[p]}`}>{p}</span>
                    {wizardPlatform === p && <CheckCircle className="h-4 w-4 text-forge-400" />}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="mt-4 w-full rounded-lg bg-forge-600 py-2 text-sm font-medium text-white hover:bg-forge-500"
                >
                  Continue
                </button>
              </div>
            )}
            {wizardStep === 2 && (
              <div className="mt-6 space-y-4">
                <p className="text-sm text-slate-400">
                  Paste this webhook URL into your {wizardPlatform} workflow&apos;s HTTP trigger:
                </p>
                <div className="rounded-lg bg-slate-800 p-3 font-mono text-xs text-emerald-300">
                  https://hooks.retryforge.io/v1/{wizardPlatform.toLowerCase()}/new-conn-{Date.now().toString(36)}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    copyWebhook(`https://hooks.retryforge.io/v1/${wizardPlatform.toLowerCase()}/new-conn`);
                    setWizardStep(3);
                  }}
                  className="w-full rounded-lg bg-forge-600 py-2 text-sm font-medium text-white hover:bg-forge-500"
                >
                  I&apos;ve added the webhook
                </button>
              </div>
            )}
            {wizardStep === 3 && (
              <div className="mt-6 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-emerald-400" />
                <p className="mt-4 font-semibold">Connection verified!</p>
                <p className="mt-2 text-sm text-slate-400">
                  RetryForge received a test ping from {wizardPlatform}. Monitoring is now active.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowConnectWizard(false);
                    showToast(`${wizardPlatform} connection added successfully`);
                  }}
                  className="mt-6 w-full rounded-lg bg-forge-600 py-2 text-sm font-medium text-white hover:bg-forge-500"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
