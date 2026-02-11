// Simple in-memory blacklist for JWT tokens.
// In a real production deployment, consider Redis or a shared store.

let blacklistedTokens = new Set();

const blacklistToken = (token) => {
  if (token) {
    blacklistedTokens.add(token);
  }
};

const isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

module.exports = {
  blacklistToken,
  isTokenBlacklisted,
};

