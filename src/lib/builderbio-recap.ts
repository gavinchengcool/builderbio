import { and, eq } from "drizzle-orm";
import { sha256 } from "@/lib/auth";
import { normalizeBuilderBioData, extractPortraitAvatarUrl } from "@/lib/builderbio";
import { db } from "@/lib/db";
import { profiles, users } from "@/lib/db/schema";

type AnyRecord = Record<string, unknown>;
type ToolBreakdown = {
  label: string;
  count: number;
  color: string;
};
type AgentRoleEntry = {
  name: string;
  role: string;
  summary: string;
  evidence: string;
  color: string;
};
type ComparisonEntry = {
  name: string;
  color: string;
  sessions: number;
  totalTurns: number;
  totalToolCalls: number;
  avgTurns: number;
  topTools: ToolBreakdown[];
  distribution: string;
};
type SignatureMove = {
  title: string;
  summary: string;
};
type HighMoment = {
  label: string;
  value: string;
  detail: string;
};
type EraEntry = {
  title: string;
  period: string;
  summary: string;
  cue: string;
  bars: number[];
};
type ActivitySummary = {
  longestStreak: number;
  currentStreak: number;
  activeDays: number;
  totalDays: number;
  heatmap: AnyRecord;
};

function asObject(value: unknown): AnyRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as AnyRecord)
    : {};
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function uniq(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const clean = value.trim();
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(clean);
  }
  return result;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: value >= 1_000_000 ? 1 : 0,
  }).format(value);
}

function humanizeTag(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/[A-Z]/.test(trimmed) || trimmed.includes(" ")) return trimmed;

  const map: Record<string, string> = {
    ai: "AI",
    cli: "CLI",
    ui: "UI",
    ux: "UX",
    saas: "SaaS",
    mcp: "MCP",
    nextjs: "Next.js",
    typescript: "TypeScript",
    javascript: "JavaScript",
    html: "HTML",
    css: "CSS",
    sql: "SQL",
    devops: "DevOps",
    openclaw: "OpenClaw",
    claude: "Claude",
    codex: "Codex",
    trae: "Trae",
  };

  return trimmed
    .split(/[-_/]+/)
    .map((token) => {
      const key = token.toLowerCase();
      return map[key] ?? `${key.charAt(0).toUpperCase()}${key.slice(1)}`;
    })
    .join(" ");
}

function agentColor(agent: string): string {
  const colors: Record<string, string> = {
    "claude-code": "#FF6B35",
    codex: "#34D399",
    trae: "#60A5FA",
    "trae-cn": "#60A5FA",
    cursor: "#FBBF24",
    openclaw: "#A78BFA",
    windsurf: "#2DD4BF",
    "bustly-agent": "#FB923C",
  };
  return colors[agent] ?? "#A78BFA";
}

function agentLabel(agent: string, stats?: AnyRecord): string {
  return (
    asString(stats?.display_name) ||
    {
      "claude-code": "Claude Code",
      codex: "Codex",
      trae: "Trae",
      "trae-cn": "Trae",
      cursor: "Cursor",
      openclaw: "OpenClaw",
      windsurf: "Windsurf",
      "bustly-agent": "Bustly Agent",
    }[agent] ||
    humanizeTag(agent)
  );
}

function formatDateRange(range: AnyRecord): string {
  const start = asString(range?.start);
  const end = asString(range?.end);
  if (start && end) return `${start} → ${end}`;
  return start || end || "";
}

function projectScore(project: AnyRecord): number {
  return (
    asNumber(project.total_turns) * 1.5 +
    asNumber(project.total_tool_calls) +
    asNumber(project.total_sessions) * 45
  );
}

function normalizeProjectStatus(status: string, signatureName: string, projectName: string): string {
  if (projectName === signatureName) return "代表作";
  const normalized = status.toLowerCase();
  if (normalized.includes("progress")) return "进行中";
  if (normalized.includes("ship") || normalized.includes("done") || normalized.includes("complete")) return "已完成";
  if (normalized.includes("explore")) return "已探索";
  return status || "进行中";
}

