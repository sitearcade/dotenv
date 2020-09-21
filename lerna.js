// import

const path = require('path');

const find = require('find-config');

const {config} = require('./index');

// vars

const envDir = path.parse(find('lerna.json') || '').dir || undefined;

// run

module.exports = config({envDir});
