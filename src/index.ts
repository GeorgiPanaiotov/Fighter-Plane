import { Engine } from "./game/engine/engine";

(async () => {
  const engine = await initEngine();

  const app = engine.getApp();

  await engine.initTextures();

  // WHAT IS GOING ON HERE???
  // WHY IS DELTATIME SUPPOSED TO BE DESTRUCTURED?
  app.ticker.add(({ deltaTime }) => {
    engine.update(deltaTime);
  });
})();

async function initEngine() {
  const engine = new Engine();
  await engine.init();
  return engine;
}
