// Buddy system constants (matching Claude Code's built-in buddy system)

export const SALT = 'AFAZhuGAGXHehcb';
export const SALT_LENGTH = 15;

export const SPECIES = [
  'duck', 'goose', 'blob', 'cat', 'dragon', 'octopus', 'owl', 'penguin',
  'turtle', 'snail', 'ghost', 'axolotl', 'capybara', 'cactus', 'robot',
  'rabbit', 'mushroom', 'chonk'
];

export const RARITIES = [
  { name: 'Common',    weight: 0.60, emoji: '',  statFloor: 5  },
  { name: 'Uncommon',  weight: 0.25, emoji: '',  statFloor: 15 },
  { name: 'Rare',      weight: 0.10, emoji: '',  statFloor: 25 },
  { name: 'Epic',      weight: 0.04, emoji: '',  statFloor: 35 },
  { name: 'Legendary', weight: 0.01, emoji: '',  statFloor: 50 },
];

export const EYES = ['·', '✦', '×', '◉', '@', '°'];

export const HATS = ['none', 'crown', 'tophat', 'propeller', 'halo', 'wizard', 'beanie', 'tinyduck'];

export const STAT_NAMES = ['DEBUGGING', 'PATIENCE', 'CHAOS', 'WISDOM', 'SNARK'];

export const SHINY_CHANCE = 0.01;

// Stat floors per rarity (matching Claude Code's actual values)
export const STAT_FLOORS = {
  Common: 5,
  Uncommon: 15,
  Rare: 25,
  Epic: 35,
  Legendary: 50,
};

export const RARITY_COLORS = {
  Common:    '\x1b[37m',   // white
  Uncommon:  '\x1b[32m',   // green
  Rare:      '\x1b[34m',   // blue
  Epic:      '\x1b[35m',   // magenta
  Legendary: '\x1b[33m',   // yellow
};

export const RESET = '\x1b[0m';
export const BOLD = '\x1b[1m';
export const DIM = '\x1b[2m';
export const SHINY_COLOR = '\x1b[33m\x1b[1m'; // bold yellow
