---
name: buddy-micho
description: Claude Code buddy manager with named presets, nicknames, personalities, and i18n support
command: /buddy-micho
---

# Buddy Micho Skill

When the user invokes `/buddy-micho`, run the interactive CLI:

```bash
node ~/.claude/skills/buddy-micho/bin/buddy-micho.js
```

If arguments are provided after the command, pass them through:

```bash
node ~/.claude/skills/buddy-micho/bin/buddy-micho.js {args}
```

## Available subcommands

- `/buddy-micho` — Interactive menu (presets, collection, customize, achievements)
- `/buddy-micho current` — Show current buddy with personality and nickname
- `/buddy-micho roll` — Roll a new buddy with trait selection and nickname prompt
- `/buddy-micho presets` — Browse 22+ named presets by theme or flat list
- `/buddy-micho collection` — View collected buddies with nicknames
- `/buddy-micho restore` — Restore original Claude Code binary
- `/buddy-micho --lang ko` — Switch language (en/ko/zh/ja)
- `/buddy-micho --name "Name"` — Set buddy nickname
- `/buddy-micho --personality "…"` — Set custom personality text

## Notes

- The tool finds salts via brute-force and patches the Claude Code binary
- All rolled buddies are saved to `~/.buddy-micho/collection.json`
- Binary backup is created automatically before patching
- After patching, Claude Code must be restarted to see the new buddy
