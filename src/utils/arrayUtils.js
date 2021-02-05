const removeByIndex = (index, array) => {
  return index >= 0 && index < array.length && !!array.splice(index, 1);
};

const removeByElemProperty = (property, value, array) => {
  let elem = getByElemProperty(property, value, array);

  if (elem != null) {
    array.splice(array.indexOf(elem), 1);
  }
};

const getByElemProperty = (property, value, array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i][property] == value) {
      return array[i];
    }
  }
  return null;
};

const removeElement = (elem, array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == elem) {
      array.splice(i, 1);
      break;
    }
  }
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
};

const getReversedArray = (array) => {
  let res = [];
  for (let i = array.length - 1; i >= 0; i--) {
    res.push(array[i]);
  }
  return res;
};

module.exports = {
  removeByIndex,
  removeByElemProperty,
  removeElement,
  getByElemProperty,
  shuffle,
  getReversedArray,
};
