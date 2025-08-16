
module.exports = function(api) {
  const isServer = api.caller(caller => caller?.isServer);
  const isWeb = api.caller(caller => caller?.platform === 'web');

  // For Next.js, we don't want to apply any Babel transformations.
  // Next.js will use its own SWC compiler.
  // We only apply babel-preset-expo for native builds (non-web).
  if (isServer || isWeb) {
    return {};
  }

  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
