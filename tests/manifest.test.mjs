import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const read = (file) => readFileSync(new URL(file, root), "utf8");
const manifest = JSON.parse(read(".cursor-plugin/plugin.json"));
const mcp = JSON.parse(read("mcp.json"));
const skill = read("skills/pixel-office-activity/SKILL.md");

// From https://raw.githubusercontent.com/cursor/plugins/main/schemas/plugin.schema.json (additionalProperties: false).
const MANIFEST_KEYS = new Set([
  "name", "displayName", "description", "version", "minClientVersions", "author", "publisher", "homepage",
  "repository", "license", "logo", "keywords", "category", "tags", "commands", "agents", "skills", "rules",
  "hooks", "variables", "mcpServers",
]);
const VARIABLE_KEYWORDS = new Set([
  "type", "title", "description", "default", "enum", "const", "properties", "required", "items",
  "minLength", "maxLength", "minimum", "maximum",
]);

test("plugin.json matches the Cursor checklist", () => {
  for (const key of Object.keys(manifest)) assert.ok(MANIFEST_KEYS.has(key), `unexpected manifest field ${key}`);
  assert.match(manifest.name, /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/);
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.ok(manifest.description.length > 20);
  assert.equal(manifest.license, "MIT");
  assert.equal(manifest.author.name, "Piero Montas");
  assert.equal(manifest.author.email, undefined);
  assert.ok(!manifest.logo.startsWith("/") && !manifest.logo.includes(".."));
  assert.ok(existsSync(new URL(manifest.logo, root)), "logo file is missing");
  assert.ok(!manifest.skills.includes("..") && !manifest.skills.startsWith("/"));
});

test("URL and token are required setup fields with no defaults", () => {
  const { variables } = manifest;
  assert.equal(variables.type, "object");
  assert.deepEqual([...variables.required].sort(), ["PIXEL_OFFICE_INGEST_TOKEN", "PIXEL_OFFICE_URL"]);
  for (const property of Object.values(variables.properties)) {
    for (const keyword of Object.keys(property)) assert.ok(VARIABLE_KEYWORDS.has(keyword), `unsupported keyword ${keyword}`);
    assert.equal(property.default, undefined, "setup fields must not ship a default value");
  }
});

test("mcp.json is a remote server built only from declared setup fields", () => {
  const servers = Object.values(mcp.mcpServers);
  assert.equal(servers.length, 1);
  const [server] = servers;
  assert.equal(server.command, undefined, "the plugin must not run anything locally");
  assert.equal(server.url, "${PIXEL_OFFICE_URL}/api/mcp");
  assert.equal(server.headers.Authorization, "Bearer ${PIXEL_OFFICE_INGEST_TOKEN}");
  const placeholders = JSON.stringify(mcp).match(/\$\{([A-Z_]+)\}/g).map((value) => value.slice(2, -1));
  for (const name of placeholders) assert.ok(name in manifest.variables.properties, `${name} is not a declared variable`);
});

test("skill frontmatter and privacy rules are present", () => {
  assert.match(skill, /^---\nname: pixel-office-activity\ndescription: .+\n---\n/s);
  const lower = skill.toLowerCase();
  for (const phrase of ["start", "stop", "file names", "file contents", "shell commands", "tool arguments", "urls", "message text", "credentials", "api keys"]) {
    assert.ok(lower.includes(phrase), `skill no longer mentions "${phrase}"`);
  }
});

test("published files have no secrets, host defaults, or server code", () => {
  const product = [
    ".cursor-plugin/plugin.json",
    "mcp.json",
    "README.md",
    "LICENSE",
    "package.json",
    "skills/pixel-office-activity/SKILL.md",
  ].map((file) => read(file)).join("\n");
  assert.equal(/pxo_[A-Za-z0-9_-]{8,}/.test(product), false);
  assert.equal(/Bearer\s+(?!\$\{)[A-Za-z0-9._-]{8,}/.test(product), false);
  assert.equal(product.toLowerCase().includes("azurewebsites"), false);
  assert.equal(/@[a-z0-9.-]+\.(com|net|org)/i.test(product), false);
  assert.equal(existsSync(new URL("server", root)), false);
  assert.equal(existsSync(new URL("src", root)), false);
});


