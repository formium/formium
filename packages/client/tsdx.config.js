const pkg = require('./package.json');
module.exports = {
  rollup(config) {
    if (config.output.format === 'umd') {
      delete config.external;
      config.output.format = 'iife';
    }

    config.plugins.push({
      __VERSION__: pkg.version,
    });

    return config;
  },
};