async function computeVerificationHash(D: AnyRecord): Promise<string> {
  const profile = asObject(D.profile);
  const projects = asArray(D.projects);
  const key = [
    asNumber(profile.total_sessions),
    asNumber(profile.total_turns),
    asNumber(profile.total_tokens),
    asNumber(profile.active_days),
    projects.length,
  ].join("|");
  return sha256(key);
}

function deriveTasteSignals(profile: AnyRecord, D: AnyRecord, E: AnyRecord): string[] {
  const style = asObject(D.style);
  const techEntries = Object.entries(asObject(E.tech)).sort((a, b) => asNumber(b[1]) - asNumber(a[1]));
  const signals = [
    asString(style.style_label),
    asString(asObject(E.time).peak_text),
    ...techEntries.slice(0, 2).map(([label]) => humanizeTag(label)),
  ];

  const commandRatio = Math.round(asNumber(style.command_ratio) * 100);
  if (commandRatio >= 45) signals.push("CLI 优先");
  else if (commandRatio >= 25) signals.push("终端驱动");

  const agents = Object.keys(asObject(profile.agents_used));
  if (agents.length > 1) signals.push("多 Agent 协作");
  if (asArray(D.projects).length >= 4) signals.push("多项目推进");

  return uniq(signals).slice(0, 6);
}

function deriveProfileTitle(techLabels: string[], agentCount: number): string {
  const lower = techLabels.map((item) => item.toLowerCase());

  if (lower.some((item) => /(product|strategy|saas)/.test(item))) {
    return "产品驱动型创作者 · AI Native Builder";
  }
  if (lower.some((item) => /(research|analysis|content|translation)/.test(item))) {
    return "研究型创作者 · AI Native Builder";
  }
  if (lower.some((item) => /(react|next|typescript|javascript|frontend|web)/.test(item))) {
    return "全栈构建者 · AI Native Builder";
  }
  if (agentCount >= 3) {
    return "多 Agent Builder · AI Native Builder";
  }
  return "AI Native Builder";
}

function deriveBuilderThesis(name: string, profile: AnyRecord, D: AnyRecord, E: AnyRecord): string {
  const explicit = asString(profile.summary);
  if (explicit) return explicit;

  const projects = asArray<AnyRecord>(D.projects);
  const signature = projects.slice().sort((a, b) => projectScore(b) - projectScore(a))[0];
  const topTech = Object.entries(asObject(E.tech))
    .sort((a, b) => asNumber(b[1]) - asNumber(a[1]))
    .slice(0, 2)
    .map(([label]) => humanizeTag(label));

  if (signature && topTech.length) {
    return `${name} 会把 ${topTech.join("、")} 持续做成能落地的东西，而 ${signature.name} 是最明显的代表。`;
  }
  if (signature) {
    return `${name} 会反复回到 ${signature.name} 这类项目上，把想法真正磨成成品。`;
  }
  return `${name} 的日志里，明显能看到一种更偏向持续构建、而不是浅尝辄止的 AI 协作方式。`;
}

function deriveManagementStyle(D: AnyRecord, E: AnyRecord, profile: AnyRecord) {
  const style = asObject(D.style);
  const prompt = asString(style.prompt_type_label || style.prompt_type);
  const rhythm = asString(style.rhythm_label || style.session_rhythm);
  const label = [prompt, rhythm].filter(Boolean).join(" × ") || asString(style.style_label) || "Builder operating model";
  const summary =
    asString(style.style_sub) ||
    asString(E.comparison_insight) ||
    asString(E.evolution_insight) ||
    deriveBuilderThesis(asString(profile.display_name || profile.username || "这位 Builder"), profile, D, E);
  const commandRatio = Math.round(asNumber(style.command_ratio) * 100);
  const traits = [
    asString(style.prompt_type_desc),
    commandRatio >= 25 ? `${commandRatio}% 的工具调用通过命令行完成。` : "",
    Object.keys(asObject(profile.agents_used)).length > 1 ? "不同 agent 会被放到不同任务里，而不是做同一份工作。" : "",
    asString(asObject(E.time).peak_detail),
  ].filter(Boolean);

  return {
    label: "AI management style",
    name: label,
    summary,
    traits: uniq(traits).slice(0, 3),
  };
}

