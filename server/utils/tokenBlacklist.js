// Simple in-memory blacklist for JWT tokens.
// In production, consider Redis or another shared store.

let blacklistedTokens = new Set();

export const blacklistToken = (token) => {
  if (token) {
    blacklistedTokens.add(token);
  }
};

export const isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};
