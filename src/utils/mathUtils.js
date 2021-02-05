const normalizeNumber = (val, min, max) => {
  return (val - min) / (max - min);
};

const clampNumber = (number, min, max) => {
  return Math.min(Math.max(number, min), max);
};

module.exports = { normalizeNumber, clampNumber };
