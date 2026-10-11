# Pixel Office plugin

Shows your **Grok Bot** (or Cursor agent) as an NPC in a Pixel Office. Grok Bot works on a cloud computer and has no local hooks, so this plugin connects it to the MCP server that already runs inside your office. Nothing is downloaded or run on your computer.

The only tool, `report_activity`, sends a status, an optional workspace folder **name**, and an optional conversation id. The office rejects any other field.

## Install

### 1. Create a token in Pixel Office

1. Open your office and log in.
2. Go to **Set up your agent**.
3. Choose **Grok Bot (cloud)**.
4. Click **Create my hook token**.
5. Copy the **office URL** and the **ingest token**. The token is shown once.

Do not commit the token, paste it into chat, or put it in a tool argument.

### 2. Install the plugin

In Grok Bot or Cursor, open **Marketplace**, add **Pixel Office**, and open **Configure**.

### 3. Fill both setup fields

| Field | Value |
| --- | --- |
| `PIXEL_OFFICE_URL` | The office URL you copied, with no trailing slash. There is no default. |
| `PIXEL_OFFICE_INGEST_TOKEN` | The ingest token. Keep it in this field only. |

Start a task. The bundled skill tells the agent to report when it starts, while it works, and when it stops. An NPC named "*your name* Grok Bot" walks in.

To stop reporting, revoke the token on **Set up your agent**. It stops working right away.

Without the plugin, add a custom MCP connector instead:

- URL: `<your office>/api/mcp` (Streamable HTTP)
- Header: `Authorization: Bearer <your token>`

Then paste [`skills/pixel-office-activity/SKILL.md`](skills/pixel-office-activity/SKILL.md) into the bot's instructions.

## What is sent

| Field | Allowed values |
| --- | --- |
| `status` | `start`, `prompt`, `thinking`, `shell`, `edit`, `stop`, `end` |
| `workspace` | A short folder name such as `pixel-office`. Paths and URLs are rejected. |
| `conversation_id` | A short id. Each id is one NPC. |

Never sent: file names, file contents, shell commands, tool arguments, page URLs, message text, credentials, or keys. The office also strips `file_path`, `command`, and `detail` on ingest.

## Layout

```
.cursor-plugin/plugin.json             manifest and setup fields
mcp.json                               remote MCP server built from the setup fields
skills/pixel-office-activity/SKILL.md  when to report, and what never to send
assets/logo.svg
tests/manifest.test.mjs
```

```bash
npm test
```

## License

MIT. Copyright (c) 2026 Piero Montas.


