/* */

console.log('Loading....._config.js');

let K = {
  // MapGen
  MAX_ROOMS: 50,
  // Render
  CANVAS_NAME: "canvas",
  PPP: 16,
  WIDTH: window.innerWidth - 200,
  HEIGHT: window.innerHeight - 5,
  // Game
  INIT_DATE: new Date("2097-08-29 02:14:00"),
};

(function autoUpdateK() {
  K.WIDTH = Math.floor(K.WIDTH / K.PPP) * K.PPP;
  K.HEIGHT = Math.floor(K.HEIGHT / K.PPP) * K.PPP;
})();

export {
  K
};

