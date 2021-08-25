const crypto = require('crypto');

const key1 = crypto.randomBytes(32).toString('hex');
const key2 = crypto.randomBytes(32).toString('hex');

console.table({ key1, key2 });

// run it like this
// nodemon ./src/lib/generate_keys.js
