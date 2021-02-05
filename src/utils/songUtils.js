const removeSongFromArray = (id, array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id == id) {
      array.splice(i, 1);
      return;
    }
  }
};

const concatWithoutSongDuplicates = (array1, array2) => {
  let array1Ids = array1.map((s) => s.id);
  return array1.concat(array2.filter((s) => array1Ids.indexOf(s.id) === -1));
};

module.exports = { removeSongFromArray, concatWithoutSongDuplicates };
