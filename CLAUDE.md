# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**Privacy Shield** — a Manifest V3 Chrome extension that blocks trackers, resists
fingerprinting, spoofs identifying data (user-agent, geolocation), and shows a real-time
privacy score for the current tab.

- Repo: `kode-projects/privacy-shield_chrome_extension`
- GitHub: `earnieacts` (collaborator: `Wenoxxxx`)
- Stack: **vanilla HTML/CSS/JavaScript. No build step, no framework, no package manager.**
  Do not introduce React, TypeScript, a bundler, or npm dependencies without an explicit
  decision recorded in `docs/` (see [Plans & decisions](#plans--decisions)).

## Repository layout

```
manifest.json        MV3 manifest — permissions, service worker, content scripts, action
popup.html           Extension popup UI (loads css/styles.css + js/popup.js)
popup-circle.html    Loose HTML fragment of the score ring — NOT referenced by anything
css/styles.css       All popup styling (Inter via Google Fonts, circular progress ring)
js/background.js     Service worker — declarativeNetRequest dynamic rules
js/content.js        Content script — navigator.userAgent + geolocation spoofing
js/popup.js          Popup logic — privacy score calculation + ring animation
assets/              icon.png (500), icon48.png, icon128.png
```

## Running and testing

There is no test runner and no build. Verification is manual:

1. `chrome://extensions/` → enable **Developer mode** → **Load unpacked** → select repo root.
2. After any change: hit **Reload** on the extension card. Service-worker changes also need
   the **service worker** link clicked to see its console.
3. Popup UI: right-click the toolbar icon → **Inspect popup** for its own devtools.
4. Content-script changes need the *page* reloaded, not just the extension.
5. Check `chrome://extensions/` for the "Errors" badge after every reload — MV3 failures are
   silent otherwise.

Never claim a change works without loading it in Chrome and observing the behaviour.

## Known defects in the current code

Treat these as the standing backlog. Do not describe the extension as working privacy
protection in docs or commits until they are fixed.

- **`js/background.js` adds then immediately removes rule 1.** `updateDynamicRules` applies
  `removeRuleIds` in the same call, so nothing is ever blocked. Also `urlFilter: "tracker"`
  is a substring match, not a filter list.
- **`manifest.json` declares `webRequest` + `webRequestBlocking`.** `webRequestBlocking` is
  MV2-only and unavailable to non-policy MV3 extensions; it can cause install rejection.
  Blocking is DNR's job here — drop both unless read-only `webRequest` is actually used.
- **`js/content.js` spoofing runs in the isolated world.** Content scripts do not share the
  page's `window`, so the page still sees the real `navigator.userAgent` and geolocation.
  Real UA spoofing needs DNR `modifyHeaders` on `User-Agent`; real JS-surface spoofing needs
  an injected main-world script (`world: "MAIN"`).
- **Geolocation spoof passes a malformed position** — no `accuracy`, no `timestamp`; callers
  reading those get `undefined`.
- **`js/popup.js` reads `tabs[0].url` without the `tabs` permission** and does not guard
  against `tabs[0]` being undefined (e.g. devtools/chrome:// pages).
- **The privacy score is fake** — it only checks whether the literal string `tracker` is in
  the URL. It is not wired to anything `background.js` actually blocks.
- **`host_permissions: ["<all_urls>"]`** is the broadest possible grant and will draw Chrome
  Web Store review scrutiny. Justify or narrow it.
- **`popup-circle.html` is dead code** — the same markup is inlined in `popup.html`.
- **`.DS_Store` files are committed** (root and `assets/`). `.gitignore` now excludes them;
  they still need `git rm --cached`.

## Working rules

- **Least privilege.** Every permission in `manifest.json` must be justified by code that
  uses it. Removing an unused permission is always in scope.
- **A privacy extension must not leak.** No analytics, no remote endpoints, no third-party
  scripts, no `eval`. MV3 CSP forbids remote code — keep it that way. The Google Fonts
  `<link>` in `popup.html` is an external request from a privacy tool; prefer self-hosting
  the font in `assets/`.
- **Storage is local.** Use `chrome.storage.local` for settings/score state. Never sync
  browsing data anywhere.
- **Match the existing style.** Vanilla DOM APIs, no frameworks, kebab-case CSS classes,
  double-quoted JSON, 2-space indentation in JS/CSS/HTML.
- **Guard every `chrome.*` call.** Check `chrome.runtime.lastError` and handle missing tabs;
  MV3 service workers are terminated aggressively, so keep no in-memory state across events.
- Prefer editing the four existing files over adding new ones. If a new module is needed,
  it goes in `js/` and is referenced explicitly (no bundler exists to find it).

## Git conventions

- Conventional Commits: `feat(ui):`, `fix(background):`, `docs:`, `refactor(popup):`.
  (History uses `feature(ui):` — use `feat` going forward.)
- Branch names: `feature/<slug>`, `fix/<slug>`.
- Work on a branch and open a PR into `main`; do not commit directly to `main`.
- Do not override git identity when committing.

## Agents and skills

`.claude/` is **gitignored** — the agents and skills below are local to this machine only.

**Agents** (`.claude/agents/`) — invoke by name via the Agent tool:

| Agent | Use for |
|---|---|
| `devils-advocate` | Challenge any plan before implementing it |
| `tech-lead` | Architecture, sequencing, scope decisions |
| `extension-platform-engineer` | manifest, service worker, DNR, content scripts, permissions |
| `popup-ui-engineer` | popup HTML/CSS/vanilla-JS UI work |
| `privacy-engineer` | tracker blocking, fingerprint defence, spoofing correctness |
| `security-auditor` | permission audit, CSP, injection, data leakage |
| `qa-engineer` | manual test matrices, regression checklists |
| `code-reviewer` | review a diff before it lands |
| `ux-ui-design-lead` | visual design, popup layout, design tokens |
| `accessibility-specialist` | WCAG 2.2 AA for the popup |
| `documentation-writer` | README, store listing, privacy policy |
| `git-standards-enforcer` | commit/branch/PR hygiene |
| `store-release-engineer` | packaging, versioning, Chrome Web Store submission |
| `completeness-auditor` | verify a task is actually finished end to end |

**Skills** (`.claude/skills/`): `chrome-extension-mv3`, `privacy-blocking`,
`vanilla-web-frontend`, `extension-security`, `chrome-web-store-release`,
`ux-design-system`, `accessibility-deep`, `testing-quality`, `code-review`,
`git-standards`, `documentation-standards`, `impact-analysis`.

## Plans & decisions

Full plans, ADRs, and decision records go in `docs/` as their own files — not crammed into
a memory note. Naming:

- `privacyshield_plan_<slug>.md`
- `privacyshield_adr_<slug>.md`
- `privacyshield_decision_<slug>.md`
- `privacyshield_architecture_<slug>.md`

Copy `docs/_template.md` for the frontmatter. Every note sets `project: privacy-shield`,
a `type`, `status`, and `tags: [privacyshield, privacyshield/<type>]`, and links
`[[Privacy Shield Plans & Decisions MOC]]`.

## Obsidian sync

Two Claude-side folders mirror one-way into the vault (`~/Documents/Ren`) on the `Stop`
hook via `sync-memory-to-obsidian.sh`:

- `~/.claude/projects/-Users-ict-Documents-Personal-Projects-kode-projects-privacy-shield-chrome-extension/memory/` → `Personal Projects/Privacy Shield/Privacy Shield Claude Memory`
- `docs/` (this repo) → `Personal Projects/Privacy Shield/Privacy Shield Plans & Decisions`

**Never write into those two vault folders via the Obsidian MCP** — the sync uses
`rsync --delete` and will clobber it on the next Stop. Claude-side is the source of truth;
MCP is for **reading** the vault.

**Graph isolation.** This cluster must share no link target and no tag with any other
project in the vault: every doc filename is prefixed `privacyshield_`, the memory index
syncs as `Privacy Shield MEMORY.md` (never a bare `MEMORY.md` — that would hijack
FetchExpress's existing `[[MEMORY]]` edge), and tags are only `privacyshield` and
`privacyshield/<type>` (no bare `moc`).

MCP paths are vault-relative (`Personal Projects/Privacy Shield/…`). The server needs
Obsidian running **with a vault window open** — the Local REST API plugin only loads with
the vault, so a background Obsidian with no renderer means port 27124 is closed. Fix: open
the vault, then `/mcp` reconnect.
