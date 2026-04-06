// Deterministic buddy name generator based on seed
// Names are picked from species-specific pools using the buddy's inspirationSeed

const NAME_POOLS = {
  duck: [
    'Quill', 'Waddle', 'Ripple', 'Puddles', 'Drake', 'Biscuit', 'Maple',
    'Sunny', 'Dabble', 'Pebble', 'Splash', 'Ducky', 'Reed', 'Skipper',
    'Paddle', 'Cheddar', 'Crumble', 'Flicker', 'Nectar', 'Dewdrop',
  ],
  goose: [
    'Havoc', 'Ruckus', 'Gander', 'Hissy', 'Mayhem', 'Clamor', 'Rumble',
    'Riot', 'Brawl', 'Tempest', 'Squall', 'Blitz', 'Rascal', 'Tumult',
    'Goober', 'Mischief', 'Uproar', 'Frenzy', 'Rowdy', 'Scramble',
  ],
  blob: [
    'Tremor', 'Jelly', 'Gloop', 'Ooze', 'Squish', 'Plop', 'Wiggles',
    'Dough', 'Mochi', 'Marble', 'Bloop', 'Wobble', 'Squishy', 'Taffy',
    'Marshmallow', 'Bubble', 'Giggles', 'Slime', 'Bouncy', 'Fudge',
  ],
  cat: [
    'Whisper', 'Shadow', 'Ember', 'Luna', 'Cinder', 'Velvet', 'Nimbus',
    'Sable', 'Onyx', 'Mist', 'Clover', 'Sage', 'Thistle', 'Dusk',
    'Midnight', 'Twilight', 'Pepper', 'Smoky', 'Jinx', 'Flicker',
  ],
  dragon: [
    'Ignis', 'Pyra', 'Scorch', 'Blaze', 'Ember', 'Cindra', 'Vulcan',
    'Inferno', 'Fury', 'Searing', 'Fang', 'Tempest', 'Magma', 'Obsidian',
    'Draco', 'Wyrm', 'Apex', 'Titan', 'Thunder', 'Crest',
  ],
  octopus: [
    'Coral', 'Inkwell', 'Tentacle', 'Abyss', 'Depth', 'Current', 'Krake',
    'Nautilus', 'Tidal', 'Reef', 'Marina', 'Fjord', 'Kelp', 'Vortex',
    'Suction', 'Oceanus', 'Ripple', 'Drift', 'Azure', 'Maelstrom',
  ],
  owl: [
    'Sage', 'Oracle', 'Hoot', 'Dusk', 'Athena', 'Cipher', 'Maven',
    'Rune', 'Glyph', 'Riddle', 'Echo', 'Fable', 'Scroll', 'Quill',
    'Nocturne', 'Vesper', 'Mystic', 'Seer', 'Talon', 'Zenith',
  ],
  penguin: [
    'Frost', 'Tuxedo', 'Glacier', 'Nordic', 'Floe', 'Polar', 'Summit',
    'Shiver', 'Crisp', 'Icicle', 'Alpine', 'Brisk', 'Sleet', 'Flurry',
    'Sterling', 'Admiral', 'Skipper', 'Slate', 'Pebble', 'Wadsworth',
  ],
  turtle: [
    'Bastion', 'Anchor', 'Pebble', 'Moss', 'Bedrock', 'Harbor', 'Cove',
    'Granite', 'Boulder', 'Tarn', 'Dale', 'Cairn', 'Glen', 'Sheldon',
    'Steady', 'Terra', 'Sage', 'Oak', 'Stone', 'Reef',
  ],
  snail: [
    'Trail', 'Spiral', 'Dewdrop', 'Glimmer', 'Pearl', 'Trace', 'Drift',
    'Curl', 'Helix', 'Pace', 'Meander', 'Wander', 'Haze', 'Glisten',
    'Serene', 'Lull', 'Twirl', 'Coil', 'Orbit', 'Loop',
  ],
  ghost: [
    'Phantom', 'Shade', 'Specter', 'Wraith', 'Haunt', 'Gloom', 'Wisp',
    'Apparition', 'Flicker', 'Ethereal', 'Void', 'Nyx', 'Vanish', 'Lurk',
    'Hollow', 'Shroud', 'Echo', 'Mirage', 'Fade', 'Mist',
  ],
  axolotl: [
    'Blossom', 'Coral', 'Petal', 'Frilly', 'Bubble', 'Nectar', 'Bloom',
    'Sprout', 'Flora', 'Dew', 'Luna', 'Starlet', 'Shimmer', 'Glow',
    'Lotus', 'Prism', 'Ripple', 'Crystal', 'Dawn', 'Opal',
  ],
  capybara: [
    'Zen', 'Mellow', 'Breeze', 'Calm', 'Willow', 'Clover', 'Meadow',
    'Sunny', 'River', 'Oasis', 'Serenity', 'Harmony', 'Balm', 'Cedar',
    'Horizon', 'Basil', 'Saffron', 'Linden', 'Fields', 'Solace',
  ],
  cactus: [
    'Spike', 'Thorn', 'Arid', 'Dune', 'Prickle', 'Mesa', 'Barb',
    'Saguaro', 'Quill', 'Burr', 'Sandstone', 'Ridge', 'Bluff', 'Dry',
    'Needles', 'Canyon', 'Mirage', 'Sienna', 'Flint', 'Scorched',
  ],
  robot: [
    'Circuit', 'Volt', 'Pixel', 'Byte', 'Servo', 'Axiom', 'Logic',
    'Binary', 'Chrome', 'Titanium', 'Core', 'Nexus', 'Spark', 'Flux',
    'Chip', 'Signal', 'Grid', 'Node', 'Vector', 'Quantum',
  ],
  rabbit: [
    'Dash', 'Hop', 'Clover', 'Thistle', 'Sprint', 'Bounce', 'Flick',
    'Zinnia', 'Fern', 'Bramble', 'Swift', 'Pippin', 'Nutmeg', 'Hazel',
    'Cotton', 'Breezy', 'Scamper', 'Thyme', 'Twig', 'Lucky',
  ],
  mushroom: [
    'Spore', 'Mycelium', 'Truffle', 'Fungus', 'Cap', 'Shroom', 'Moss',
    'Lichen', 'Mold', 'Puffball', 'Portobello', 'Chanterelle', 'Toadstool',
    'Damp', 'Undergrowth', 'Mulch', 'Loam', 'Canopy', 'Rot', 'Decay',
  ],
  chonk: [
    'Chunk', 'Massive', 'Tank', 'Boulder', 'Hefty', 'Titan', 'Bigfoot',
    'Mammoth', 'Colossus', 'Beefy', 'Bulk', 'Whopper', 'Gordo', 'Jumbo',
    'Mega', 'Absolute', 'Unit', 'Tonnage', 'Atlas', 'Goliath',
  ],
};

