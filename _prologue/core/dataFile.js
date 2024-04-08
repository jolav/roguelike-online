/* */

console.log('Loading...../core/_dataFile.js');

const combat = new Map([
  ["player", [80, 100, 4, 0, 0]],
  ["mole rat", [40, 40, 8, 0, 0,]],
  ["rat", [10, 10, 2, 0, 0]],
]);

const losRange = new Map([
  ["player", 15],
  ["mole rat", 10],
  ["rat", 7],
]);

const data = {
  combat,
  losRange
};

export {
  data,
};
