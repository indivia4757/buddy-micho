// User identity detection for buddy generation

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const HOME = process.env.HOME || process.env.USERPROFILE;

// Claude config can be in multiple locations depending on OS/install
const CONFIG_CANDIDATES = [
  join(HOME, '.claude.json'),
  ...(process.platform === 'win32'
    ? [join(process.env.APPDATA || join(HOME, 'AppData', 'Roaming'), 'claude', 'claude.json')]
    : []),
  ...(process.env.XDG_CONFIG_HOME
    ? [join(process.env.XDG_CONFIG_HOME, 'claude', 'claude.json')]
    : [join(HOME, '.config', 'claude', 'claude.json')]),
];

async function readClaudeConfig() {
  for (const path of CONFIG_CANDIDATES) {
    try {
      const data = await readFile(path, 'utf-8');
      return JSON.parse(data);
    } catch {}
  }
  return null;
}

/**
 * Try to detect the user's identity string used for buddy generation.
 * Priority: oauthAccount.accountUuid > userID > "anon"
 */
export async function detectUserId() {
  const config = await readClaudeConfig();
  if (config) {
    if (config.oauthAccount?.accountUuid) {
      return { id: config.oauthAccount.accountUuid, source: 'oauthAccount.accountUuid' };
    }
    if (config.userID) {
      return { id: config.userID, source: 'userID' };
    }
  }
  return { id: 'anon', source: 'fallback' };
}

/**
 * Get companion info from config
 */
export async function getCompanionInfo() {
  const config = await readClaudeConfig();
  return config?.companion || null;
}

/**
 * Clear the cached companion data from Claude config.
 * This forces Claude Code to regenerate the buddy from the (patched) salt on next startup.
 * Returns true if cleared, false if no config or no companion field found.
 */
export async function clearCompanionCache() {
  for (const path of CONFIG_CANDIDATES) {
    try {
      const data = await readFile(path, 'utf-8');
      const config = JSON.parse(data);
      if (config.companion) {
        delete config.companion;
        const { writeFile: wf } = await import('node:fs/promises');
        await wf(path, JSON.stringify(config, null, 2) + '\n');
        return true;
      }
    } catch {}
  }
  return false;
}
