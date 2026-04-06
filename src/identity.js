// User identity detection for buddy generation

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const HOME = process.env.HOME || process.env.USERPROFILE;
const CLAUDE_CONFIG = join(HOME, '.claude.json');

/**
 * Try to detect the user's identity string used for buddy generation.
 * Priority: oauthAccount.accountUuid > userID > "anon"
 */
export async function detectUserId() {
  try {
    const data = await readFile(CLAUDE_CONFIG, 'utf-8');
    const config = JSON.parse(data);

    // OAuth account UUID (Team/Pro users)
    if (config.oauthAccount?.accountUuid) {
      return { id: config.oauthAccount.accountUuid, source: 'oauthAccount.accountUuid' };
    }

    // Regular user ID
    if (config.userID) {
      return { id: config.userID, source: 'userID' };
    }
  } catch {
    // Config not found or not readable
  }

  return { id: 'anon', source: 'fallback' };
}

/**
 * Get companion info from config
 */
export async function getCompanionInfo() {
  try {
    const data = await readFile(CLAUDE_CONFIG, 'utf-8');
    const config = JSON.parse(data);
    return config.companion || null;
  } catch {
    return null;
  }
}
