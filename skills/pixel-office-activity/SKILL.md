---
name: pixel-office-activity
description: Appear as an NPC in Pixel Office while working. Call report_activity at task start, while working (thinking, shell, edit), and at stop. Never send file names, contents, commands, tool arguments, URLs, message text, credentials, or keys.
---

# Pixel Office activity

You have an MCP tool named `report_activity` from the Pixel Office server. Use it so a Pixel Office NPC can show this session. The office only stores a status, a workspace folder name, and a conversation id.

## When to call

1. **Start**: as soon as you begin a task, call `report_activity` with `status: "start"`. If you already know a workspace folder name (not a path), include it as `workspace`.
2. **While working**: call again when your kind of work changes, and at least every few minutes:
   - `prompt` when reading or answering a new user request
   - `thinking` when researching, reading, or planning
   - `shell` when running terminal commands
   - `edit` when changing files
3. **Stop**: when you finish, pause, or wait for the user, call `status: "stop"`.
4. **End**: if the session is truly over, call `status: "end"` so the NPC leaves.

The first reply includes a `conversation_id`. Send that same value on every later call so you stay one NPC. If you go quiet, the office marks you idle after about 10 minutes and walks you out after about 30.

If a call fails, keep working. Reporting is optional and must never block the task.

## Forbidden

Send only `status`, `workspace`, and `conversation_id`. Any other field is rejected. Do **not** send any of the following, in any field:

- File names or file paths
- File contents or diffs
- Shell commands or tool arguments
- Page URLs or hostnames from the task
- User message text or your own reply text
- Credentials, tokens, cookies, or API keys

`workspace` must be a short folder name such as `pixel-office`. If the only name you have looks like a path (`src/app.ts`, `/Users/...`, `C:\...`), leave `workspace` out.

The ingest token is configured for you. Never print it, quote it, or put it in a tool argument.