// Rarity-based prefix pools (optional flair for higher rarities)
const RARITY_PREFIXES = {
  Common: null,  // no prefix
  Uncommon: null,
  Rare: ['Ancient', 'Mystic', 'Astral', 'Arcane', 'Runic', 'Primal', 'Elder', 'Silent', 'Twilight', 'Fabled'],
  Epic: ['Grand', 'Exalted', 'Radiant', 'Sovereign', 'Illustrious', 'Majestic', 'Glorious', 'Valiant', 'Imperial', 'Celestial'],
  Legendary: ['Eternal', 'Immortal', 'Divine', 'Mythic', 'Supreme', 'Almighty', 'Transcendent', 'Infinite', 'Primordial', 'Godlike'],
};

/**
 * Generate a deterministic name for a buddy based on its traits
 */
export function generateName(buddy) {
  const pool = NAME_POOLS[buddy.species] || NAME_POOLS.blob;
  const seed = buddy.inspirationSeed || buddy.seed || 0;

  // Pick base name from species pool
  const nameIdx = seed % pool.length;
  let name = pool[nameIdx];

  // Higher rarities get a prefix
  const rarity = buddy.rarity || 'Common';
  const prefixes = RARITY_PREFIXES[rarity];
  if (prefixes) {
    const prefixIdx = Math.floor(seed / pool.length) % prefixes.length;
    name = `${prefixes[prefixIdx]} ${name}`;
  }

  return name;
}
