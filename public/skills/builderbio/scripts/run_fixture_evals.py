#!/usr/bin/env python3
"""Run fixture-based regression checks for BuilderBio session scanning."""

import json
import os
import shutil
import sqlite3
import subprocess
import sys
import tempfile
from pathlib import Path


def assert_equal(actual, expected, label):
    if actual != expected:
        raise AssertionError(f"{label}: expected {expected!r}, got {actual!r}")


def copy_tree(src, dst):
    if not src.exists():
        return
    shutil.copytree(src, dst, dirs_exist_ok=True)


def build_trae_db(rows_path, db_path):
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("CREATE TABLE ItemTable (key TEXT, value TEXT)")
    with rows_path.open("r", encoding="utf-8") as f:
        rows = json.load(f)
    for row in rows:
        cur.execute(
            "INSERT INTO ItemTable (key, value) VALUES (?, ?)",
            (row["key"], json.dumps(row["value"], ensure_ascii=False)),
        )
    conn.commit()
    conn.close()


def main():
    script_dir = Path(__file__).resolve().parent
    skill_dir = script_dir.parent
    fixtures_dir = skill_dir / "evals" / "fixtures"
    expected = json.loads((fixtures_dir / "expected.json").read_text(encoding="utf-8"))

    with tempfile.TemporaryDirectory(prefix="builderbio-fixtures-") as tmp:
        home = Path(tmp)
        copy_tree(fixtures_dir / "claude", home / ".claude")
        copy_tree(fixtures_dir / "codex", home / ".codex")
        copy_tree(fixtures_dir / "cursor", home / ".cursor")
        build_trae_db(
            fixtures_dir / "trae" / "itemtable_rows.json",
            home
            / "Library"
            / "Application Support"
            / "Trae"
            / "User"
            / "workspaceStorage"
            / "demo"
            / "state.vscdb",
        )

        output_path = home / "builder_profile_data.json"
        env = os.environ.copy()
        env["HOME"] = str(home)

        cmd = [
            sys.executable,
            str(script_dir / "parse_sessions.py"),
            "--claude-dir",
            str(home / ".claude"),
            "--codex-dir",
            str(home / ".codex"),
            "--trae-dir",
            str(home / "Library" / "Application Support" / "Trae"),
            "--days",
            "0",
            "--output",
            str(output_path),
        ]
        completed = subprocess.run(
            cmd,
            env=env,
            capture_output=True,
            text=True,
            check=False,
        )
        if completed.returncode != 0:
            raise RuntimeError(completed.stderr or completed.stdout)

        parsed = json.loads(output_path.read_text(encoding="utf-8"))
        profile = parsed["profile"]
        audit = parsed["scan_audit"]
        sessions = parsed["sessions"]
        session_by_agent = {}
        for session in sessions:
            session_by_agent.setdefault(session["agent"], []).append(session)

        assert_equal(parsed["scanner_version"], expected["scanner_version"], "scanner version")
        assert_equal(audit["summary"]["sessions_parsed"], expected["sessions_parsed"], "sessions parsed")
        assert_equal(audit["summary"]["sources_discovered"], expected["sources_discovered"], "sources discovered")
        assert_equal(audit["summary"]["sources_parsed"], expected["sources_parsed"], "sources parsed")
        assert_equal(audit["summary"]["partial_sessions"], expected["partial_sessions"], "partial sessions")
        assert_equal(audit["summary"]["unknown_sources"], expected["unknown_sources"], "unknown sources")
        assert_equal(audit["summary"]["status"], "partial", "audit status")
        assert_equal(profile["scanner_version"], expected["scanner_version"], "profile scanner version")
        assert_equal(profile["scan_status"], "partial", "profile scan status")

        claude_sessions = session_by_agent["claude-code"]
        codex_sessions = session_by_agent["codex"]
        trae_sessions = session_by_agent["trae"]
        cursor_sessions = session_by_agent["cursor"]

        assert_equal(len(claude_sessions), expected["agents"]["claude-code"]["sessions"], "claude sessions")
        assert_equal(claude_sessions[0]["turns"], expected["agents"]["claude-code"]["turns"], "claude turns")
        assert_equal(claude_sessions[0]["tool_calls"], expected["agents"]["claude-code"]["tool_calls"], "claude tool calls")
        assert_equal(len(claude_sessions[0]["source_refs"]), 2, "claude source refs merge")

        assert_equal(len(codex_sessions), expected["agents"]["codex"]["sessions"], "codex sessions")
        assert_equal(codex_sessions[0]["tokens"], expected["agents"]["codex"]["tokens"], "codex tokens")

        assert_equal(len(trae_sessions), expected["agents"]["trae"]["sessions"], "trae sessions")
        assert_equal(trae_sessions[0]["parse_mode"], "partial", "trae parse mode")

        assert_equal(len(cursor_sessions), expected["agents"]["cursor"]["sessions"], "cursor sessions")
        assert_equal(cursor_sessions[0]["parse_mode"], "partial", "cursor parse mode")
        assert_equal(audit["agent_sources_found"]["cursor"], 1, "cursor source discovery")

        print("Fixture evals passed")
        print("Coverage floor passed")
        print("Truth floor passed")
        print(completed.stdout.strip())


if __name__ == "__main__":
    main()
