'use strict';

// [PTK] fse replacement
const fs = require('./fs_extra');

const walk = require('./walk');

const loadFunctions = dir => {
  if (!fs.existsSync(dir)) return {};

  return walk(dir, { loader: loadFunction });
};

const loadFunction = file => {
  try {
    return require(file);
  } catch (error) {
    throw `Could not load function ${file}: ${error.message}`;
  }
};

module.exports = loadFunctions;
