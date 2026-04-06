// Buddy Micho - Main module exports

export { generateBuddy, matchesCriteria, buddySummary } from './generator.js';
export { findSalt, estimateDifficulty } from './finder.js';
export { findClaudeBinary, patchBinary, restoreBinary, readCurrentSalt, detectBinaryType } from './patcher.js';
export { loadCollection, saveCollection, addToCollection, toggleFavorite, setNickname, setCustomPersonality, getCollectionStats, ACHIEVEMENT_DEFS } from './collection.js';
export { THEMES, NAMED_PRESETS, listThemes, listNamedPresets, getPresetsByTheme, getPresetById, listPresets } from './presets.js';
export { getDefaultPersonality, getAllPersonalities } from './personality.js';
export { generateName } from './namegen.js';
export { renderSprite, SPRITES } from './sprites.js';
export { detectUserId, getCompanionInfo } from './identity.js';
export { setLanguage, getLanguage, t, getSupportedLanguages } from './i18n.js';
export { formatBuddyCard, formatCollection, formatAchievements, formatDifficulty } from './display.js';
export { SPECIES, RARITIES, EYES, HATS, STAT_NAMES, STAT_FLOORS } from './constants.js';
export { fnv1a, wyhash, mulberry32, hashString, setBinaryType } from './hash.js';
