/* */

console.log('Loading..... /core/sys_renderable.js');

const renderable = function (entities) {
  const renderables = [];
  entities.forEach(function (e) {
    if (e.components.renderable) {
      renderables.push(e);
    }
  });
  return renderables;
};

export {
  renderable,
};
