# Remix Express Mount Path Issue Example

## Issue

When setting up an Express Remix application with a mountpath, such as `/example` remix will throw what looks like a hydrate issue.

## Example Code

For this example the following has been done:

```
npx create-remix@latest
# with the following options selected
# - 'Just the basics'
# - 'Express Server'
# - 'Typescript'
```

Once our new Remix app was created we just updated our server.js with the following for our mountpath:

```javascript
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

example.all(
  "*",
  process.env.NODE_ENV === "development"
    ? (req, res, next) => {
        purgeRequireCache();

        return createRequestHandler({
          build: require(BUILD_DIR),
          mode: process.env.NODE_ENV,
        })(req, res, next);
      }
    : createRequestHandler({
        build: require(BUILD_DIR),
        mode: process.env.NODE_ENV,
      })
);

// setup /example mountpath
app.use("/example", example);
```

and finally we updated our `remix.config.js` publicPath attribute to the following:

```
publicPath: "/example/build/",
```

## Notes:

- I have also added a `counter` route just to do some client side react.
- If you comment out the hydrate call in `entry.client.tsx` the application will load but it will only be server rendered and our counter will not work.
