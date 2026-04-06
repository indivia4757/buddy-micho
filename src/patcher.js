// Binary patcher for Claude Code executable

import { readFile, writeFile, copyFile, access, stat, constants as fsConstants } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { SALT, SALT_LENGTH } from './constants.js';

const IS_WIN = process.platform === 'win32';

/**
 * Resolve symlinks to get the real file path
 */
async function resolveRealPath(filePath) {
  const { realpath } = await import('node:fs/promises');
  return realpath(filePath);
}

/**
 * Find Claude Code binary path (resolves symlinks to the actual file)
 */
export async function findClaudeBinary() {
  const candidates = [];

  // Try `which`/`where` first
  try {
    const cmd = IS_WIN ? 'where.exe claude' : 'which claude';
    const path = execSync(cmd, { encoding: 'utf-8' }).trim().split('\n')[0];
    if (path) candidates.push(path);
  } catch {}

  const home = process.env.HOME || process.env.USERPROFILE;
  if (IS_WIN) {
    const appData = process.env.APPDATA || join(home, 'AppData', 'Roaming');
    const localAppData = process.env.LOCALAPPDATA || join(home, 'AppData', 'Local');
    candidates.push(
      join(appData, 'npm', 'claude.cmd'),
      join(localAppData, 'Programs', 'claude', 'claude.exe'),
      join(home, '.claude', 'local', 'claude.exe'),
    );
  } else {
    candidates.push(
      join(home, '.claude', 'local', 'claude'),
      '/usr/local/bin/claude',
      '/opt/homebrew/bin/claude',
      join(home, '.local', 'bin', 'claude'),
      join(home, '.volta', 'bin', 'claude'),
      join(home, '.local', 'share', 'pnpm', 'claude'),
    );
    // npm global with custom prefix
    try {
      const prefix = execSync('npm config get prefix', { encoding: 'utf-8' }).trim();
      if (prefix) candidates.push(join(prefix, 'bin', 'claude'));
    } catch {}
  }

  for (const path of candidates) {
    try {
      await access(path);
      // Resolve symlinks to get the actual file
      return await resolveRealPath(path);
    } catch {}
  }

  return null;
}

/**
 * Detect if binary is Bun-compiled or Node/npm
 */
export async function detectBinaryType(binaryPath) {
  const buf = await readFile(binaryPath);

  // Check shebang line first — Node scripts start with #!/usr/bin/env node
  const header = buf.toString('utf-8', 0, Math.min(buf.length, 200));
  if (header.startsWith('#!/usr/bin/env node') || header.startsWith('#!/usr/bin/node')) {
    return 'node';
  }
  if (header.startsWith('#!/usr/bin/env bun') || header.startsWith('#!/usr/bin/bun')) {
    return 'bun';
  }

  // For compiled binaries, check for Bun runtime markers deeper in file
  const sample = buf.toString('utf-8', 0, Math.min(buf.length, 50000));
  if (sample.includes('__BUN_INTERNALS') || sample.includes('bun_error') || sample.includes('Bun.hash')) {
    return 'bun';
  }
  return 'node';
}

/**
 * Find all occurrences of the salt in a buffer
 */
function findSaltPositions(buf, salt) {
  const saltBuf = Buffer.from(salt);
  const positions = [];
  let pos = 0;

  while (pos < buf.length) {
    const idx = buf.indexOf(saltBuf, pos);
    if (idx === -1) break;
    positions.push(idx);
    pos = idx + 1;
  }

  return positions;
}

/**
 * Known salt values from different Claude Code versions.
 * Checked before auto-detection as a fast path.
 */
const KNOWN_SALTS = [
  'wtdl7Juzl4RBmno',
  'AFAZhuGAGXHehcb',
  'friend-2026-401',
];

/**
 * Auto-detect the current salt from the Claude binary.
 * Uses multiple strategies for robustness across versions and minifiers.
 */
