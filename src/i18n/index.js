let dictionary = require("./dictionary.json");
let lang = navigator.language || navigator.userLanguage;

if (lang !== "uk" && lang !== "ru") {
  lang = "en";
}

const i18n = (key) => (dictionary[key] && dictionary[key][lang]) || "...";

module.exports = { i18n };
