// Hash functions and PRNG for buddy generation

/**
 * FNV-1a hash (used by Node/npm installs of Claude Code)
 */
export function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * wyhash simplified (used by Bun-compiled Claude Code binary)
 * This is a simplified version for compatibility
 */
export function wyhash(str) {
  let h = 0x9e3779b9n;
  const buf = Buffer.from(str);
  for (let i = 0; i < buf.length; i++) {
    h = (h ^ BigInt(buf[i])) * 0x9e3779b97f4a7c15n & 0xffffffffffffffffn;
  }
  h = (h ^ (h >> 32n)) * 0x9e3779b97f4a7c15n & 0xffffffffffffffffn;
  return Number((h ^ (h >> 32n)) & 0xffffffffn);
}

/**
 * Mulberry32 PRNG - deterministic from seed
 */
export function mulberry32(seed) {
  let s = seed | 0;
  return function () {
    s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Detect if running under Bun
 */
export function isBun() {
  return typeof globalThis.Bun !== 'undefined';
}

/**
 * Hash a string using the appropriate algorithm
 */
export function hashString(str) {
  return isBun() ? wyhash(str) : fnv1a(str);
}
