/**
 * Retrun a random int, used by `utils.uid()`
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return a unique identifier with the given `len`.
 */
exports.uid = function(len) {
  var buf = []
	 , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	 , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
	 buf.push(chars[getRandomInt(0, charlen - 1)]);
  }
  // Add type to distinguish Client Tokens From Server Tokens
  return buf.join('');
};






