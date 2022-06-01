const {
  setup: setupDevServer,
  teardown: teardownDevServer
} = require('jest-dev-server');

module.exports.globalSetup = async function globalSetup() {
  await setupDevServer({
    command: `node config/server.js --port=3999`,
    launchTimeout: 50000,
    port: 3999,
  });
  // console.log("Local dev server has been setuped.");
}

module.exports.globalTeardown = async function globalTeardown() {
  await teardownDevServer();
  // console.log("Local dev server has been stopped.");
}
