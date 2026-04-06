// Brute-force salt finder for desired buddy traits

import { hashString, mulberry32 } from './hash.js';
import { SPECIES, EYES, HATS, STAT_NAMES, SHINY_CHANCE, SALT_LENGTH } from './constants.js';
import { generateName } from './namegen.js';

const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Rarity weights matching Claude Code's JE_ function
const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const RARITY_WEIGHTS = { common: 60, uncommon: 25, rare: 10, epic: 4, legendary: 1 };
const RARITY_TOTAL = 100;

/**
 * Generate a random salt of exactly SALT_LENGTH characters
 */
function randomSalt() {
  let salt = '';
  for (let i = 0; i < SALT_LENGTH; i++) {
    salt += CHARSET[(Math.random() * CHARSET.length) | 0];
  }
  return salt;
}

/**
 * Inline buddy generation + criteria check for maximum speed.
 * Avoids function call overhead and object allocation on non-matches.
 */
function tryMatch(userId, criteria) {
  const salt = randomSalt();
  const seed = hashString(userId + salt);

  // Inline mulberry32 PRNG
  let s = seed >>> 0;
  function rng() {
    s = s + 1831565813 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  // Roll rarity (matching Claude Code's JE_)
  let roll = rng() * RARITY_TOTAL;
  let rarity = 'common';
  for (const name of RARITY_ORDER) {
    roll -= RARITY_WEIGHTS[name];
    if (roll < 0) { rarity = name; break; }
  }

  // Early exit on rarity mismatch
  if (criteria._rarity && rarity !== criteria._rarity) return null;

  // Roll species
  const species = SPECIES[(rng() * SPECIES.length) | 0];
  if (criteria.species && species !== criteria.species) return null;

  // Roll eye
  const eye = EYES[(rng() * EYES.length) | 0];
  if (criteria.eye && eye !== criteria.eye) return null;

  // Roll hat
  const hat = rarity === 'common' ? 'none' : HATS[(rng() * HATS.length) | 0];
  if (criteria.hat && hat !== criteria.hat) return null;

  // Roll shiny
  const shiny = rng() < SHINY_CHANCE;
  if (criteria.shiny === true && !shiny) return null;

  // Match! Now generate full stats for the result
  const displayRarity = rarity.charAt(0).toUpperCase() + rarity.slice(1);
  const STAT_FLOORS = { common: 5, uncommon: 15, rare: 25, epic: 35, legendary: 50 };
  const floor = STAT_FLOORS[rarity];

  let primaryStat = STAT_NAMES[(rng() * STAT_NAMES.length) | 0];
  let weakStat = STAT_NAMES[(rng() * STAT_NAMES.length) | 0];
  while (weakStat === primaryStat) {
    weakStat = STAT_NAMES[(rng() * STAT_NAMES.length) | 0];
  }

  const stats = {};
  for (const name of STAT_NAMES) {
    if (name === primaryStat) {
      stats[name] = Math.min(100, floor + 50 + ((rng() * 30) | 0));
    } else if (name === weakStat) {
      stats[name] = Math.max(1, floor - 10 + ((rng() * 15) | 0));
    } else {
      stats[name] = floor + ((rng() * 40) | 0);
    }
  }

  const inspirationSeed = (rng() * 1e9) | 0;

  const buddy = {
    rarity: displayRarity, species, eye, hat, shiny,
    stats, salt, seed, inspirationSeed,
  };
  buddy.name = generateName(buddy);
  return buddy;
}

/**
 * Find all salts that produce buddies matching the criteria.
 * Runs for the full maxAttempts and returns every match found.
 * @param {string} userId - User's identity string
 * @param {object} criteria - Desired traits { species, rarity, eye, hat, shiny }
 * @param {object} options - { maxAttempts, onProgress, progressInterval }
 * @returns {{ matches: Array, attempts: number, elapsed: number }}
 */
export function findSalt(userId, criteria, options = {}) {
  const {
    maxAttempts = 1_000_000,
    onProgress = null,
    progressInterval = 100_000,
  } = options;

  // Normalize rarity to lowercase for inline comparison
  const normalizedCriteria = { ...criteria };
  if (criteria.rarity) {
    normalizedCriteria._rarity = criteria.rarity.toLowerCase();
  }

  const matches = [];
  let attempts = 0;
  const startTime = Date.now();

  while (attempts < maxAttempts) {
    attempts++;
    const buddy = tryMatch(userId, normalizedCriteria);

    if (buddy) {
      matches.push(buddy);
    }

    if (onProgress && attempts % progressInterval === 0) {
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = Math.floor(attempts / elapsed);
      onProgress({ attempts, elapsed, rate, found: matches.length });
    }
  }

  const elapsed = (Date.now() - startTime) / 1000;
  return { matches, attempts, elapsed };
}

/**
 * Estimate difficulty of finding a match
 */
export function estimateDifficulty(criteria) {
  let probability = 1;

  if (criteria.species) probability *= 1 / 18;
  if (criteria.rarity) {
    const weights = { Common: 0.60, Uncommon: 0.25, Rare: 0.10, Epic: 0.04, Legendary: 0.01 };
    probability *= weights[criteria.rarity] || 0.01;
  }
  if (criteria.eye) probability *= 1 / 6;
  if (criteria.hat) probability *= 1 / 8;
  if (criteria.shiny) probability *= 0.01;

  const expectedAttempts = Math.ceil(1 / probability);
  let difficulty;
  if (expectedAttempts < 100) difficulty = 'trivial';
  else if (expectedAttempts < 10_000) difficulty = 'easy';
  else if (expectedAttempts < 1_000_000) difficulty = 'moderate';
  else if (expectedAttempts < 10_000_000) difficulty = 'hard';
  else if (expectedAttempts < 100_000_000) difficulty = 'very hard';
  else difficulty = 'extreme';

  return { probability, expectedAttempts, difficulty };
}
