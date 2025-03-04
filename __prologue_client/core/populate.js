/* */

const populate = {
  shelter: function (run) {
    const ecs = run.ecs;
    const dumy1 = ecs.newEntity();
    const player = ecs.newEntity();
    ecs.addComponent(player, "position", { current: { x: 10, y: 10 } });
    ecs.addComponent(player, "info", { name: run.info.NICK, type: "player" });
    ecs.addTag(player, "player");
    ecs.addTag(player, "visible");
    const rat = ecs.newEntity();
    ecs.addComponent(rat, "position", { current: { x: 11, y: 11 } });
    ecs.addComponent(rat, "info", { name: "rat" + rat, type: "rat" });
    ecs.addTag(rat, "creature");
    ecs.addTag(rat, "visible");
  }
};

export {
  populate
};
