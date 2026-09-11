/**
 * ASTRA CYBERSECURITY PROTOCOL ENGINE
 * Endpoint resolution, input sanitization, rate-limiting, and sensitive data masking
 */

export const GOOGLE_APPS_SCRIPT_URL = 
  "https://script.google.com/macros/s/AKfycbwSYrFJKNLTxIvgHGD-d12ztyzm-__IMUt4VJ53ioTZo3YxOs2-UJs4GyRZbgqaMa7n/exec";

export function getSecureEndpoint(): string {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_APPS_SCRIPT_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.startsWith('https://')) {
    return envUrl.trim();
  }
  return GOOGLE_APPS_SCRIPT_URL;
}

/**
 * Normalizes and sanitizes user input
 */
export function sanitizeCyberInput(raw: string): string {
  if (!raw) return '';
  return raw
    .trim()
    .replace(/[<>'"`;\\()]/g, '') // Strip script injection characters
    .toUpperCase();
}

/**
 * Client-side rate-limiter to prevent endpoint flooding
 */
class CyberRateLimiter {
  private timestamps: number[] = [];
  private maxAttempts = 15;
  private windowMs = 30000; // 15 queries per 30 seconds

  public isAllowed(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);
    if (this.timestamps.length >= this.maxAttempts) {
      return false;
    }
    this.timestamps.push(now);
    return true;
  }

  public getRemainingCooldown(): number {
    if (this.timestamps.length === 0) return 0;
    const oldest = this.timestamps[0];
    return Math.max(0, Math.ceil((this.windowMs - (Date.now() - oldest)) / 1000));
  }
}

export const cyberLimiter = new CyberRateLimiter();

/**
 * Masks sensitive emails for public display (e.g. e***@gmail.com)
 */
export function maskSensitiveEmail(email: string): string {
  if (!email || !email.includes('@')) return 'Registered Email';
  const [user, domain] = email.split('@');
  if (user.length <= 1) return `${user}***@${domain}`;
  if (user.length === 2) return `${user[0]}***@${domain}`;
  return `${user[0]}***${user[user.length - 1]}@${domain}`;
}
