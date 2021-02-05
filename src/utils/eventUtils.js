const stopPropagationCallback = (e) => {
  e.stopPropagation();
};

const stopPropagation = (eventName, node) => {
  node.addEventListener(eventName, stopPropagationCallback);
};

const cancelStopPropagation = (eventName, node) => {
  node.removeEventListener(eventName, stopPropagationCallback);
};

module.exports = { stopPropagation, cancelStopPropagation };
