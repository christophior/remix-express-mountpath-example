const path = require("path");
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const { createRequestHandler } = require("@remix-run/express");

const BUILD_DIR = path.join(process.cwd(), "build");

const app = express();
app.use(compression());

/**************************************************
 * setting up everything under /example
 **************************************************/

const example = express();

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
example.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
example.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
example.use(express.static("public", { maxAge: "1h" }));

example.use(morgan("tiny"));

example.all("*", (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    purgeRequireCache();
  }

  // req.url is a relative path with no reference to
  // the mount path so adding it manually
  req.url = "/example" + req.url;

  return createRequestHandler({
    build: require(BUILD_DIR),
    mode: process.env.NODE_ENV,
  })(req, res, next);
});

/**************************************************/

// setup /example mountpath
app.use("/example", example);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (let key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
