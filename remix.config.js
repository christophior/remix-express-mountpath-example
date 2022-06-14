/**
 * @type {import('@remix-run/dev').AppConfig}
 */

const { mountRoutes } = require("remix-mount-routes");

module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  publicPath: "/example/build/",
  routes: () => {
    const routes = mountRoutes("/example", "routes");
    return routes;
  },
};
