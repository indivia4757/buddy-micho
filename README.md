# Buddy Micho

> Claude Code buddy manager with collection system, themed presets, and multi-language support (EN/KO/ZH/JA)

## Features

- **Roll & Customize** — Pick species, rarity, eyes, hat, and shiny status
- **Named Presets** — 22+ individually named buddies like "Sovereign Flame", "Moonbeam", "Kernel Prime"
- **Nicknames** — Give your buddy a custom name
- **Personalities** — Each species has a default personality, plus custom personality support
- **Collection** — Track every buddy you've rolled
- **Themed Presets** — Browse by theme (Cute, Midnight Hour, Golden Throne, Chaos Engine, Inner Peace, Circuit Board, Starlight)
- **Achievements** — 11 unlockable achievements from "First Steps" to "Shiny Legendary"
- **Multi-language** — English, 한국어, 中文, 日本語
- **Auto-backup** — Binary backup created before every patch

## Install

### As Claude Code Skill (recommended)

```bash
git clone https://github.com/YOUR_USERNAME/buddy-micho.git ~/.claude/skills/buddy-micho
```

Then use `/buddy-micho` in Claude Code.

### As CLI tool

```bash
npx buddy-micho
```

Or install globally:

```bash
npm install -g buddy-micho
buddy-micho
```

## Usage

```
buddy-micho                    Interactive menu
buddy-micho current            Show current buddy (with personality)
buddy-micho roll               Roll a new buddy (with nickname prompt)
buddy-micho presets            Browse named presets by theme or all
buddy-micho collection         View your collection
buddy-micho restore            Restore original binary
buddy-micho --lang ko          Set language (en/ko/zh/ja)
buddy-micho --name "Name"      Set buddy nickname
buddy-micho --personality "…"  Set custom personality
```

### In Claude Code

```
/buddy-micho
/buddy-micho roll
/buddy-micho --lang ja
```

## How It Works

Claude Code generates your buddy deterministically from `hash(userId + salt)`. This tool:

1. **Brute-forces** a 15-character salt that produces your desired traits
2. **Patches** the Claude Code binary (replacing the default salt)
3. **Tracks** every roll in your local collection (`~/.buddy-micho/collection.json`)

The original binary is backed up automatically and can be restored with `buddy-micho restore`.

## Named Presets (22+)

Browse by theme or pick from the full list. Each preset has a unique name in 4 languages.

| Theme | Example Presets |
|-------|----------------|
| Cute & Cuddly | Moonbeam, Cotton Puff, Pudding, Whiskers |
| Midnight Hour | Phantom Coder, Sporecaster, Night Watcher |
| Golden Throne | Sovereign Flame, Admiral Frost, Professor Plume, Duchess Mew |
| Chaos Engine | Giga Unit, Honk Protocol, Rubber Menace, Glitch Bot |
| Inner Peace | Steady Shell, Drift, Hot Spring |
| Circuit Board | Kernel Prime, Deep Ink, Signal Bloom |
| Starlight Collection | Gilded Fang, Stardust, Golden Whisper |

## Achievements

| Achievement | Condition |
|-------------|-----------|
| First Steps | Roll your first buddy |
| Collector | Collect 10 buddies |
| Enthusiast | Collect 50 buddies |
| Hoarder | Collect 100 buddies |
| Gotta Catch Em All | Collect all 18 species |
| Golden Touch | Find a shiny buddy |
| Legendary | Find a legendary buddy |
| Myth | Find a shiny legendary |
| Hat Collector | Collect all hat types |
| All Seeing | Collect all eye types |
| Makeover | Apply 5 different buddies |

## License

MIT
