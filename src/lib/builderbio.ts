type JsonObject = Record<string, unknown>;

export interface BuilderBioData {
  D: JsonObject;
  E: JsonObject;
}

export interface BuilderBioScanInfo {
  scannerVersion: string | null;
  status: string;
  recommendation: string | null;
  warningCount: number;
  unknownSourceCount: number;
  partialSessions: number;
  confidence: number | null;
  needsRescan: boolean;
}

function asObject(value: unknown): JsonObject | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as JsonObject;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function normalizeAgentId(value: unknown): string | null {
  const raw = asString(value);
  if (!raw) return null;

  const normalized = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || null;
}

function firstString(record: JsonObject | null, keys: string[]): string | null {
  if (!record) return null;
  for (const key of keys) {
    const value = asString(record[key]);
    if (value) return value;
  }
  return null;
}

function hasKeys(value: unknown): value is JsonObject {
  return !!asObject(value) && Object.keys(value as JsonObject).length > 0;
}

function normalizeSocialLinks(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;

  const record = asObject(value);
  if (!record) return [];

  return Object.entries(record)
    .filter(([, url]) => typeof url === "string" && url.trim() !== "")
    .map(([platform, url]) => ({ platform, url }));
}

function normalizeHourDistribution(value: unknown): Record<string, number> {
  const normalized: Record<string, number> = {};

  if (Array.isArray(value)) {
    for (let hour = 0; hour < 24; hour += 1) {
      normalized[String(hour)] = asNumber(value[hour]) ?? 0;
    }
    return normalized;
  }

  const record = asObject(value);
  for (let hour = 0; hour < 24; hour += 1) {
    normalized[String(hour)] = asNumber(record?.[String(hour)]) ?? 0;
  }
  return normalized;
}

function normalizeTopTools(value: unknown): [string, number][] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string" && item.trim() !== "") {
        return [item, 1] as [string, number];
      }

      if (
        Array.isArray(item) &&
        typeof item[0] === "string" &&
        typeof asNumber(item[1]) === "number"
      ) {
        return [item[0], asNumber(item[1]) ?? 0] as [string, number];
      }

      const record = asObject(item);
      const name = asString(record?.name);
      const count = asNumber(record?.count);
      if (!name || count === null) return null;
      return [name, count] as [string, number];
    })
    .filter((item): item is [string, number] => item !== null);
}

function normalizeStringArray(value: unknown): string[] {
  return asArray(value)
    .map((item) => asString(item))
    .filter((item): item is string => item !== null);
}

