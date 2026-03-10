# Claude Code Conversation Format

## Storage Locations

- **Global history**: `~/.claude/history.jsonl` — one-line summaries per session
- **Full conversations**: `~/.claude/projects/<project-slug>/<session-id>.jsonl`
- **Subagent logs**: `~/.claude/projects/<project-slug>/<session-id>/subagents/agent-<id>.jsonl`

The project slug is the absolute path with `/` replaced by `-`, e.g., `/Users/gavin` → `-Users-gavin`.

## Global History Entry

```json
{
  "display": "用户提示词的前几个字",
  "pastedContents": {},
  "timestamp": 1764901327873,
  "project": "/Users/gavin",
  "sessionId": "de73b911-0546-40a7-b2b8-636e2b1f5ab2"
}
```

Use `display` + `timestamp` to help users identify sessions.

## Conversation Entry Types

Each line in a project JSONL is one of these:

### User Message

```json
{
  "type": "user",
  "message": {
    "role": "user",
    "content": "message text or array of content blocks"
  },
  "uuid": "unique-id",
  "parentUuid": "parent-message-id or null",
  "timestamp": "2026-03-10T09:33:49.305Z",
  "sessionId": "session-uuid",
  "cwd": "/working/directory",
  "version": "2.1.39",
  "gitBranch": "main",
  "isSidechain": false,
  "userType": "external"
}
```

### Assistant Message

```json
{
  "type": "assistant",
  "message": {
    "role": "assistant",
    "content": [
      { "type": "text", "text": "response text" },
      {
        "type": "tool_use",
        "id": "tool-call-id",
        "name": "Read",
        "input": { "file_path": "/path/to/file" }
      }
    ],
    "model": "claude-opus-4-6",
    "usage": {
      "input_tokens": 5000,
      "output_tokens": 1200,
      "cache_read_input_tokens": 3000,
      "cache_creation_input_tokens": 500
    }
  },
  "uuid": "unique-id",
  "parentUuid": "parent-uuid",
  "timestamp": "ISO-8601",
  "thinkingMetadata": {
    "maxThinkingTokens": 16000
  }
}
```

### Tool Result

```json
{
  "type": "tool_result",
  "message": {
    "role": "user",
    "content": [
      {
        "type": "tool_result",
        "tool_use_id": "matches-tool-call-id",
        "content": "tool output text"
      }
    ]
  }
}
```

### File History Snapshot

Tracks file state before/after modifications:

```json
{
  "type": "file-history-snapshot",
  "filePath": "/path/to/modified/file",
  "content": "file content at this point",
  "timestamp": "ISO-8601"
}
```

## Key Fields for Analysis

| Field | Location | Use |
|-------|----------|-----|
| User intent | First `type: "user"` entry's `message.content` | Task Outcome |
| Tool calls | `message.content[]` where `type: "tool_use"` | Capability Assessment |
| Tool names | `tool_use.name` (Read, Write, Edit, Bash, Glob, Grep, etc.) | Tool distribution |
| Model | `message.model` | Meta info |
| Token usage | `message.usage` | Efficiency metrics |
| Thinking | `thinkingMetadata` or thinking content blocks | Process analysis |
| Git branch | `gitBranch` on user messages | Context |
| Timestamps | `timestamp` on every entry | Duration, timeline |
| File changes | `file-history-snapshot` entries | Code diff |
