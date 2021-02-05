let _nextId = 0;
const generateId = () => (_nextId++).toString();

export { generateId };