function normalizeScanAudit(
  value: unknown,
  scannerVersionHint?: unknown
): JsonObject | null {
  const audit = asObject(value);
  if (!audit) return null;

  const warnings = normalizeStringArray(audit.warnings);
  const summary = asObject(audit.summary) ?? {};
  const agentSourcesFound = asObject(audit.agent_sources_found) ?? {};
  const agents = asObject(audit.agents) ?? {};
  const normalizedAgents: JsonObject = {};
  const normalizedSourceCounts: JsonObject = {};

  for (const [agentKey, rawStats] of Object.entries(agents)) {
    const agent = normalizeAgentId(agentKey) ?? agentKey;
    const stats = asObject(rawStats) ?? {};
    normalizedAgents[agent] = {
      sources_discovered: asNumber(stats.sources_discovered) ?? 0,
      sources_parsed: asNumber(stats.sources_parsed) ?? 0,
      sessions_parsed: asNumber(stats.sessions_parsed) ?? 0,
      partial_sessions: asNumber(stats.partial_sessions) ?? 0,
      strong_sources: asNumber(stats.strong_sources) ?? 0,
      weak_sources: asNumber(stats.weak_sources) ?? 0,
      source_samples: normalizeStringArray(stats.source_samples),
      warnings: normalizeStringArray(stats.warnings),
    };
    normalizedSourceCounts[agent] =
      asNumber(agentSourcesFound[agent]) ??
      asNumber(agentSourcesFound[agentKey]) ??
      asNumber(stats.sources_discovered) ??
      0;
  }

  for (const [agentKey, value] of Object.entries(agentSourcesFound)) {
    const agent = normalizeAgentId(agentKey) ?? agentKey;
    if (asNumber(value) !== null && normalizedSourceCounts[agent] === undefined) {
      normalizedSourceCounts[agent] = asNumber(value) ?? 0;
    }
  }

  const unknownSources = asArray(audit.unknown_sources)
    .map((entry) => {
      const item = asObject(entry);
      const path = asString(item?.path);
      if (!path) return null;
      return {
        path,
        reason: asString(item?.reason) ?? "",
        probe_hint: asString(item?.probe_hint) ?? "",
        agent_hint: normalizeAgentId(item?.agent_hint) ?? asString(item?.agent_hint) ?? "",
      };
    })
    .filter((item) => item !== null) as JsonObject[];

  const scannerVersion =
    asString(audit.scanner_version) ?? asString(scannerVersionHint) ?? null;
  const partialSessions =
    asNumber(summary.partial_sessions) ??
    Object.values(normalizedAgents).reduce<number>((sum, raw) => {
      return sum + (asNumber(asObject(raw)?.partial_sessions) ?? 0);
    }, 0);
  const unknownCount =
    asNumber(summary.unknown_sources) ?? unknownSources.length;
  const skippedCount = asNumber(summary.skipped_sources) ?? 0;
  const status =
    asString(summary.status) ??
    (partialSessions > 0 || unknownCount > 0 || skippedCount > 0
      ? "partial"
      : "complete");

  return {
    scanner_version: scannerVersion,
    summary: {
      status,
      confidence: asNumber(summary.confidence) ?? null,
      sessions_parsed: asNumber(summary.sessions_parsed) ?? 0,
      sources_discovered: asNumber(summary.sources_discovered) ?? 0,
      sources_parsed: asNumber(summary.sources_parsed) ?? 0,
      partial_sessions: partialSessions,
      unknown_sources: unknownCount,
      skipped_sources: skippedCount,
      recommended_action: asString(summary.recommended_action) ?? "",
    },
    agent_sources_found: normalizedSourceCounts,
    agents: normalizedAgents,
    warnings,
    unknown_sources: unknownSources,
  };
}

function normalizeProjects(value: unknown): JsonObject[] {
  return asArray(value).map((entry) => {
    const project = asObject(entry) ?? {};
    const sessions = project.sessions;
    const sessionCount =
      typeof sessions === "number"
        ? sessions
        : Array.isArray(sessions)
          ? sessions.length
          : asNumber(project.total_sessions) ??
            asNumber(project.session_count) ??
            0;

    if (!Array.isArray(project.tags)) {
      if (Array.isArray(project.tech_stack)) {
        project.tags = project.tech_stack;
      } else if (Array.isArray(project.tech_tags)) {
        project.tags = project.tech_tags;
      }
    }

    project.total_sessions = sessionCount;

    if (asNumber(project.total_turns) === null) {
      project.total_turns = asNumber(project.turns) ?? 0;
    }

    if (asNumber(project.total_tool_calls) === null) {
      project.total_tool_calls = asNumber(project.tool_calls) ?? 0;
    }

    if (project.status === "in-progress") {
      project.status = "in progress";
    }

    return project;
  });
}

function normalizeDistribution(value: unknown): JsonObject {
  const distribution = asObject(value) ?? {};
  return {
    short: asNumber(distribution.short) ?? 0,
    medium: asNumber(distribution.medium) ?? 0,
    long: asNumber(distribution.long) ?? 0,
  };
}

function normalizeLegacyAgentComparison(value: unknown): JsonObject {
  const comparison: JsonObject = {};

  for (const item of asArray(value)) {
    const entry = asObject(item) ?? {};
    const agent =
      normalizeAgentId(entry.agent) ??
      normalizeAgentId(entry.name) ??
      normalizeAgentId(entry.display_name);
    if (!agent) continue;

    comparison[agent] = {
      sessions: asNumber(entry.sessions) ?? 0,
      total_turns: asNumber(entry.total_turns) ?? asNumber(entry.turns) ?? 0,
      avg_turns: asNumber(entry.avg_turns) ?? 0,
      total_tool_calls:
        asNumber(entry.total_tool_calls) ?? asNumber(entry.tool_calls) ?? 0,
      top_tools: normalizeTopTools(entry.top_tools),
      distribution: normalizeDistribution(entry.distribution ?? entry.length_dist),
      first_session: asString(entry.first_session) ?? "",
      display_name:
        asString(entry.display_name) ?? asString(entry.name) ?? agent,
    };
  }

  return comparison;
}

