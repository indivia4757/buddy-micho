// Collection system

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { SPECIES, RARITIES } from './constants.js';

const HOME = process.env.HOME || process.env.USERPROFILE;
const DATA_DIR = join(HOME, '.buddy-micho');
const COLLECTION_FILE = join(DATA_DIR, 'collection.json');

/**
 * Default collection structure
 */
function defaultCollection() {
  return {
    version: 2,
    entries: [],         // All buddies ever rolled/applied
    favorites: [],       // Salt strings of favorites
    stats: {
      totalRolls: 0,
      totalApplied: 0,
      firstRoll: null,
      lastRoll: null,
    },
    achievements: [],
    settings: {
      language: 'en',
    },
  };
}

/**
 * Load collection from disk
 */
export async function loadCollection() {
  try {
    const data = await readFile(COLLECTION_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultCollection();
  }
}

/**
 * Save collection to disk
 */
export async function saveCollection(collection) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(COLLECTION_FILE, JSON.stringify(collection, null, 2));
}

/**
 * Add a buddy to the collection
 */
export async function addToCollection(buddy, applied = false) {
  const collection = await loadCollection();

  const entry = {
    ...buddy,
    timestamp: new Date().toISOString(),
    applied,
  };

  // Avoid exact duplicates (same salt)
  const existing = collection.entries.find(e => e.salt === buddy.salt);
  if (!existing) {
    collection.entries.push(entry);
  }

  collection.stats.totalRolls++;
  if (applied) collection.stats.totalApplied++;
  if (!collection.stats.firstRoll) collection.stats.firstRoll = entry.timestamp;
  collection.stats.lastRoll = entry.timestamp;

  // Check achievements
  checkAchievements(collection);

  await saveCollection(collection);
  return collection;
}

/**
 * Toggle favorite
 */
/**
 * Set nickname for a collected buddy
 */
export async function setNickname(salt, nickname) {
  const collection = await loadCollection();
  const entry = collection.entries.find(e => e.salt === salt);
  if (!entry) return false;
  entry.nickname = nickname || null;
  await saveCollection(collection);
  return true;
}

/**
 * Set custom personality for a collected buddy
 */
export async function setCustomPersonality(salt, personality) {
  const collection = await loadCollection();
  const entry = collection.entries.find(e => e.salt === salt);
  if (!entry) return false;
  entry.customPersonality = personality || null;
  await saveCollection(collection);
  return true;
}

/**
 * Toggle favorite
 */
export async function toggleFavorite(salt) {
  const collection = await loadCollection();
  const idx = collection.favorites.indexOf(salt);
  if (idx === -1) {
    collection.favorites.push(salt);
  } else {
    collection.favorites.splice(idx, 1);
  }
  await saveCollection(collection);
  return idx === -1; // true = added, false = removed
}

/**
 * Get collection statistics
 */
export function getCollectionStats(collection) {
  const entries = collection.entries;
  const speciesSet = new Set(entries.map(e => e.species));
  const rarityCount = {};
  for (const r of RARITIES) rarityCount[r.name] = 0;
  for (const e of entries) rarityCount[e.rarity]++;

  return {
    total: entries.length,
    species: speciesSet.size,
    speciesTotal: SPECIES.length,
    completion: Math.round((speciesSet.size / SPECIES.length) * 100),
    rarityCount,
    shinies: entries.filter(e => e.shiny).length,
    applied: collection.stats.totalApplied,
    favorites: collection.favorites.length,
  };
}

// Achievement definitions
const ACHIEVEMENT_DEFS = [
  { id: 'first_roll',    check: c => c.entries.length >= 1 },
  { id: 'collector_10',  check: c => c.entries.length >= 10 },
  { id: 'collector_50',  check: c => c.entries.length >= 50 },
  { id: 'collector_100', check: c => c.entries.length >= 100 },
  { id: 'all_species',   check: c => new Set(c.entries.map(e => e.species)).size >= SPECIES.length },
  { id: 'first_shiny',   check: c => c.entries.some(e => e.shiny) },
  { id: 'first_legend',  check: c => c.entries.some(e => e.rarity === 'Legendary') },
  { id: 'shiny_legend',  check: c => c.entries.some(e => e.shiny && e.rarity === 'Legendary') },
  { id: 'hat_trick',     check: c => new Set(c.entries.map(e => e.hat).filter(h => h !== 'none')).size >= 7 },
  { id: 'all_eyes',      check: c => new Set(c.entries.map(e => e.eye)).size >= 6 },
  { id: 'applied_5',     check: c => c.stats.totalApplied >= 5 },
];

/**
 * Check and award new achievements
 */
function checkAchievements(collection) {
  for (const def of ACHIEVEMENT_DEFS) {
    if (!collection.achievements.includes(def.id) && def.check(collection)) {
      collection.achievements.push(def.id);
    }
  }
}

export { ACHIEVEMENT_DEFS };
