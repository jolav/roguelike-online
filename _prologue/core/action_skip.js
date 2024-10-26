/* */

console.log('Loading..... core/action_skip.js');

const skip = function (e) {
  console.log(`Entitie ${e.id} skip turn`);
  return true;
};

export {
  skip,
};
