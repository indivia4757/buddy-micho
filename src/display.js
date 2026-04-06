// Display helpers for terminal output

import { RARITY_COLORS, RESET, BOLD, DIM, SHINY_COLOR } from './constants.js';
import { renderSprite, HATS_ART } from './sprites.js';
import { t } from './i18n.js';

/**
 * Format a buddy card for terminal display
 */
export function formatBuddyCard(buddy, options = {}) {
  const { showSalt = false, showSprite = true, compact = false, nickname = null, personality = null } = options;
  const lines = [];
  const rarityColor = RARITY_COLORS[buddy.rarity] || '';

  // Header with optional nickname
  const shinyTag = buddy.shiny ? ` ${SHINY_COLOR}★ ${t('shiny')}${RESET}` : '';
  const hatTag = buddy.hat !== 'none' ? (HATS_ART[buddy.hat] || '') : '';
  lines.push(`${BOLD}${rarityColor}═══ ${buddy.species.toUpperCase()} ═══${RESET}${shinyTag}${hatTag}`);

  // Name (auto-generated or nickname)
  const displayName = nickname || buddy.name || null;
  if (displayName) {
    lines.push('');
    lines.push(`  ${BOLD}${displayName}${RESET}`);
  }

  // Sprite
  if (showSprite && !compact) {
    lines.push('');
    const sprite = renderSprite(buddy.species, buddy.eye);
    for (const line of sprite.split('\n')) {
      lines.push(`  ${buddy.shiny ? SHINY_COLOR : ''}${line}${RESET}`);
    }
    lines.push('');
  }

  // Info
  lines.push(`  ${DIM}${t('rarity')}:${RESET}  ${rarityColor}${buddy.rarity}${RESET}`);
  lines.push(`  ${DIM}${t('species')}:${RESET} ${buddy.species}`);
  lines.push(`  ${DIM}${t('eyes')}:${RESET}    ${buddy.eye}`);
  lines.push(`  ${DIM}${t('hat')}:${RESET}     ${buddy.hat}`);

  // Stats
  if (buddy.stats && !compact) {
    lines.push('');
    lines.push(`  ${BOLD}${t('stats')}${RESET}`);
    for (const [name, value] of Object.entries(buddy.stats)) {
      const bar = formatStatBar(value);
      lines.push(`  ${DIM}${name.padEnd(10)}${RESET} ${bar} ${value}`);
    }
  }

  // Personality
  if (personality && !compact) {
    lines.push('');
    lines.push(`  ${DIM}${t('personality')}:${RESET}`);
    lines.push(`  ${DIM}"${personality}"${RESET}`);
  }

  // Salt
  if (showSalt) {
    lines.push('');
    lines.push(`  ${DIM}${t('salt')}:${RESET} ${buddy.salt}`);
  }

  return lines.join('\n');
}

/**
 * Format a stat bar
 */
function formatStatBar(value, width = 20) {
  const filled = Math.round((value / 100) * width);
  const empty = width - filled;
  let color;
  if (value >= 80) color = '\x1b[32m';      // green
  else if (value >= 50) color = '\x1b[33m';  // yellow
  else color = '\x1b[31m';                   // red
  return `${color}${'█'.repeat(filled)}${DIM}${'░'.repeat(empty)}${RESET}`;
}

/**
 * Format collection list
 */
export function formatCollection(entries, favorites = []) {
  const lines = [];
  lines.push(`${BOLD}═══ ${t('collection_title')} ═══${RESET}`);
  lines.push('');

  if (entries.length === 0) {
    lines.push(`  ${DIM}${t('collection_empty')}${RESET}`);
    return lines.join('\n');
  }

  for (const entry of entries.slice(-20).reverse()) {
    const rarityColor = RARITY_COLORS[entry.rarity] || '';
    const fav = favorites.includes(entry.salt) ? '★ ' : '  ';
    const shiny = entry.shiny ? `${SHINY_COLOR}✦${RESET} ` : '';
    const date = entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : '';
    const nameTag = entry.nickname ? `${BOLD}${entry.nickname}${RESET} ` : '';
    lines.push(
      `${fav}${shiny}${nameTag}${rarityColor}${entry.rarity.padEnd(10)}${RESET} ` +
      `${entry.species.padEnd(10)} ${entry.eye} ` +
      `${entry.hat !== 'none' ? entry.hat : ''.padEnd(10)} ` +
      `${DIM}${date}${RESET}`
    );
  }

  return lines.join('\n');
}

/**
 * Format achievements
 */
export function formatAchievements(unlocked) {
  const lines = [];
  lines.push(`${BOLD}═══ ${t('achievements_title')} ═══${RESET}`);
  lines.push('');

  const allAchievements = [
    'first_roll', 'collector_10', 'collector_50', 'collector_100',
    'all_species', 'first_shiny', 'first_legend', 'shiny_legend',
    'hat_trick', 'all_eyes', 'applied_5',
  ];

  for (const id of allAchievements) {
    const done = unlocked.includes(id);
    const icon = done ? '\x1b[33m🏆\x1b[0m' : `${DIM}🔒${RESET}`;
    const text = t(`achievement_${id}`);
    lines.push(`  ${icon} ${done ? text : DIM + text + RESET}`);
  }

  lines.push('');
  lines.push(`  ${unlocked.length}/${allAchievements.length} ${t('achievements_title').toLowerCase()}`);

  return lines.join('\n');
}

/**
 * Format difficulty estimate
 */
export function formatDifficulty(estimate) {
  const colors = {
    trivial: '\x1b[32m',
    easy: '\x1b[32m',
    moderate: '\x1b[33m',
    hard: '\x1b[31m',
    'very hard': '\x1b[35m',
    extreme: '\x1b[35m\x1b[1m',
  };
  const color = colors[estimate.difficulty] || '';
  return `${t('difficulty', { difficulty: `${color}${estimate.difficulty}${RESET}` })}\n` +
         `${t('expected_attempts', { count: estimate.expectedAttempts.toLocaleString() })}`;
}