function deriveHowIbuild(D: AnyRecord, E: AnyRecord, profile: AnyRecord) {
  const style = asObject(D.style);
  const dist = asObject(style.session_length_distribution);
  const short = asNumber(dist.short);
  const medium = asNumber(dist.medium);
  const long = asNumber(dist.long);
  const commandRatio = Math.round(asNumber(style.command_ratio) * 100);
  const toolTotals = Object.entries(asObject(style.tool_totals))
    .map(([label, count]) => ({ label, count: asNumber(count), color: agentColor(label.toLowerCase()) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  return {
    archetype: asString(style.style_label) || "稳定推进型",
    summary:
      asString(style.style_sub) ||
      asString(E.comparison_insight) ||
      "会在高频推进和深度协作之间切换，并且清楚知道什么时候该让不同 agent 接手。",
    promptStyle: asString(style.prompt_type_label || style.prompt_type) || "直接指令",
    promptDetail: asString(style.prompt_type_desc) || "更偏向直接给出任务和约束，而不是写很长的需求文档。",
    sessionRhythm: asString(style.rhythm_label || style.session_rhythm) || "持续推进",
    sessionDetail: `${short} 个短会话 · ${medium} 个中会话 · ${long} 个长会话`,
    toolPreference: asString(style.tool_pref_label || style.tool_preference) || "命令行优先",
    toolDetail: `${commandRatio}% 的工具调用是命令行或 shell 驱动`,
    agentLoyalty:
      Object.keys(asObject(profile.agents_used)).length > 1 ? "多 Agent 协作" : "单 Agent 深挖",
    agentDetail:
      asString(style.loyalty_desc) ||
      asString(E.comparison_insight) ||
      "不同 agent 会根据任务类型承担不同角色。",
    toolTotals,
  };
}

function deriveAgentRoles(E: AnyRecord): AgentRoleEntry[] {
  const comparison = asObject(E.comparison);
  return Object.entries(comparison)
    .sort((a, b) => asNumber(asObject(b[1]).total_turns) - asNumber(asObject(a[1]).total_turns))
    .slice(0, 4)
    .map(([agent, raw]) => {
      const stats = asObject(raw);
      const avg = asNumber(stats.avg_turns);
      const sessions = asNumber(stats.sessions);
      const turns = asNumber(stats.total_turns);
      const tools = asNumber(stats.total_tool_calls);
      let role = "稳定推进";
      let summary = "承担了大量日常推进、反复迭代和持续交付的工作。";

      if (avg >= 100) {
        role = "深度协作";
        summary = "更适合需要长上下文、重构和结构化推进的工作。";
      } else if (sessions >= 40 && tools >= turns) {
        role = "快速执行";
        summary = "更偏向命令驱动、工具密集和快速推进。";
      } else if (sessions >= 40) {
        role = "迭代推进";
        summary = "会频繁回来做跟进、清理和短回路交付。";
      } else if (tools >= turns) {
        role = "执行密集";
        summary = "更偏向命令、编辑和明确执行，而不是长会话讨论。";
      }

      const topTool = asArray(stats.top_tools)[0];
      const topToolName = Array.isArray(topTool) ? asString(topTool[0]) : "";

      return {
        name: agentLabel(agent, stats),
        role,
        summary,
        evidence: `${formatNumber(sessions)} 个 sessions · ${formatNumber(turns)} turns · ${formatNumber(tools)} 次工具调用${topToolName ? ` · 常用 ${topToolName}` : ""}`,
        color: agentColor(agent),
      };
    });
}

function deriveComparison(E: AnyRecord): ComparisonEntry[] {
  const comparison = asObject(E.comparison);
  return Object.entries(comparison)
    .sort((a, b) => asNumber(asObject(b[1]).total_turns) - asNumber(asObject(a[1]).total_turns))
    .slice(0, 4)
    .map(([agent, raw]) => {
      const stats = asObject(raw);
      const topTools = asArray(stats.top_tools)
        .slice(0, 4)
        .map((tool) => {
          const [label, count] = Array.isArray(tool) ? tool : [asString(asObject(tool).name), asNumber(asObject(tool).count)];
          return {
            label: asString(label),
            count: asNumber(count),
            color: agentColor(asString(label).toLowerCase()),
          };
        });
      const distribution = asObject(stats.distribution);
      return {
        name: agentLabel(agent, stats),
        color: agentColor(agent),
        sessions: asNumber(stats.sessions),
        totalTurns: asNumber(stats.total_turns),
        totalToolCalls: asNumber(stats.total_tool_calls),
        avgTurns: asNumber(stats.avg_turns),
        topTools,
        distribution: `${asNumber(distribution.short)} 短 · ${asNumber(distribution.medium)} 中 · ${asNumber(distribution.long)} 长`,
      };
    });
}

function deriveSignatureMoves(D: AnyRecord, E: AnyRecord, profile: AnyRecord): SignatureMove[] {
  const style = asObject(D.style);
  const commandRatio = Math.round(asNumber(style.command_ratio) * 100);
  const projects = asArray<AnyRecord>(D.projects);
  const signature = projects.slice().sort((a, b) => projectScore(b) - projectScore(a))[0];
  const topTech = Object.entries(asObject(E.tech))
    .sort((a, b) => asNumber(b[1]) - asNumber(a[1]))
    .slice(0, 3)
    .map(([label]) => humanizeTag(label));
  const moves = [
    commandRatio >= 25
      ? {
          title: "把循环留在终端里",
          summary: `${commandRatio}% 的工具调用来自 Bash、shell command 或 stdin 驱动，推进方式很明显偏向终端。`,
        }
      : null,
    Object.keys(asObject(profile.agents_used)).length > 1
      ? {
          title: "按角色分配 Agent",
          summary: "不同 agent 会被放到不同任务类型里，而不是争抢同一份工作。",
        }
      : null,
    signature
      ? {
          title: "会回到一条主线项目上",
          summary: `${signature.name} 一直在把 turns、工具调用和注意力重新聚拢到一起。`,
        }
      : null,
    topTech.some((label) => /(Product|Research|Strategy|Content|AI)/i.test(label))
      ? {
          title: "把思考直接做成产物",
          summary: `${topTech.join("、")} 会一起出现在同一段 build history 里，而不是分散在不同工具中。`,
        }
      : null,
    asString(asObject(E.time).peak_text)
      ? {
          title: "有很明显的工作节奏",
          summary: `${asString(asObject(E.time).peak_text)} 不是偶然出现，而是整个周期里反复出现的工作高峰。`,
        }
      : null,
  ].filter((move): move is SignatureMove => Boolean(move));

  return moves.slice(0, 4);
}

function deriveHighMoments(D: AnyRecord, E: AnyRecord): HighMoment[] {
  const highlights = asObject(D.highlights);
  const evolution = asArray<AnyRecord>(E.evolution);
  const time = asObject(E.time);
  const peakWeek = evolution.slice().sort((a, b) => asNumber(b.turns) - asNumber(a.turns))[0];
  const biggestSession = asObject(highlights.biggest_session);
  const busiestDay = asObject(highlights.busiest_day);

  return [
    peakWeek
      ? {
          label: "峰值周",
          value: `${formatCompact(asNumber(peakWeek.turns))} turns`,
          detail: `${asString(peakWeek.week)} 这一周的 turns 最高，说明当时明显进入了强输出阶段。`,
        }
      : null,
    busiestDay
      ? {
          label: "最忙的一天",
          value: asString(busiestDay.date),
          detail: `${asNumber(busiestDay.sessions)} 个 sessions · ${formatNumber(asNumber(busiestDay.turns))} turns`,
        }
      : null,
    asString(time.peak_text)
      ? {
          label: "高峰时段",
          value: asString(time.peak_text),
          detail: asString(time.peak_detail) || "一天里最稳定的高能时段会反复出现在这里。",
        }
      : biggestSession
        ? {
            label: "最大会话",
            value: `${formatNumber(asNumber(biggestSession.turns))} turns`,
            detail: asString(biggestSession.display) || "这是整个周期里最深的一次单线程推进。",
          }
        : null,
  ].filter((moment): moment is HighMoment => Boolean(moment));
}

function deriveEras(E: AnyRecord): EraEntry[] {
  const evolution = asArray<AnyRecord>(E.evolution);
  if (!evolution.length) {
    return [
      {
        title: "Active period",
        period: "扫描周期内",
        summary: "这段时间里持续有新的 build 轨迹，只是还不足以切出更细的阶段变化。",
        cue: "持续推进",
        bars: [45, 70, 55],
      },
    ];
  }

  const groups: AnyRecord[][] = [];
  const size = Math.max(1, Math.ceil(evolution.length / 3));
  for (let i = 0; i < evolution.length; i += size) {
    groups.push(evolution.slice(i, i + size));
  }

  const labels = ["早期探索", "开始变深", "进入输出期"];
  const maxSessions = Math.max(...groups.map((group) => group.reduce((sum, item) => sum + asNumber(item.sessions), 0)), 1);
  const maxTurns = Math.max(...groups.map((group) => group.reduce((sum, item) => sum + asNumber(item.turns), 0)), 1);
  const maxAvg = Math.max(
    ...groups.map((group) => {
      const turns = group.reduce((sum, item) => sum + asNumber(item.turns), 0);
      const sessions = group.reduce((sum, item) => sum + asNumber(item.sessions), 0);
      return sessions > 0 ? turns / sessions : 0;
    }),
    1
  );

  return groups.map((group, index) => {
    const turns = group.reduce((sum, item) => sum + asNumber(item.turns), 0);
    const sessions = group.reduce((sum, item) => sum + asNumber(item.sessions), 0);
    const avg = sessions > 0 ? turns / sessions : 0;
    const first = asString(group[0]?.week);
    const last = asString(group[group.length - 1]?.week);

    const summaries = [
      `${formatNumber(sessions)} 个 sessions 把问题铺得更开，重心还在摸索方向和试探路径。`,
      `平均每个 session 大约 ${Math.round(avg)} turns，说明工作开始从试探转向更深的推进。`,
      `${formatNumber(turns)} turns 集中在后段，说明输出和交付已经开始形成连续性。`,
    ];
    const cues = [
      "广度更大 · 先摸方向",
      "开始收束 · 深度上来",
      "持续输出 · 结果更集中",
    ];

    return {
      title: labels[index] || `阶段 ${index + 1}`,
      period: first && last ? `${first} → ${last}` : first || last || "扫描周期内",
      summary: summaries[index] || summaries[summaries.length - 1],
      cue: cues[index] || cues[cues.length - 1],
      bars: [
        Math.round((sessions / maxSessions) * 100),
        Math.round((turns / maxTurns) * 100),
        Math.round((avg / maxAvg) * 100),
      ],
    };
  });
}

function deriveEvidence(
  D: AnyRecord,
  E: AnyRecord,
  profile: AnyRecord,
  comparison: ComparisonEntry[],
  isUnfiltered: boolean,
) {
  const techEntries = Object.entries(asObject(E.tech))
    .sort((a, b) => asNumber(b[1]) - asNumber(a[1]))
    .slice(0, 6)
    .map(([label, value]) => ({ label: humanizeTag(label), value: Math.round(asNumber(value)) }));
  const toolTotals = Object.entries(asObject(asObject(D.style).tool_totals))
    .sort((a, b) => asNumber(b[1]) - asNumber(a[1]));
  const topTool = toolTotals[0];
  const topTech = techEntries.slice(0, 3).map((item) => item.label).join(" · ");
  const topAgents = comparison.slice(0, 2);
  const time = asObject(E.time);

  return {
    coverage: {
      status: isUnfiltered ? "Unfiltered log receipts" : "Published BuilderBio data",
      summary: isUnfiltered
        ? "核心统计和高光都能回到原始 session 日志。"
        : "核心统计来自已发布的 BuilderBio 数据，页面按同一套 recap 结构重组呈现。",
      note: isUnfiltered
        ? "只要页面上展示的结论，就应该能在真实 sessions 里找到对应证据。"
        : "虽然不是 Unfiltered 状态，但主要统计和项目轨迹仍然来自用户自己的扫描结果。",
    },
    receipts: [
      {
        label: "高峰时段",
        value: asString(time.peak_text) || "未标注",
        detail: asString(time.peak_detail) || "时间分布显示出稳定的工作节奏。",
      },
      {
        label: "第一工具",
        value: topTool ? humanizeTag(topTool[0]) : "未标注",
        detail: topTool ? `整个周期累计 ${formatNumber(asNumber(topTool[1]))} 次调用` : "工具分布数据不足。",
      },
      {
        label: "关键词簇",
        value: topTech || "项目主线",
        detail: topTech ? "这些反复出现的主题，基本就是这段时间的主线。" : "从项目和工作流里能看到明确主线。",
      },
      {
        label: "Agent 分工",
        value: topAgents.length >= 2 ? `${topAgents[0].sessions} / ${topAgents[1].sessions}` : `${Object.keys(asObject(profile.agents_used)).length}`,
        detail: topAgents.length >= 2 ? `${topAgents[0].name} 和 ${topAgents[1].name} 承担了不同工作类型。` : "当前主要由一个 agent 承担核心工作。",
      },
    ],
    tech: techEntries,
    rhythm: [],
  };
}

function deriveWhenIbuild(E: AnyRecord) {
  const time = asObject(E.time);
  const distribution = asObject(time.hour_distribution);
  const periods = asObject(time.period_data);
  const periodLabels: Record<string, string> = {
    deep_night: "深夜",
    morning: "上午",
    afternoon: "下午",
    evening: "晚上",
  };

  return {
    builderType: asString(time.peak_text) || asString(time.builder_type) || "活跃时间型 Builder",
    peakHour:
      asNumber(time.peak_hour) > 0 ? `${asNumber(time.peak_hour)}:00` : asString(time.peak_text) || "未标注",
    peakWindow: asString(time.peak_window) || "高峰时段",
    peakWindowSessions: Math.max(...Object.values(distribution).map((value) => asNumber(value)), 0),
    hourDistribution: Object.fromEntries(
      Array.from({ length: 24 }, (_, hour) => [hour, asNumber(distribution[String(hour)])])
    ),
    periods: Object.entries(periods).map(([key, value]) => {
      const stats = asObject(value);
      return {
        label: periodLabels[key] || humanizeTag(key),
        emoji: "",
        sessions: asNumber(stats.sessions),
        turns: asNumber(stats.turns),
        color: agentColor(key),
      };
    }),
  };
}

function deriveActivity(D: AnyRecord): ActivitySummary {
  const heatmap = asObject(D.heatmap);
  const highlights = asObject(D.highlights);
  return {
    longestStreak: asNumber(highlights.longest_streak),
    currentStreak: asNumber(highlights.current_streak),
    activeDays: asNumber(asObject(D.profile).active_days),
    totalDays: Object.keys(heatmap).length,
    heatmap,
  };
}

const THEME_STYLES: Record<string, Record<string, string>> = {
  default: {},
  "yc-orange": {
    "--accent": "#FF6B35",
    "--accent-dim": "#FF6B3533",
    "--accent-hover": "#FF8A5C",
  },
  "terminal-green": {
    "--accent": "#00FF41",
    "--accent-dim": "#00FF4133",
    "--accent-hover": "#00CC33",
  },
  "minimal-light": {
    "--bg-primary": "#FAFAFA",
    "--bg-secondary": "#FFFFFF",
    "--bg-tertiary": "#F3F3F3",
    "--border": "#E2E2E2",
    "--text-primary": "#111111",
    "--text-secondary": "#555555",
    "--text-muted": "#8A8A8A",
    "--accent": "#111111",
    "--accent-dim": "#11111114",
    "--accent-hover": "#333333",
  },
  cyberpunk: {
    "--accent": "#F472B6",
    "--accent-dim": "#F472B633",
    "--accent-hover": "#FB7185",
  },
};

export async function loadPublicBuilderBioRecap(username: string) {
  const results = await db
    .select({
      username: users.username,
      displayName: users.displayName,
      builderBioData: profiles.builderBioData,
      portrait: profiles.portrait,
      dataHash: profiles.dataHash,
      styleTheme: profiles.styleTheme,
      updatedAt: profiles.updatedAt,
    })
    .from(users)
    .innerJoin(profiles, eq(profiles.userId, users.id))
    .where(and(eq(users.username, username), eq(profiles.isPublic, 1)))
    .limit(1);

  if (results.length === 0) return null;

  const result = results[0];
  const rawBioData = result.builderBioData as { D: AnyRecord; E: AnyRecord } | null;
  if (!rawBioData?.D || !rawBioData?.E) return null;

  const normalized = normalizeBuilderBioData(rawBioData);
  const D = asObject(normalized.D);
  const E = asObject(normalized.E);
  const profile = asObject(D.profile);
  const displayName = asString(profile.display_name) || result.displayName || username;
  const avatarUrl = asString(profile.avatar_url) || extractPortraitAvatarUrl(result.portrait) || "";
  const dateRange = formatDateRange(asObject(profile.date_range));
  const projects = asArray<AnyRecord>(D.projects).slice().sort((a, b) => projectScore(b) - projectScore(a));
  const signatureBuild = projects[0] ?? {};
  const topTechLabels = Object.entries(asObject(E.tech))
    .sort((a, b) => asNumber(b[1]) - asNumber(a[1]))
    .slice(0, 4)
    .map(([label]) => humanizeTag(label));
  const comparison = deriveComparison(E);
  const agentRoles = deriveAgentRoles(E);
  const totalSessions = asNumber(profile.total_sessions);
  const totalTurns = asNumber(profile.total_turns);
  const totalToolCalls = asNumber(profile.total_tool_calls);
  const totalTokens = asNumber(profile.total_tokens);
  const activeDays = asNumber(profile.active_days);
  const isUnfiltered = result.dataHash
    ? result.dataHash === (await computeVerificationHash(D))
    : false;
  const tasteSignals = deriveTasteSignals(profile, D, E);
  const managementStyle = deriveManagementStyle(D, E, { ...profile, username, display_name: displayName });
  const howIbuild = deriveHowIbuild(D, E, profile);
  const activity = deriveActivity(D);
  const evidence = deriveEvidence(D, E, profile, comparison, isUnfiltered);
  const whenIbuild = deriveWhenIbuild(E);
  const highMoments = deriveHighMoments(D, E);
  const eras = deriveEras(E);
  const socialLinks = asArray<AnyRecord>(profile.social_links).map((item) => ({
    label: {
      x: "X",
      twitter: "X",
      linkedin: "LinkedIn",
      github: "GitHub",
      website: "网站",
    }[asString(item.platform).toLowerCase()] || humanizeTag(asString(item.platform)) || "链接",
    href: asString(item.url),
  })).filter((item) => item.href);
  const favoritePrompt = asString(asObject(D.highlights).favorite_prompt);
  const high = asObject(D.highlights);

  const recap = {
    label: isUnfiltered ? "Built from real session logs" : "Built from published BuilderBio data",
    sectionLabel: `${displayName} annual recap`,
    name: displayName,
    slug: `${username}.builderbio.dev`,
    avatarUrl,
    avatarLetter: (displayName || username || "?")[0]?.toUpperCase() || "?",
    title: deriveProfileTitle(topTechLabels, comparison.length),
    thesis: deriveBuilderThesis(displayName, { ...profile, display_name: displayName, username }, D, E),
    recap: `${dateRange} 这段时间里，${displayName} 主要围绕 ${signatureBuild.name || "核心项目"}、${topTechLabels.slice(0, 2).join(" 和 ") || "主要技术主线"} 持续推进，并把 ${comparison.map((item) => item.name).slice(0, 2).join(" 和 ") || "AI agent"} 放进同一条工作流里。`,
    social: socialLinks,
    trust: {
      unfiltered: isUnfiltered,
      generatedAt: result.updatedAt ? result.updatedAt.toISOString().split("T")[0] : "",
      note: isUnfiltered
        ? "顶部统计和 Unfiltered 标记对应原始 session 日志校验结果。"
        : "这页基于已发布的 BuilderBio 数据重组为 recap 结构，核心统计仍然来自用户自己的扫描结果。",
    },
    dateRange,
    stats: [
      { label: "会话", value: formatCompact(totalSessions) },
      { label: "轮对话", value: formatCompact(totalTurns) },
      { label: "工具调用", value: formatCompact(totalToolCalls) },
      { label: "活跃天数", value: formatNumber(activeDays) },
    ],
    totalTokens,
    agents: agentRoles.slice(0, 4).map((item) => ({
      name: item.name,
      role: item.role,
      sessions:
        comparison.find((entry) => entry.name === item.name)?.sessions ??
        0,
      color: item.color,
    })),
    tasteSignals,
    keywordSignals: uniq([
      ...asArray(E.keywords)
        .slice(0, 6)
        .map((item) => (Array.isArray(item) ? asString(item[0]) : asString(asObject(item).word))),
      ...topTechLabels,
    ]).slice(0, 6),
    managementStyle,
    howIbuild,
    signatureBuild: {
      name: asString(signatureBuild.name) || "Primary build",
      stage: "Signature build",
      summary:
        asString(signatureBuild.description) ||
        asString(signatureBuild.summary) ||
        "这条项目线里聚拢了最多的 turns、工具调用和持续注意力。",
      why:
        topTechLabels.length > 0
          ? `它把 ${topTechLabels.slice(0, 3).join("、")} 和持续推进的项目主线捏在了一起。`
          : "它最能代表这段时间里反复投入的主线工作。",
      proof: [
        `${formatCompact(asNumber(signatureBuild.total_turns))} turns`,
        `${formatCompact(asNumber(signatureBuild.total_tool_calls))} tool calls`,
        `${formatNumber(asNumber(signatureBuild.total_sessions))} 个 sessions`,
      ].filter((item) => !item.startsWith("0")),
    },
    signatureMoves: deriveSignatureMoves(D, E, profile),
    highMoments,
    projects: projects.slice(0, 6).map((project) => ({
      name: asString(project.name) || "Untitled project",
      status: normalizeProjectStatus(asString(project.status), asString(signatureBuild.name), asString(project.name)),
      summary: asString(project.description) || asString(project.summary) || "这条项目线里有持续的构建痕迹。",
      tags: asArray(project.tags).map((item) => humanizeTag(asString(item))).filter(Boolean).slice(0, 4),
      proof: `${formatCompact(asNumber(project.total_turns))} turns · ${formatCompact(asNumber(project.total_tool_calls))} tool calls`,
    })),
    agentRoles,
    comparison,
    eras,
    socialCurrency: {
      title: "Collaboration scale",
      summary: `${formatCompact(totalTokens)} tokens、${formatNumber(totalSessions)} 个会话和 ${formatCompact(totalTurns)} turns，说明这已经是持续而深入的 AI 协作，而不是偶尔试用。`,
      facts: [
        { label: "最大会话", value: `${formatNumber(asNumber(asObject(high.biggest_session).turns))} turns` },
        { label: "最忙的一天", value: `${asNumber(asObject(high.busiest_day).sessions)} 个 sessions · ${formatCompact(asNumber(asObject(high.busiest_day).turns))} turns` },
        { label: "最长连续天数", value: `${formatNumber(asNumber(high.longest_streak))} 天` },
      ],
    },
    whenIbuild,
    activity,
    highlights: {
      biggestSession: {
        turns: asNumber(asObject(high.biggest_session).turns),
        display: asString(asObject(high.biggest_session).display) || "这是整个周期里最深的一次单线程推进。",
      },
      busiestDay: {
        date: asString(asObject(high.busiest_day).date),
        sessions: asNumber(asObject(high.busiest_day).sessions),
        turns: asNumber(asObject(high.busiest_day).turns),
      },
      longestStreak: asNumber(high.longest_streak),
      favoritePrompt,
    },
    evidence,
  };

  return {
    recap,
    themeStyle: THEME_STYLES[asString(result.styleTheme) || "default"] || {},
    seo: {
      title: `${displayName}'s BuilderBio — What I Built with AI`,
      description: `${formatNumber(totalSessions)} sessions, ${formatNumber(totalTurns)} turns, ${formatNumber(activeDays)} active days of building with ${comparison.map((item) => item.name.toLowerCase()).join(" and ") || "AI coding agents"}. See what ${displayName} shipped with AI coding agents.`,
      canonical: `https://${username}.builderbio.dev`,
    },
  };
}
