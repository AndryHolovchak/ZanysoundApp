let _nextId = 0;
const generateId = () => {
  _nextId++;
  return _nextId.toString();
};

export {generateId};