function detectSaltFromBinary(buf) {
  const content = buf.toString('utf-8');

  // Strategy 0: Try all known salts first (fastest)
  for (const known of KNOWN_SALTS) {
    if (content.includes(known)) return known;
  }

  // Strategy 1: Find stat floors marker and look backwards for the salt assignment
  const markers = [
    'common:5,uncommon:15,rare:25,epic:35,legendary:50',
    '{common:5,uncommon:15',
  ];

  for (const marker of markers) {
    const markerIdx = content.indexOf(marker);
    if (markerIdx === -1) continue;

    const chunk = content.slice(Math.max(0, markerIdx - 1000), markerIdx);

    // Pattern: variable="<15-char-salt>", followed by minified code
    const match = chunk.match(/="([^"]{15})",\w+;var \w+=/);
    if (match) return match[1];

    // Broader: any ="<exactly 15 chars>" near marker
    const allMatches = [...chunk.matchAll(/="([^"]{15})"/g)];
    if (allMatches.length > 0) {
      return allMatches[allMatches.length - 1][1];
    }
  }

  // Strategy 2: Find PRNG constant and look nearby
  const prngIdx = content.indexOf('1831565813');
  if (prngIdx !== -1) {
    const chunk = content.slice(Math.max(0, prngIdx - 2000), prngIdx);
    const allMatches = [...chunk.matchAll(/="([^"]{15})"/g)];
    if (allMatches.length > 0) {
      return allMatches[allMatches.length - 1][1];
    }
  }

  return null;
}

/**
 * Check if we can write to a file, and if not, whether sudo might help
 */
async function checkWriteAccess(filePath) {
  try {
    await access(filePath, fsConstants.W_OK);
    return { writable: true, needsSudo: false };
  } catch {
    // Check if file is owned by root
    try {
      const s = await stat(filePath);
      const isRoot = !IS_WIN && s.uid === 0;
      return { writable: false, needsSudo: isRoot };
    } catch {
      return { writable: false, needsSudo: false };
    }
  }
}

/**
 * Write file with sudo fallback for root-owned files
 */
async function writeFileWithSudo(filePath, buf) {
  try {
    await writeFile(filePath, buf);
  } catch (err) {
    if (err.code === 'EACCES') {
      // Write to a temp file, then sudo mv
      const tmpPath = join(tmpdir(), `buddy-micho-patch-${Date.now()}`);
      await writeFile(tmpPath, buf);
      try {
        execSync(`sudo cp "${tmpPath}" "${filePath}"`, { stdio: 'inherit' });
        execSync(`rm "${tmpPath}"`, { stdio: 'pipe' });
      } catch (sudoErr) {
        execSync(`rm -f "${tmpPath}"`, { stdio: 'pipe' });
        throw new Error(
          `Permission denied writing to ${filePath}. ` +
          `Try running with sudo: sudo buddy-micho`
        );
      }
      return;
    }
    throw err;
  }
}

/**
 * Copy file with sudo fallback
 */
async function copyFileWithSudo(src, dest) {
  try {
    await copyFile(src, dest);
  } catch (err) {
    if (err.code === 'EACCES') {
      execSync(`sudo cp "${src}" "${dest}"`, { stdio: 'inherit' });
      return;
    }
    throw err;
  }
}

/**
 * Find the previously applied salt from collection data
 */
async function findPreviousSalt(binaryPath) {
  try {
    const home = process.env.HOME || process.env.USERPROFILE;
    const dataPath = join(home, '.buddy-micho', 'last-salt.txt');
    const salt = (await readFile(dataPath, 'utf-8')).trim();
    if (salt.length === SALT_LENGTH) return salt;
  } catch {}
  return null;
}

/**
 * Save the last applied salt for future re-patching
 */
async function saveLastSalt(salt) {
  const { mkdir } = await import('node:fs/promises');
  const home = process.env.HOME || process.env.USERPROFILE;
  const dir = join(home, '.buddy-micho');
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'last-salt.txt'), salt);
}

