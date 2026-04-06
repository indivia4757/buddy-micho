// Binary patcher for Claude Code executable

import { readFile, writeFile, copyFile, access, stat, constants as fsConstants } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { SALT, SALT_LENGTH } from './constants.js';

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

  // Try `which claude` first
  try {
    const path = execSync('which claude', { encoding: 'utf-8' }).trim();
    if (path) candidates.push(path);
  } catch {}

  // Common locations
  const home = process.env.HOME || process.env.USERPROFILE;
  candidates.push(
    join(home, '.claude', 'local', 'claude'),
    '/usr/local/bin/claude',
    join(home, '.local', 'bin', 'claude'),
  );

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
  const content = buf.toString('utf-8', 0, Math.min(buf.length, 1000));

  if (content.includes('bun') || content.includes('Bun')) {
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
      const isRoot = s.uid === 0;
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
      const tmpPath = join(process.env.TMPDIR || '/tmp', `buddy-micho-patch-${Date.now()}`);
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
 * Patch the Claude Code binary with a new salt
 */
export async function patchBinary(binaryPath, newSalt) {
  if (newSalt.length !== SALT_LENGTH) {
    throw new Error(`Salt must be exactly ${SALT_LENGTH} characters, got ${newSalt.length}`);
  }

  // Read binary
  const buf = await readFile(binaryPath);

  // Find salt positions — try original salt first
  let positions = findSaltPositions(buf, SALT);
  let currentSalt = SALT;

  if (positions.length === 0) {
    // Binary may already be patched — try to find the previously applied salt
    // Read collection to get the last applied salt
    const prevSalt = await findPreviousSalt(binaryPath);
    if (prevSalt && prevSalt !== newSalt) {
      positions = findSaltPositions(buf, prevSalt);
      currentSalt = prevSalt;
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
