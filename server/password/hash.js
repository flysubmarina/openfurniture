var bcrypt = require('bcrypt');
const { createHmac } = require('crypto')
const { HASH_SECRET } = require('./config')
const saltRounds = 10;
exports.cryptPassword = function (password) {
  let hmac = createHmac('sha256', HASH_SECRET).update(password).digest('hex')
  return hmac
};

exports.comparePassword = function (plainPass, hashword) {
  let plainHash = createHmac('sha256', HASH_SECRET).update(plainPass).digest('hex')
  return plainHash == hashword;
};