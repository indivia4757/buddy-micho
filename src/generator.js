// Buddy trait generation from userId + salt

import { hashString, mulberry32 } from './hash.js';
import { SPECIES, RARITIES, EYES, HATS, STAT_NAMES, SHINY_CHANCE, SALT, STAT_FLOORS } from './constants.js';
import { generateName } from './namegen.js';

// Rarity names in the order Claude Code uses for weighted roll
const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
// Rarity weights matching Claude Code (raw integers, total=100)
const RARITY_WEIGHTS = { common: 60, uncommon: 25, rare: 10, epic: 4, legendary: 1 };

/**
 * Generate buddy traits from userId and salt
 * Algorithm exactly matches Claude Code's WE_(jE_(HE_(userId + salt)))
 */
export function generateBuddy(userId, salt = SALT) {
  const seed = hashString(userId + salt);
  const rng = mulberry32(seed);

  // Roll order must match Claude Code: rarity → species → eye → hat → shiny → stats → inspirationSeed
  const rarity = rollRarity(rng);
  const species = pickFrom(rng, SPECIES);
  const eye = pickFrom(rng, EYES);
  const hat = rarity === 'common' ? 'none' : pickFrom(rng, HATS);
  const shiny = rng() < SHINY_CHANCE;
  const stats = rollStats(rng, rarity);
  const inspirationSeed = Math.floor(rng() * 1e9);

  // Capitalize rarity for display (Claude Code uses lowercase internally)
  const displayRarity = rarity.charAt(0).toUpperCase() + rarity.slice(1);

  const buddy = { rarity: displayRarity, species, eye, hat, shiny, stats, salt, seed, inspirationSeed };
  buddy.name = generateName(buddy);
  return buddy;
}

function pickFrom(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * Roll rarity matching Claude Code's JE_ function
 * Uses integer weights (total=100) with subtraction method
 */
function rollRarity(rng) {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = rng() * total;
  for (const name of RARITY_ORDER) {
    roll -= RARITY_WEIGHTS[name];
    if (roll < 0) return name;
  }
  return 'common';
}

/**
 * Roll stats matching Claude Code's XE_ function
 * Picks a primary stat (boosted) and a weak stat (reduced), rest are normal
 */
function rollStats(rng, rarity) {
  const floor = STAT_FLOORS[rarity.charAt(0).toUpperCase() + rarity.slice(1)] ?? 5;

  // Pick primary stat (high) and weak stat (low) - consumes rng calls
  let primaryStat = pickFrom(rng, STAT_NAMES);
  let weakStat = pickFrom(rng, STAT_NAMES);
  while (weakStat === primaryStat) {
    weakStat = pickFrom(rng, STAT_NAMES);
  }

  const stats = {};
  for (const name of STAT_NAMES) {
    if (name === primaryStat) {
      stats[name] = Math.min(100, floor + 50 + Math.floor(rng() * 30));
    } else if (name === weakStat) {
      stats[name] = Math.max(1, floor - 10 + Math.floor(rng() * 15));
    } else {
      stats[name] = floor + Math.floor(rng() * 40);
    }
  }
  return stats;
}

/**
 * Check if a buddy matches desired criteria
 */
export function matchesCriteria(buddy, criteria) {
  if (criteria.species && buddy.species !== criteria.species) return false;
  if (criteria.rarity && buddy.rarity.toLowerCase() !== criteria.rarity.toLowerCase()) return false;
  if (criteria.eye && buddy.eye !== criteria.eye) return false;
  if (criteria.hat && buddy.hat !== criteria.hat) return false;
  if (criteria.shiny === true && !buddy.shiny) return false;
  return true;
}

/**
 * Get a human-readable summary of a buddy
 */
export function buddySummary(buddy) {
  const parts = [];
  if (buddy.shiny) parts.push('[SHINY]');
  parts.push(`[${buddy.rarity}]`);
  parts.push(buddy.species);
  parts.push(`eyes:${buddy.eye}`);
  if (buddy.hat !== 'none') parts.push(`hat:${buddy.hat}`);
  return parts.join(' ');
}
