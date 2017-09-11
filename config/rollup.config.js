const rollupConfig = require('@ionic/app-scripts/config/rollup.config');
const replace = require('rollup-plugin-replace');

const isProd = (process.env.IONIC_ENV === 'prod');

const rollupConfigReplaceEnviroment = replace({
  exclude: 'node_modules/**',
  // use the /environments/environment.dev as the default import(!), no stub needed.
  // note we only replace the "last" part of the import statement so relative paths are maintained
  '/environments/environment' : ( isProd ? '/environments/environment.prod' : '/environments/environment'),
});

rollupConfig.plugins = rollupConfig.plugins || [];
rollupConfig.plugins.splice(0, 0, rollupConfigReplaceEnviroment);

module.exports = rollupConfig;
