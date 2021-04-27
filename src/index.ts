// import

import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
import expand from 'dotenv-expand';

// fns

const getEnvPath = (base: string) => (...env: string[]) => (
  env.every(Boolean) && [base, ...env].join('.')
);

const readEnv = (loc: string) =>
  expand(dotenv.config({path: loc})).parsed;

// export

export function config({
  nodeEnv = process.env.NODE_ENV || 'development',
  buildTarget = process.env.BUILD_TARGET as string,
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
  ].reduce<Record<string, string>>((acc, loc) => {
    // eslint-disable-next-line no-sync
    if (loc && fs.existsSync(loc)) {
      return Object.assign(readEnv(loc), acc);
    }

    return acc;
  }, {});

  const stringified = Object.keys(raw).reduce<Record<string, string>>((acc, key) => {
    acc[key] = JSON.stringify(raw[key]);

    return acc;
  }, {});

  return {
    raw,
    stringified,
    webpack: {'process.env': stringified},
  };
}
