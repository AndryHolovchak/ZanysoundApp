module.exports.removeSpaces = (str) => {
  return str.replace(/\s/g, "");
};
module.exports.removeExtraSpaces = (str) => str.replace(/\s+/g, " ").trim();
// module.exports.escape = (str) =>

module.exports.escapeString = (s) => {
  return s
    ? s
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/\t/g, "\\t")
        .replace(/\v/g, "\\v")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/[\x00-\x1F\x80-\x9F]/g, hex)
    : s;
  function hex(c) {
    var v = "0" + c.charCodeAt(0).toString(16);
    return "\\x" + v.substr(v.length - 2);
  }
};
