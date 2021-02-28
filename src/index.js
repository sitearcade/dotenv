// import

const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');
const expand = require('dotenv-expand');

// fns

const getEnvPath = (base) => (...env) => (
  env.every(Boolean) && [base, ...env].join('.')
);

const readEnv = (loc) =>
  expand(dotenv.config({path: loc})).parsed;

// export

function config({
  nodeEnv = process.env.NODE_ENV || 'development',
  buildTarget = process.env.BUILD_TARGET,
  envDir = './',
} = {}) {
  const envPath = getEnvPath(path.resolve(process.cwd(), envDir, '.env'));

  const raw = [
    envPath(buildTarget, nodeEnv, 'local'),
    envPath(buildTarget, nodeEnv),
    envPath(buildTarget, 'local'),
    envPath(buildTarget),
    envPath(nodeEnv, 'local'),
    envPath(nodeEnv),
    envPath('local'),
    envPath(),
  ].reduce((acc, loc) => {
    // eslint-disable-next-line no-sync
    if (loc && fs.existsSync(loc)) {
      return Object.assign(readEnv(loc), acc);
    }

    return acc;
  }, {});

  const stringified = Object.keys(raw).reduce((acc, key) => {
    acc[key] = JSON.stringify(raw[key]);

    return acc;
  }, {});

  return {
    raw,
    stringified,
    webpack: {'process.env': stringified},
  };
}

module.exports = {config};