function aggregateToolTotalsFromComparison(value: unknown): JsonObject {
  const totals: Record<string, number> = {};
  const comparison = asObject(value) ?? {};

  for (const rawStats of Object.values(comparison)) {
    const stats = asObject(rawStats) ?? {};
    for (const [tool, count] of normalizeTopTools(stats.top_tools)) {
      totals[tool] = (totals[tool] ?? 0) + count;
    }
  }

  return totals;
}

function aggregateSessionDistributionFromComparison(value: unknown): JsonObject {
  const totals = { short: 0, medium: 0, long: 0 };
  const comparison = asObject(value) ?? {};

  for (const rawStats of Object.values(comparison)) {
    const distribution = normalizeDistribution(asObject(rawStats)?.distribution);
    totals.short += asNumber(distribution.short) ?? 0;
    totals.medium += asNumber(distribution.medium) ?? 0;
    totals.long += asNumber(distribution.long) ?? 0;
  }

  return totals;
}

export function normalizeBuilderBioData(data: BuilderBioData): BuilderBioData {
  const normalized = structuredClone(data) as BuilderBioData;
  const D = asObject(normalized.D) ?? {};
  const E = asObject(normalized.E) ?? {};
  normalized.D = D;
  normalized.E = E;

  const profile = asObject(D.profile) ?? {};
  D.profile = profile;
  const insights = asObject(E.insights) ?? {};
  const legacyAgentComparison = normalizeLegacyAgentComparison(D.agents);

  if (!hasKeys(profile.agents_used)) {
    const agentsUsed: JsonObject = {};
    const agents = asObject(profile.agents);

    if (agents) {
      for (const [agent, rawStats] of Object.entries(agents)) {
        const stats = asObject(rawStats);
        agentsUsed[agent] = {
          sessions: asNumber(stats?.sessions) ?? 0,
          first_session: asString(stats?.first_session) ?? "",
        };
      }
    } else if (Array.isArray(profile.agent_badges)) {
      for (const badge of profile.agent_badges) {
        const item = asObject(badge);
        const agent = asString(item?.agent);
        if (!agent) continue;
        agentsUsed[agent] = {
          sessions: asNumber(item?.sessions) ?? 0,
          first_session: asString(item?.first_session) ?? "",
        };
      }
    } else if (hasKeys(legacyAgentComparison)) {
      for (const [agent, rawStats] of Object.entries(legacyAgentComparison)) {
        const stats = asObject(rawStats);
        agentsUsed[agent] = {
          sessions: asNumber(stats?.sessions) ?? 0,
          first_session: asString(stats?.first_session) ?? "",
        };
      }
    }

    profile.agents_used = agentsUsed;
  }

  if (!asString(profile.avatar_url) && asString(profile.avatar)) {
    profile.avatar_url = profile.avatar;
  }

  profile.social_links = normalizeSocialLinks(profile.social_links);

  const normalizedScanAudit = normalizeScanAudit(
    E.scan_audit ?? D.scan_audit ?? profile.scan_audit,
    profile.scanner_version
  );
  if (normalizedScanAudit) {
    E.scan_audit = normalizedScanAudit;
    const scanSummary = asObject(normalizedScanAudit.summary) ?? {};
    const agentSourcesFound =
      asObject(normalizedScanAudit.agent_sources_found) ?? {};

    if (!asString(profile.scanner_version)) {
      profile.scanner_version =
        asString(normalizedScanAudit.scanner_version) ?? "";
    }
    if (!asString(profile.scan_status)) {
      profile.scan_status = asString(scanSummary.status) ?? "";
    }
    if (!asString(profile.scan_recommendation)) {
      profile.scan_recommendation =
        asString(scanSummary.recommended_action) ?? "";
    }
    if (!hasKeys(profile.agent_sources_found) && hasKeys(agentSourcesFound)) {
      profile.agent_sources_found = agentSourcesFound;
    }
  }

  D.projects = normalizeProjects(D.projects);

  if (!hasKeys(E.tech)) {
    const techStack = D.tech_stack;

    if (Array.isArray(techStack)) {
      const tech: Record<string, number> = {};
      for (const item of techStack) {
        const entry = asObject(item);
        const name = asString(entry?.name);
        const score = asNumber(entry?.score) ?? asNumber(entry?.value);
        if (name && score !== null) tech[name] = score;
      }
      E.tech = tech;
    } else {
      const techRecord = asObject(techStack);
      if (Array.isArray(techRecord?.areas)) {
      const tech: Record<string, number> = {};
      for (const item of techRecord.areas) {
        const entry = asObject(item);
        const name = asString(entry?.name);
        const score = asNumber(entry?.score) ?? asNumber(entry?.value);
        if (name && score !== null) tech[name] = score;
      }
      E.tech = tech;
      } else if (techRecord) {
        const tech: Record<string, number> = {};
        for (const [name, score] of Object.entries(techRecord)) {
          const numericScore = asNumber(score);
          if (numericScore !== null) tech[name] = numericScore;
        }
        E.tech = tech;
      }
    }
  }

  if (!Array.isArray(E.keywords) || E.keywords.length === 0) {
    const keywords = asArray(D.keywords)
      .map((item) => {
        if (
          Array.isArray(item) &&
          typeof item[0] === "string" &&
          asNumber(item[1]) !== null
        ) {
          return [item[0], asNumber(item[1]) ?? 0];
        }

        const record = asObject(item);
        const word = asString(record?.word);
        const count = asNumber(record?.count);
        if (!word || count === null) return null;
        return [word, count];
      })
      .filter((item): item is [string, number] => item !== null);

    E.keywords = keywords;
  }

  if (!Array.isArray(E.evolution) || E.evolution.length === 0) {
    const source = Array.isArray(D.evolution)
      ? D.evolution
      : Array.isArray(D.collaboration_curve)
        ? D.collaboration_curve
        : [];

    E.evolution = source.map((item) => {
      const entry = asObject(item) ?? {};
      return {
        week: asString(entry.week) ?? "",
        sessions: asNumber(entry.sessions) ?? 0,
        turns: asNumber(entry.turns) ?? 0,
        avg_turns: asNumber(entry.avg_turns) ?? asNumber(entry.avg) ?? 0,
      };
    });
  }

  const time = asObject(D.time) ?? asObject(D.time_distribution);
  const timeDetail = asObject(E.time_detail);
  if (!hasKeys(E.time) && time) {
    const peakHour = asNumber(time.peak_hour) ?? 0;
    const peakPattern = asString(insights.time_pattern);
    E.time = {
      hour_distribution: normalizeHourDistribution(time.hour_distribution),
      period_data: asObject(time.period_data) ?? asObject(time.periods) ?? {},
      builder_type: asString(time.builder_type) ?? "",
      peak_hour: peakHour,
      peak_text:
        asString(time.peak_text) ??
        asString(timeDetail?.peak_text) ??
        asString(time.builder_type) ??
        peakPattern ??
        "",
      peak_detail:
        asString(time.peak_detail) ??
        asString(timeDetail?.peak_detail) ??
        (peakPattern && peakPattern !== asString(time.builder_type)
          ? peakPattern
          : peakHour > 0
            ? `Peak around ${peakHour}:00`
            : ""),
    };
  } else {
    const normalizedTime = asObject(E.time);
    if (normalizedTime) {
      normalizedTime.hour_distribution = normalizeHourDistribution(
        normalizedTime.hour_distribution
      );
      if (!hasKeys(normalizedTime.period_data) && time) {
        normalizedTime.period_data =
          asObject(time.period_data) ?? asObject(time.periods) ?? {};
      }
      if (!asString(normalizedTime.peak_text) && asString(timeDetail?.peak_text)) {
        normalizedTime.peak_text = timeDetail?.peak_text;
      }
      if (
        !asString(normalizedTime.peak_detail) &&
        asString(timeDetail?.peak_detail)
      ) {
        normalizedTime.peak_detail = timeDetail?.peak_detail;
      }
      if (
        !asString(normalizedTime.peak_text) &&
        asString(time?.builder_type)
      ) {
        normalizedTime.peak_text = time?.builder_type;
      }
      if (
        !asString(normalizedTime.peak_detail) &&
        asString(insights.time_pattern)
      ) {
        normalizedTime.peak_detail = insights.time_pattern;
      }
    }
  }

  if (!hasKeys(E.comparison) && hasKeys(E.agent_comparison)) {
    const comparison: JsonObject = {};
    const agentComparison = asObject(E.agent_comparison) ?? {};

    for (const [agent, rawStats] of Object.entries(agentComparison)) {
      const stats = asObject(rawStats) ?? {};
      comparison[agent] = {
        sessions: asNumber(stats.sessions) ?? 0,
        total_turns: asNumber(stats.total_turns) ?? asNumber(stats.turns) ?? 0,
        avg_turns: asNumber(stats.avg_turns) ?? 0,
        total_tool_calls:
          asNumber(stats.total_tool_calls) ?? asNumber(stats.tool_calls) ?? 0,
        top_tools: normalizeTopTools(stats.top_tools),
        distribution: asObject(stats.distribution) ?? asObject(stats.length_dist) ?? {},
      };
    }

    E.comparison = comparison;
  }

  if (!hasKeys(E.comparison) && hasKeys(legacyAgentComparison)) {
    E.comparison = legacyAgentComparison;
  }

  if (!hasKeys(E.comparison) && Array.isArray(D.agent_comparison)) {
    const comparison: JsonObject = {};

    for (const item of D.agent_comparison) {
      const entry = asObject(item) ?? {};
      const agent = normalizeAgentId(entry.name);
      if (!agent) continue;

      comparison[agent] = {
        sessions: asNumber(entry.sessions) ?? 0,
        total_turns: asNumber(entry.total_turns) ?? asNumber(entry.turns) ?? 0,
        avg_turns: asNumber(entry.avg_turns) ?? 0,
        total_tool_calls:
          asNumber(entry.total_tool_calls) ?? asNumber(entry.tool_calls) ?? 0,
        top_tools: normalizeTopTools(entry.top_tools),
        distribution: asObject(entry.distribution) ?? asObject(entry.length_dist) ?? {},
      };
    }

    E.comparison = comparison;
  }

  if (!hasKeys(profile.agents_used)) {
    const agentsUsed: JsonObject = {};
    const comparison = asObject(E.comparison) ?? asObject(E.agent_comparison);

    if (comparison) {
      for (const [agent, rawStats] of Object.entries(comparison)) {
        const stats = asObject(rawStats);
        agentsUsed[agent] = {
          sessions: asNumber(stats?.sessions) ?? 0,
          first_session: asString(stats?.first_session) ?? "",
        };
      }
    } else if (Array.isArray(E.agent_share)) {
      for (const item of E.agent_share) {
        const share = asObject(item);
        const agent = asString(share?.agent);
        if (!agent) continue;
        agentsUsed[agent] = {
          sessions: asNumber(share?.sessions) ?? 0,
          first_session: "",
        };
      }
    }

    profile.agents_used = agentsUsed;
  }

  if (!asString(E.comparison_insight) && asString(insights.agent_comparison)) {
    E.comparison_insight = insights.agent_comparison;
  }

  if (
    !asString(E.evolution_insight) &&
    asString(asObject(D.collaboration_curve)?.description)
  ) {
    E.evolution_insight = asObject(D.collaboration_curve)?.description;
  }
  if (!asString(E.evolution_insight) && asString(insights.rhythm)) {
    E.evolution_insight = insights.rhythm;
  }

  const style = asObject(D.style) ?? {};
  D.style = style;
  const legacyStyle = asObject(D.working_style) ?? {};
  if (!hasKeys(style) && hasKeys(legacyStyle)) {
    Object.assign(style, legacyStyle);
  }
  if (!asString(style.prompt_type) && asString(legacyStyle.prompt_style)) {
    style.prompt_type = legacyStyle.prompt_style;
  }
  if (
    !asString(style.session_rhythm) &&
    asString(legacyStyle.session_rhythm)
  ) {
    style.session_rhythm = legacyStyle.session_rhythm;
  }
  if (
    !asString(style.tool_preference) &&
    asString(legacyStyle.tool_preference)
  ) {
    style.tool_preference = legacyStyle.tool_preference;
  }
  if (!asString(style.agent_loyalty) && asString(legacyStyle.agent_loyalty)) {
    style.agent_loyalty = legacyStyle.agent_loyalty;
  }
  if (!asString(style.style_label)) {
    const promptType = asString(style.prompt_type);
    const rhythm = asString(style.session_rhythm);
    if (promptType || rhythm) {
      style.style_label = [promptType, rhythm].filter(Boolean).join(" × ");
    }
  }
  if (!asString(style.style_sub)) {
    style.style_sub =
      asString(style.rhythm_desc) ??
      asString(style.tool_pref_desc) ??
      asString(insights.prompt_style) ??
      asString(insights.rhythm) ??
      "";
  }
  if (!asString(style.prompt_type_label) && asString(style.prompt_type)) {
    style.prompt_type_label = style.prompt_type;
  }
  if (!asString(style.rhythm_label) && asString(style.session_rhythm)) {
    style.rhythm_label = style.session_rhythm;
  }
  if (!asString(style.tool_pref_label) && asString(style.tool_preference)) {
    style.tool_pref_label = style.tool_preference;
  }
  if (!asString(style.loyalty_label) && asString(style.agent_loyalty)) {
    style.loyalty_label = style.agent_loyalty;
  }
  if (!asString(style.loyalty_desc) && asString(insights.agent_comparison)) {
    style.loyalty_desc = insights.agent_comparison;
  }
  if (!hasKeys(style.tool_totals) && hasKeys(E.comparison)) {
    style.tool_totals = aggregateToolTotalsFromComparison(E.comparison);
  }
  if (
    !hasKeys(style.session_length_distribution) &&
    hasKeys(E.comparison)
  ) {
    style.session_length_distribution =
      aggregateSessionDistributionFromComparison(E.comparison);
  }
  if (asNumber(style.command_ratio) === null && hasKeys(style.tool_totals)) {
    const toolTotals = asObject(style.tool_totals) ?? {};
    const totalToolCalls = Object.values(toolTotals).reduce<number>((sum, value) => {
      return sum + (asNumber(value) ?? 0);
    }, 0);
    const shellToolCalls =
      (asNumber(toolTotals.Bash) ?? 0) +
      (asNumber(toolTotals.shell_command) ?? 0) +
      (asNumber(toolTotals.write_stdin) ?? 0);

    style.command_ratio =
      totalToolCalls > 0 ? shellToolCalls / totalToolCalls : 0;
  }

  const highlights = asObject(D.highlights) ?? {};
  D.highlights = highlights;
  const legacyHighlights = asObject(E.highlights) ?? {};
  if (Object.keys(highlights).length === 0 && hasKeys(legacyHighlights)) {
    if (asObject(legacyHighlights.biggest_session)) {
      highlights.biggest_session = structuredClone(
        asObject(legacyHighlights.biggest_session)
      );
    }
    if (asObject(legacyHighlights.busiest_day)) {
      highlights.busiest_day = structuredClone(
        asObject(legacyHighlights.busiest_day)
      );
    }
    if (asNumber(legacyHighlights.longest_streak) !== null) {
      highlights.longest_streak = asNumber(legacyHighlights.longest_streak);
    }
    if (asNumber(legacyHighlights.current_streak) !== null) {
      highlights.current_streak = asNumber(legacyHighlights.current_streak);
    }
  }
  const biggestSession = asObject(highlights.biggest_session);
  if (
    biggestSession &&
    !asString(biggestSession.display) &&
    asString(biggestSession.project)
  ) {
    biggestSession.display = biggestSession.project;
  }
  const marathonSession = asObject(highlights.marathon_session);
  if (
    marathonSession &&
    !asString(marathonSession.display) &&
    asString(marathonSession.project)
  ) {
    marathonSession.display = marathonSession.project;
  }
  if (
    !asString(highlights.favorite_prompt) &&
    (asString(asObject(E.featured_prompt)?.content) ||
      asString(legacyHighlights.featured_prompt))
  ) {
    highlights.favorite_prompt =
      asString(asObject(E.featured_prompt)?.content) ??
      asString(legacyHighlights.featured_prompt) ??
      "";
  }
  if (
    biggestSession &&
    !asString(biggestSession.display) &&
    asString(biggestSession.date)
  ) {
    const durationHours = asNumber(biggestSession.duration_hours);
    biggestSession.display =
      durationHours !== null
        ? `${biggestSession.date} · ${durationHours}h session`
        : `Session on ${biggestSession.date}`;
  }

  return normalized;
}

