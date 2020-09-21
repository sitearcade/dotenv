# @sitearcade/dotenv

Improved `dotenv`.

## Installation

1. `npm i -D @sitearcade/dotenv`
2. Add to beginning of entry file:

```js
import dotenv from '@sitearcade/dotenv';
// or const dotenv = require('@sitearcade/dotenv');

dotenv.config();
```

## Features

### Expansion

Expands:

```bash
HERO=batman
SIDEKICK=robin
TEAM=$HERO-and-$SIDEKICK
```

To:

```bash
HERO=batman
SIDEKICK=robin
TEAM=batman-and-robin
```

### INHERITANCE

Will merge the contents of all files matching the following patterns, with the earliest definition taking precedence:

```bash
.env.${BUILD_TARGET}.${NODE_ENV}.local
.env.${BUILD_TARGET}.${NODE_ENV}
.env.${BUILD_TARGET}.local
.env.${BUILD_TARGET}
.env.${NODE_ENV}.local
.env.${NODE_ENV}
.env.local
.env
```

### OVERRIDES AND EXPORT

You can override all relevant values, and you get some useful result formats, in addition to setting the values of `process.env`:

```js
import dotenv from '@sitearcade/dotenv';

const {raw, stringified, webpack} = dotenv.config({
  nodeEnv, // = process.env.NODE_ENV || 'development'
  buildTarget, // = process.env.BUILD_TARGET
  envDir, // = './'
});
```

### MONOREPO SUPPORT

This export will look for the nearest `lerna.json` file and use that directory by default, or fallback to `process.cwd()`:

```js
import {raw, webpack} from '@sitearcade/dotenv/lerna';
```

### BABEL PLUGIN

This plugin wraps the lerna-or-else-cwd variant, giving access to those vars available in the .env files.

```json
{
  "plugins": ["@sitearcade/dotenv/babel"]
}
```
