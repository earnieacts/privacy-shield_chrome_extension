# docs/

Full plans, ADRs, architecture notes, and decision records for Privacy Shield.

These files are **mirrored one-way into Obsidian** on the `Stop` hook, into
`Personal Projects/Privacy Shield/Privacy Shield Plans & Decisions` in the `Ren` vault.
The sync uses `rsync --delete` — this directory is the source of truth, and editing the
vault copies (by hand or via the Obsidian MCP) will be clobbered on the next sync.

## Naming

- `privacyshield_plan_<slug>.md`
- `privacyshield_adr_<slug>.md`
- `privacyshield_decision_<slug>.md`
- `privacyshield_architecture_<slug>.md`

Every filename is prefixed `privacyshield_` so the vault graph cluster shares no link target
with any other project. Copy `_template.md` for the frontmatter (`_template.md` itself is
excluded from the sync).
