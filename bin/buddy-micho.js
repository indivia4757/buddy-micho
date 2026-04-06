#!/usr/bin/env node

// Buddy Micho CLI - Interactive buddy manager for Claude Code

import * as readline from 'node:readline';
import {
  generateBuddy, findSalt, estimateDifficulty,
  findClaudeBinary, patchBinary, restoreBinary, readCurrentSalt, detectBinaryType,
  clearCompanionCache,
  loadCollection, addToCollection, toggleFavorite, setNickname, setCustomPersonality, getCollectionStats,
  listThemes, listNamedPresets, getPresetsByTheme, getPresetById,
  detectUserId, getCompanionInfo,
  setLanguage, getLanguage, t, getSupportedLanguages,
  formatBuddyCard, formatCollection, formatDifficulty,
  getDefaultPersonality, generateName,
  setBinaryType,
  SPECIES, RARITIES, EYES, HATS,
} from '../src/index.js';

const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const CYAN = '\x1b[36m';
const SHINY_COLOR = '\x1b[33m\x1b[1m';

// ── Readline helpers ──

function createRL() {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function askYesNo(rl, question) {
  return new Promise(async (resolve) => {
    while (true) {
      const answer = await ask(rl, question);
      const trimmed = answer.trim().toLowerCase();
      if (trimmed === 'y' || trimmed === 'yes') { resolve(true); return; }
      if (trimmed === 'n' || trimmed === 'no') { resolve(false); return; }
      console.log(`  ${DIM}y/n ${t('invalid_input')}${RESET}`);
    }
  });
}

function pick(rl, label, choices) {
  return new Promise(async (resolve) => {
    console.log(`\n${label}`);
    choices.forEach((c, i) => console.log(`  ${DIM}${i + 1}.${RESET} ${c.label}`));

    while (true) {
      const answer = await ask(rl, `\n  > `);
      const trimmed = answer.trim();

      if (trimmed === '') continue;

      const idx = parseInt(trimmed) - 1;
      if (!isNaN(idx) && idx >= 0 && idx < choices.length) {
        resolve(choices[idx]);
        return;
      }

      console.log(`  ${DIM}1~${choices.length} ${t('invalid_input')}${RESET}`);
    }
  });
}

// ── Main Menu ──

async function main() {
  const args = process.argv.slice(2);

  // Parse flags
  const langIdx = args.indexOf('--lang');
  let langFromFlag = null;
  if (langIdx !== -1 && args[langIdx + 1]) {
    langFromFlag = args[langIdx + 1];
    args.splice(langIdx, 2);
  }

  const nameIdx = args.indexOf('--name');
  let nameFromFlag = null;
  if (nameIdx !== -1 && args[nameIdx + 1]) {
    nameFromFlag = args[nameIdx + 1];
    args.splice(nameIdx, 2);
  }

  const personalityIdx = args.indexOf('--personality');
  let personalityFromFlag = null;
  if (personalityIdx !== -1 && args[personalityIdx + 1]) {
    personalityFromFlag = args[personalityIdx + 1];
    args.splice(personalityIdx, 2);
  }

  // Load saved language preference first, then override with CLI flag
  const collection = await loadCollection();
  if (collection.settings?.language) {
    setLanguage(collection.settings.language);
  }
  if (langFromFlag) {
    setLanguage(langFromFlag);
  }

  // Detect Claude binary type for correct hash algorithm
  try {
    const binaryPath = await findClaudeBinary();
    if (binaryPath) {
      const binType = await detectBinaryType(binaryPath);
      setBinaryType(binType);
    }
  } catch {}

  // Quick commands (after flag removal, args[0] is the actual command)
  const cmd = args[0];
  if (cmd === 'current') return await showCurrent();
  if (cmd === 'roll') return await rollBuddy();
  if (cmd === 'collection') return await showCollectionView();
  if (cmd === 'presets') {
    const rl = createRL();
    await presetsInteractive(rl);
    rl.close();
    return;
  }
  if (cmd === 'restore') return await restore();
  if (cmd === 'help' || cmd === '--help' || cmd === '-h') return showHelp();

  // Interactive menu
  await interactiveMenu();
}

async function interactiveMenu() {
  const rl = createRL();
  console.log(`\n${BOLD}${CYAN}  ╔══════════════════════════╗${RESET}`);
  console.log(`${BOLD}${CYAN}  ║     Buddy Micho v1.0     ║${RESET}`);
  console.log(`${BOLD}${CYAN}  ║  ${DIM}${t('subtitle')}${RESET}${BOLD}${CYAN}  ║${RESET}`);
  console.log(`${BOLD}${CYAN}  ╚══════════════════════════╝${RESET}\n`);

  let running = true;
  while (running) {
    const choice = await pick(rl, `${BOLD}Menu${RESET}`, [
      { label: t('menu_current'),      value: 'current' },
      { label: t('menu_roll'),         value: 'roll' },
      { label: t('menu_presets'),      value: 'presets' },
      { label: t('menu_collection'),   value: 'collection' },
      { label: t('menu_customize'),    value: 'customize' },
      { label: t('menu_restore'),      value: 'restore' },
      { label: `${t('menu_settings')} (${getLanguage()})`, value: 'settings' },
      { label: t('menu_exit'),         value: 'exit' },
    ]);

    if (!choice || choice.value === 'exit') {
      running = false;
      continue;
    }

    console.log('');
    switch (choice.value) {
      case 'current':      await showCurrent(); break;
      case 'roll':         await rollInteractive(rl); break;
      case 'presets':      await presetsInteractive(rl); break;
      case 'collection':   await showCollectionView(); break;
      case 'customize':    await customizeInteractive(rl); break;
      case 'restore':      await restore(); break;
      case 'settings':     await settingsMenu(rl); break;
    }
  }

  rl.close();
  console.log(`\n${DIM}Bye!${RESET}\n`);
}

// ── Commands ──

async function showCurrent() {
  const { id, source } = await detectUserId();
  const companion = await getCompanionInfo();

  // Read the actual salt from the Claude binary for accurate display
  let actualSalt = null;
  try {
    const binaryPath = await findClaudeBinary();
    if (binaryPath) actualSalt = await readCurrentSalt(binaryPath);
  } catch {}

  const buddy = actualSalt ? generateBuddy(id, actualSalt) : generateBuddy(id);
  const lang = getLanguage();

  // Look up nickname and custom personality from collection
  const collection = await loadCollection();
  const entry = collection.entries.find(e => e.salt === buddy.salt);
  const nickname = entry?.nickname || companion?.name || null;
  const personality = entry?.customPersonality || getDefaultPersonality(buddy.species, lang);

  console.log(`${DIM}User ID: ${id} (${source})${RESET}`);
  console.log('');
  console.log(formatBuddyCard(buddy, { showSalt: true, nickname, personality }));
}

async function rollBuddy() {
  const rl = createRL();
  await rollInteractive(rl);
  rl.close();
}

async function rollInteractive(rl) {
  const { id } = await detectUserId();
  console.log(`${BOLD}${t('menu_roll')}${RESET}\n`);

  // Species selection
  const speciesChoice = await pick(rl, `${t('species')}:`, [
    { label: `${DIM}Any${RESET}`, value: null },
    ...SPECIES.map(s => ({ label: s, value: s })),
  ]);

  // Rarity selection
  const rarityChoice = await pick(rl, `${t('rarity')}:`, [
    { label: `${DIM}Any${RESET}`, value: null },
    ...RARITIES.map(r => ({ label: `${r.name} (${Math.round(r.weight * 100)}%)`, value: r.name })),
  ]);

  // Eye selection
  const eyeChoice = await pick(rl, `${t('eyes')}:`, [
    { label: `${DIM}Any${RESET}`, value: null },
    ...EYES.map(e => ({ label: e, value: e })),
  ]);

  // Hat selection (Common rarity always gets 'none', but user can still wish for a hat)
  const hatChoice = await pick(rl, `${t('hat')}:`, [
    { label: `${DIM}Any${RESET}`, value: null },
    ...HATS.map(h => ({ label: h, value: h })),
  ]);

  // Shiny?
  const shinyChoice = await pick(rl, `${t('shiny')}?`, [
    { label: 'No', value: false },
    { label: `Yes ${DIM}(1% chance - may take a while!)${RESET}`, value: true },
  ]);

  const criteria = {};
  if (speciesChoice?.value) criteria.species = speciesChoice.value;
  if (rarityChoice?.value) criteria.rarity = rarityChoice.value;
  if (eyeChoice?.value) criteria.eye = eyeChoice.value;
  if (hatChoice?.value) criteria.hat = hatChoice.value;
  if (shinyChoice?.value) criteria.shiny = true;

  // Show difficulty
  const estimate = estimateDifficulty(criteria);
  console.log('\n' + formatDifficulty(estimate));

  // maxAttempts: at least 20M, or expected + 1M headroom
  const maxAttempts = estimate.expectedAttempts * 5;

  // Confirm
  const confirmed = await askYesNo(rl, `\n  Start search? (${maxAttempts.toLocaleString()} attempts) (y/n) > `);
  if (!confirmed) return;

  // Search — runs full attempts, collects all matches
  console.log(`\n${t('searching')}`);

  const { matches, attempts, elapsed } = findSalt(id, criteria, {
    maxAttempts,
    onProgress: ({ attempts, rate, elapsed, found }) => {
      const pct = Math.min(100, Math.round((attempts / maxAttempts) * 100));
      process.stdout.write(`\r  ${t('search_progress', {
        attempts: attempts.toLocaleString(),
        rate: rate.toLocaleString(),
        elapsed: elapsed.toFixed(1),
        found: found.toString(),
      })} ~${pct}%  `);
    },
  });

  console.log('');
  await selectFromMatches(rl, matches, attempts, elapsed);
}

/**
 * Show found matches and let user select one
 */
async function selectFromMatches(rl, matches, attempts, elapsed) {
  console.log(`\n  ${t('search_complete', { attempts: attempts.toLocaleString(), elapsed: elapsed.toFixed(1), found: matches.length.toString() })}`);

  if (matches.length === 0) {
    console.log(`\n${t('not_found', { attempts: attempts.toLocaleString() })}`);
    return;
  }

  const lang = getLanguage();

  // If only one match, show it directly
  let selected;
  if (matches.length === 1) {
    selected = matches[0];
  } else {
    // Sort by total stats descending for easier comparison
    matches.sort((a, b) => {
      const sumA = Object.values(a.stats).reduce((s, v) => s + v, 0);
      const sumB = Object.values(b.stats).reduce((s, v) => s + v, 0);
      return sumB - sumA;
    });

    // Show up to 20 best matches
    const shown = matches.slice(0, 20);
    const statAbbr = { DEBUGGING: 'DBG', PATIENCE: 'PAT', CHAOS: 'CHS', WISDOM: 'WIS', SNARK: 'SNK' };
    const choice = await pick(rl, `\n${BOLD}${t('found')}${RESET} — ${matches.length} ${t('matches_found')}`, shown.map((b) => {
      const totalStats = Object.values(b.stats).reduce((s, v) => s + v, 0);
      const shinyTag = b.shiny ? ` ${SHINY_COLOR}✦${RESET}` : '';
      const details = Object.entries(b.stats).map(([k, v]) => `${statAbbr[k] || k}:${v}`).join(' ');
      return {
        label: `${BOLD}${b.name}${RESET} ${DIM}(${b.species} ${b.rarity}${shinyTag}${DIM} | ${details} | total:${totalStats})${RESET}`,
        value: b,
      };
    }));
    if (!choice) return;
    selected = choice.value;
  }

  // Show full card for selected buddy
  const personality = getDefaultPersonality(selected.species, lang);
  console.log('');
  console.log(formatBuddyCard(selected, { showSalt: true, personality }));

  // Add to collection
  await addToCollection(selected);

  // Nickname (default to auto-generated name)
  const autoName = selected.name || '';
  const nickAnswer = await ask(rl, `\n  ${t('enter_nickname')} [${autoName}] > `);
  const finalNick = nickAnswer.trim() || autoName;
  if (finalNick) {
    await setNickname(selected.salt, finalNick);
    console.log(`  ${t('nickname_set', { name: finalNick })}`);
  }

  // Apply?
  const doApply = await askYesNo(rl, `\n  ${t('menu_apply')}? (y/n) > `);
  if (doApply) {
    await applyBuddy(selected.salt, rl);
  }
}

async function presetsInteractive(rl) {
  const lang = getLanguage();

  // Choose browsing mode
  const modeChoice = await pick(rl, `${BOLD}${t('presets_title')}${RESET}`, [
    { label: t('browse_by_theme'), value: 'theme' },
    { label: t('browse_all'),      value: 'all' },
  ]);

  if (!modeChoice) return;

  let selectedPreset;

  if (modeChoice.value === 'theme') {
    // Theme → preset two-step picker
    const themes = listThemes();
    const themeChoice = await pick(rl, `${t('select_preset')}`, themes.map(th => ({
      label: `${BOLD}${th.name[lang] || th.name.en}${RESET} - ${DIM}${th.description[lang] || th.description.en}${RESET}`,
      value: th.key,
    })));
    if (!themeChoice) return;

    const presets = getPresetsByTheme(themeChoice.value);
    const presetChoice = await pick(rl, `${t('select_buddy')}`, presets.map(p => ({
      label: `${BOLD}${p.name[lang] || p.name.en}${RESET} ${DIM}(${p.species}${p.rarity ? ' ' + p.rarity : ''}${p.shiny ? ' ✦' : ''})${RESET}`,
      value: p,
    })));
    if (!presetChoice) return;
    selectedPreset = presetChoice.value;
  } else {
    // Flat list of all named presets
    const allPresets = listNamedPresets();
    const presetChoice = await pick(rl, `${t('select_buddy')}`, allPresets.map(p => ({
      label: `${BOLD}${p.name[lang] || p.name.en}${RESET} ${DIM}(${p.species}${p.rarity ? ' ' + p.rarity : ''}${p.shiny ? ' ✦' : ''})${RESET} - ${DIM}${p.description[lang] || p.description.en}${RESET}`,
      value: p,
    })));
    if (!presetChoice) return;
    selectedPreset = presetChoice.value;
  }

  // Search for the selected preset
  await searchAndApplyPreset(rl, selectedPreset);
}

async function searchAndApplyPreset(rl, preset) {
  const { id } = await detectUserId();
  const lang = getLanguage();
  const criteria = {};
  if (preset.species) criteria.species = preset.species;
  if (preset.eye) criteria.eye = preset.eye;
  if (preset.hat) criteria.hat = preset.hat;
  if (preset.rarity) criteria.rarity = preset.rarity;
  if (preset.shiny) criteria.shiny = true;

  const estimate = estimateDifficulty(criteria);
  console.log('\n' + formatDifficulty(estimate));

  // maxAttempts: at least 20M, or expected + 1M headroom
  const maxAttempts = estimate.expectedAttempts * 5;

  const confirmed = await askYesNo(rl, `\n  Start search? (${maxAttempts.toLocaleString()} attempts) (y/n) > `);
  if (!confirmed) return;

  console.log(`\n${t('searching')}`);
  const { matches, attempts, elapsed } = findSalt(id, criteria, {
    maxAttempts,
    onProgress: ({ attempts, rate, elapsed, found }) => {
      const pct = Math.min(100, Math.round((attempts / maxAttempts) * 100));
      process.stdout.write(`\r  ${t('search_progress', {
        attempts: attempts.toLocaleString(),
        rate: rate.toLocaleString(),
        elapsed: elapsed.toFixed(1),
        found: found.toString(),
      })} ~${pct}%  `);
    },
  });

  console.log('');
  await selectFromMatches(rl, matches, attempts, elapsed);
}

async function customizeInteractive(rl) {
  const collection = await loadCollection();
  const lang = getLanguage();

  if (collection.entries.length === 0) {
    console.log(`  ${DIM}${t('collection_empty')}${RESET}`);
    return;
  }

  // Pick a buddy to customize
  const recent = collection.entries.slice(-10).reverse();
  const buddyChoice = await pick(rl, `${t('select_buddy')}`, recent.map(e => {
    const label = e.nickname ? `${BOLD}${e.nickname}${RESET} (${e.species})` : e.species;
    return { label: `${label} ${DIM}${e.rarity}${RESET}`, value: e };
  }));
  if (!buddyChoice) return;

  const entry = buddyChoice.value;

  const actionChoice = await pick(rl, `${BOLD}${t('menu_customize')}${RESET}`, [
    { label: t('menu_rename'), value: 'rename' },
    { label: t('personality'), value: 'personality' },
  ]);
  if (!actionChoice) return;

  if (actionChoice.value === 'rename') {
    const current = entry.nickname || '';
    const answer = await ask(rl, `  ${t('enter_nickname')}${current ? ` [${current}]` : ''} > `);
    const name = answer.trim();
    if (name) {
      await setNickname(entry.salt, name);
      console.log(`  ${t('nickname_set', { name })}`);
    } else if (current) {
      await setNickname(entry.salt, null);
      console.log(`  ${t('nickname_cleared')}`);
    }
  } else {
    const defaultP = getDefaultPersonality(entry.species, lang);
    console.log(`\n  ${DIM}${t('personality')}: "${defaultP}"${RESET}\n`);
    const answer = await ask(rl, `  ${t('enter_personality')} > `);
    const text = answer.trim();
    if (text) {
      await setCustomPersonality(entry.salt, text);
      console.log(`  ${t('personality_set')}`);
    } else if (entry.customPersonality) {
      await setCustomPersonality(entry.salt, null);
      console.log(`  ${t('personality_cleared')}`);
    }
  }
}

async function showCollectionView() {
  const collection = await loadCollection();
  const stats = getCollectionStats(collection);
  console.log(formatCollection(collection.entries, collection.favorites));
  console.log(`\n  ${t('total')}: ${stats.total} | ${t('favorites')}: ${stats.favorites} | ${t('completion')}: ${stats.completion}%`);
}

async function applyBuddy(salt, rl) {
  console.log(`\n${t('patching')}`);
  const binaryPath = await findClaudeBinary();
  if (!binaryPath) {
    console.log(`  ${t('binary_not_found')}`);
    return;
  }

  try {
    const result = await patchBinary(binaryPath, salt);
    console.log(`  ${t('patch_success')}`);
    console.log(`  ${t('patch_positions', { count: result.positions })}`);
    console.log(`  ${t('backup_at', { path: result.backupPath })}`);

    // Update collection
    const collection = await loadCollection();
    collection.stats.totalApplied++;
    const { saveCollection } = await import('../src/collection.js');
    await saveCollection(collection);

    // Ask to clear companion cache so the new buddy takes effect on restart
    if (rl) {
      const doClear = await askYesNo(rl, `\n  ${t('clear_cache_prompt')} (y/n) > `);
      if (doClear) {
        const cleared = await clearCompanionCache();
        console.log(`  ${cleared ? t('cache_cleared') : t('cache_not_found')}`);
      }
    }
  } catch (err) {
    console.log(`  Error: ${err.message}`);
  }
}

async function restore() {
  const binaryPath = await findClaudeBinary();
  if (!binaryPath) {
    console.log(t('binary_not_found'));
    return;
  }
  try {
    await restoreBinary(binaryPath);
    console.log(t('restore_success'));
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}

async function settingsMenu(rl) {
  const langs = getSupportedLanguages();
  const choice = await pick(rl, 'Language:', langs.map(l => ({
    label: { en: 'English', ko: '한국어', zh: '中文', ja: '日本語' }[l] || l,
    value: l,
  })));

  if (choice) {
    setLanguage(choice.value);
    // Persist
    const { loadCollection, saveCollection } = await import('../src/collection.js');
    const collection = await loadCollection();
    collection.settings = collection.settings || {};
    collection.settings.language = choice.value;
    await saveCollection(collection);
  }
}

function showHelp() {
  console.log(`
${BOLD}Buddy Micho${RESET} - Claude Code Buddy Manager

${BOLD}Usage:${RESET}
  buddy-micho                    Interactive menu
  buddy-micho current            Show current buddy
  buddy-micho roll               Roll a new buddy
  buddy-micho presets            Browse named presets by theme or all
  buddy-micho collection         View your collection
  buddy-micho restore            Restore original binary
  buddy-micho --lang ko          Set language (en/ko/zh/ja)
  buddy-micho --name "Name"      Set buddy nickname when rolling
  buddy-micho --personality "…"  Set custom personality text
  buddy-micho help               Show this help

${BOLD}As Claude Code Skill:${RESET}
  /buddy-micho                   Interactive menu
  /buddy-micho roll              Roll a new buddy
  /buddy-micho presets           Browse named presets
`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
