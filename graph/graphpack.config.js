module.exports = (mode) => {
  const IS_DEV = mode !== 'production';

  return {
    server: {
      introspection: IS_DEV,
      playground: IS_DEV,
      debug: IS_DEV,
      // applyMiddleware: { app, path }, // app is from an existing (Express/Hapi,...) app
    },
  }
};