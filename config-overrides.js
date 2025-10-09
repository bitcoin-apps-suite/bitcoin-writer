const webpack = require('webpack');

module.exports = {
  webpack: function override(config, env) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser'),
    vm: require.resolve('vm-browserify'),
    assert: require.resolve('assert'),
    path: require.resolve('path-browserify'),
    os: require.resolve('os-browserify/browser'),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);
  config.ignoreWarnings = [
    /Failed to parse source map/,
    /DEP0176/, // fs.F_OK deprecation warning
    /DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE/,
    /DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE/
  ];
  
  return config;
  },
  
  devServer: function(configFunction) {
    return function(proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      
      // Fix deprecation warnings by replacing deprecated middleware options
      if (config.onBeforeSetupMiddleware || config.onAfterSetupMiddleware) {
        const beforeMiddleware = config.onBeforeSetupMiddleware;
        const afterMiddleware = config.onAfterSetupMiddleware;
        
        delete config.onBeforeSetupMiddleware;
        delete config.onAfterSetupMiddleware;
        
        config.setupMiddlewares = (middlewares, devServer) => {
          if (beforeMiddleware) {
            beforeMiddleware(devServer);
          }
          
          if (afterMiddleware) {
            afterMiddleware(devServer);
          }
          
          return middlewares;
        };
      }
      
      return config;
    };
  }
};