export function extractBuilderBioAvatarUrl(data: unknown): string | null {
  const bioData = asObject(data) as BuilderBioData | null;
  if (!bioData?.D) return null;

  const normalized = normalizeBuilderBioData(bioData);
  const profile = asObject(normalized.D.profile);
  return firstString(profile, ["avatar_url", "avatar"]);
}

export function extractPortraitAvatarUrl(portrait: unknown): string | null {
  const portraitObject = asObject(portrait);
  return firstString(portraitObject, [
    "avatar_url",
    "avatar",
    "image_url",
    "image",
    "photo_url",
    "photo",
    "url",
  ]);
}

export function injectBuilderBioScannerMetadata(
  data: BuilderBioData,
  scannerVersion?: unknown,
  scanAudit?: unknown
): BuilderBioData {
  const cloned = structuredClone(data) as BuilderBioData;
  const D = asObject(cloned.D) ?? {};
  const E = asObject(cloned.E) ?? {};
  const profile = asObject(D.profile) ?? {};

  cloned.D = D;
  cloned.E = E;
  D.profile = profile;

  const version = asString(scannerVersion);
  if (version) {
    profile.scanner_version = version;
  }

  const normalizedAudit = normalizeScanAudit(scanAudit, version);
  if (normalizedAudit) {
    E.scan_audit = normalizedAudit;
    const summary = asObject(normalizedAudit.summary) ?? {};
    profile.scan_status = asString(summary.status) ?? "";
    profile.scan_recommendation =
      asString(summary.recommended_action) ?? "";
    profile.agent_sources_found =
      asObject(normalizedAudit.agent_sources_found) ?? {};
  }

  return normalizeBuilderBioData(cloned);
}

export function extractBuilderBioScanInfo(
  data: unknown
): BuilderBioScanInfo | null {
  const bioData = asObject(data) as BuilderBioData | null;
  if (!bioData?.D) return null;

  const normalized = normalizeBuilderBioData(bioData);
  const profile = asObject(normalized.D.profile);
  const scanAudit = normalizeScanAudit(
    asObject(normalized.E)?.scan_audit ?? profile?.scan_audit,
    profile?.scanner_version
  );
  if (!scanAudit) return null;

  const summary = asObject(scanAudit.summary) ?? {};
  const warningCount = normalizeStringArray(scanAudit.warnings).length;
  const unknownSourceCount = asArray(scanAudit.unknown_sources).length;
  const partialSessions = asNumber(summary.partial_sessions) ?? 0;
  const confidence = asNumber(summary.confidence);
  const status = asString(summary.status) ?? "unknown";

  return {
    scannerVersion:
      asString(scanAudit.scanner_version) ??
      asString(profile?.scanner_version) ??
      null,
    status,
    recommendation:
      asString(summary.recommended_action) ??
      asString(profile?.scan_recommendation) ??
      null,
    warningCount,
    unknownSourceCount,
    partialSessions,
    confidence,
    needsRescan: status !== "complete",
  };
}
