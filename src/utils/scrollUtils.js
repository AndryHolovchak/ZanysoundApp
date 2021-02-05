const getPixelsToEndScrollingY = (node) => {
  // console.log(node.scrollHeight);
  // console.log(node.clientHeight);
  // console.log(node.scrollTop);
  // console.log("-----------------------------------------");

  return node.scrollHeight - node.clientHeight - node.scrollTop;
};

module.exports = { getPixelsToEndScrollingY };
