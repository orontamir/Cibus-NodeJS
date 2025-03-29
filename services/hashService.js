const crypto = require('crypto');

function calculateHash(clearTextPassword, salt) {
  // Concatenate the clear text password and salt, then update the hash.
  const hash = crypto.createHash('sha256');
  hash.update(clearTextPassword + salt, 'utf8');
  // Return the Base64-encoded hash.
  return hash.digest('base64');
}

module.exports = { calculateHash };
