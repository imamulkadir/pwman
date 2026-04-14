/**
 * Common utility functions
 */

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
}

/**
 * Format timestamp to readable date
 * @param {string} isoString - ISO date string
 * @returns {string}
 */
export function formatDate(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Unknown date";
  }
}

/**
 * Generate a unique ID
 * @returns {string}
 */
export function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Mask password for display
 * @param {string} password - Password to mask
 * @returns {string}
 */
export function maskPassword(password) {
  return "•".repeat(Math.min(password.length, 8));
}

/**
 * Validate passphrase strength
 * @param {string} passphrase - Passphrase to validate
 * @returns {{score: number, message: string}}
 */
export function validatePassphraseStrength(passphrase) {
  let score = 0;
  const messages = [];

  if (passphrase.length >= 8) {
    score += 1;
  } else {
    messages.push("At least 8 characters");
  }

  if (passphrase.length >= 16) {
    score += 1;
  } else if (passphrase.length < 8) {
    messages.push("16+ characters recommended");
  }

  if (/[a-z]/.test(passphrase)) score += 1;
  else messages.push("Add lowercase letters");

  if (/[A-Z]/.test(passphrase)) score += 1;
  else messages.push("Add uppercase letters");

  if (/[0-9]/.test(passphrase)) score += 1;
  else messages.push("Add numbers");

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passphrase)) score += 1;
  else messages.push("Add special characters");

  const strengthLevels = [
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Very Strong",
  ];

  return {
    score,
    level: strengthLevels[score] || "Very Weak",
    message: messages.length > 0 ? messages.join(", ") : "Good passphrase!",
  };
}

/**
 * Check if string is a valid URL
 * @param {string} text - Text to validate
 * @returns {boolean}
 */
export function isValidUrl(text) {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if string is a valid email
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Truncate string with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string}
 */
export function truncate(text, length = 30) {
  return text.length > length ? text.substring(0, length) + "..." : text;
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generate strong random password
 * @param {number} length - Password length
 * @returns {string}
 */
export function generatePassword(length = 16) {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const all = uppercase + lowercase + numbers + symbols;

  let password = "";
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));

  for (let i = password.length; i < length; i++) {
    password += all.charAt(Math.floor(Math.random() * all.length));
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}
