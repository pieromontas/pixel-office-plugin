# Pixel Office plugin

Shows your **Grok Bot** (or Cursor agent) as an NPC in a [Pixel Office](https://github.com/pieromontas/PixelOfficeShared). Grok Bot works on a cloud computer and has no local hooks, so this plugin connects it to the MCP server that runs inside your office. Nothing is downloaded or run on your computer.

The only tool, `report_activity`, sends a status and an optional workspace folder **name**. `conversation_id` is optional; if omitted, the office ties the NPC to the ingest token. The office rejects any other field.

## Manual install (until marketplace approval)

This plugin is pending Cursor marketplace review. Until it is approved, connect Grok Bot by hand:

1. Open your office, go to **Set up your agent**, choose **Grok Bot (cloud)**, and click **Create my hook token**.
2. Copy the **MCP URL** (that office's origin + `/api/mcp`), the header `Authorization: Bearer <token>`, and the **Grok Bot prompt**. The prompt already has the office URL and the reporting rules. It does not include the token.
3. In Grok Bot, paste the prompt once. Add the remote MCP connector at that URL only if no pixel-office connector exists yet. Enter the token only in the connector's secret field, never in chat. The prompt asks the bot to save the rules to the user's shared memory so every bot on the account reports.
4. For Cursor on a computer, paste the setup page's snippet into `~/.cursor/mcp.json`.

When the listing is approved, install **Pixel Office** from Marketplace and set `PIXEL_OFFICE_URL` plus `PIXEL_OFFICE_INGEST_TOKEN` under Configure. The public source is [github.com/pieromontas/pixel-office-plugin](https://github.com/pieromontas/pixel-office-plugin).

To stop reporting, revoke the token on **Set up your agent**. It stops working right away.

## What is sent

| Field | Allowed values |
| --- | --- |
| `status` | `start`, `prompt`, `thinking`, `shell`, `edit`, `stop`, `end` |
| `workspace` | A short folder name such as `pixel-office`. Paths and URLs are rejected. |
| `conversation_id` | Optional. Omitted: one NPC per ingest token. |

Never sent: file names, file contents, shell commands, tool arguments, page URLs, message text, credentials, or keys. The office strips `file_path`, `command`, and `detail` on ingest as well.

## Layout

```
.cursor-plugin/plugin.json             manifest and setup fields
mcp.json                               remote MCP server built from the setup fields
skills/pixel-office-activity/SKILL.md  when to report, and what never to send
assets/logo.svg
tests/manifest.test.mjs                checks the manifest against Cursor's schema
```

The folder is self-contained. To publish it on its own, copy it to the root of a new public repository and submit that repository at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish). Until then, the root [`.cursor-plugin/marketplace.json`](../../.cursor-plugin/marketplace.json) in this repository points at this folder.

```bash
npm test
```