/**
 * Read the actual salt currently in the Claude binary.
 * Used by showCurrent() to display the correct buddy.
 */
export async function readCurrentSalt(binaryPath) {
  const buf = await readFile(binaryPath);

  // Try previously applied salt first
  const prevSalt = await findPreviousSalt(binaryPath);
  if (prevSalt && findSaltPositions(buf, prevSalt).length > 0) {
    return prevSalt;
  }

  // Auto-detect from binary
  const detected = detectSaltFromBinary(buf);
  if (detected) return detected;

  // Fallback to hardcoded default
  if (findSaltPositions(buf, SALT).length > 0) return SALT;

  return null;
}

/**
 * Patch the Claude Code binary with a new salt
 */
export async function patchBinary(binaryPath, newSalt) {
  if (newSalt.length !== SALT_LENGTH) {
    throw new Error(`Salt must be exactly ${SALT_LENGTH} characters, got ${newSalt.length}`);
  }

  // Read binary
  const buf = await readFile(binaryPath);

  // Find salt positions — try known salts first, then auto-detect
  let positions = findSaltPositions(buf, SALT);
  let currentSalt = SALT;

  if (positions.length === 0) {
    // Try previously applied salt
    const prevSalt = await findPreviousSalt(binaryPath);
    if (prevSalt && prevSalt !== newSalt) {
      positions = findSaltPositions(buf, prevSalt);
      currentSalt = prevSalt;
    }
  }

  if (positions.length === 0) {
    // Auto-detect salt from binary (handles different versions/installations)
    const detected = detectSaltFromBinary(buf);
    if (detected && detected !== newSalt) {
      positions = findSaltPositions(buf, detected);
      currentSalt = detected;
    }
  }

  if (positions.length === 0) {
    throw new Error(
      'Could not find salt in binary. ' +
      'Try restoring first with: buddy-micho restore'
    );
  }

  // Check write access early and warn
  const { writable, needsSudo } = await checkWriteAccess(binaryPath);
  if (!writable && !needsSudo) {
    throw new Error(`Cannot write to ${binaryPath}. Check file permissions.`);
  }

  // Create backup
  const backupPath = binaryPath + '.backup';
  try {
    await access(backupPath);
    // Backup already exists, don't overwrite
  } catch {
    await copyFileWithSudo(binaryPath, backupPath);
  }

  // Patch all occurrences
  const newSaltBuf = Buffer.from(newSalt);
  for (const pos of positions) {
    newSaltBuf.copy(buf, pos);
  }

  // Write patched binary (with sudo if needed)
  await writeFileWithSudo(binaryPath, buf);

  // Re-sign on macOS
  if (process.platform === 'darwin') {
    try {
      const cmd = needsSudo
        ? `sudo codesign --force --sign - "${binaryPath}"`
        : `codesign --force --sign - "${binaryPath}"`;
      execSync(cmd, { stdio: 'pipe' });
    } catch {
      // Non-fatal - may work without signing
    }
  }

  // Verify the patch actually worked
  const verifyBuf = await readFile(binaryPath);
  const verifyPositions = findSaltPositions(verifyBuf, newSalt);
  if (verifyPositions.length === 0) {
    throw new Error(
      'Patch verification failed — the salt was not written. ' +
      'This may be a permission issue. Try: sudo buddy-micho'
    );
  }

  // Remember this salt for future re-patching
  await saveLastSalt(newSalt);

  return { positions: positions.length, backupPath };
}

/**
 * Restore from backup
 */
export async function restoreBinary(binaryPath) {
  const backupPath = binaryPath + '.backup';
  await copyFileWithSudo(backupPath, binaryPath);

  if (process.platform === 'darwin') {
    try {
      const { needsSudo } = await checkWriteAccess(binaryPath);
      const cmd = needsSudo
        ? `sudo codesign --force --sign - "${binaryPath}"`
        : `codesign --force --sign - "${binaryPath}"`;
      execSync(cmd, { stdio: 'pipe' });
    } catch {}
  }

  return backupPath;
}
