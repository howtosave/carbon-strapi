'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');

const _readdirSync = path => {
  try {
    return fs.readdirSync(path);
  } catch {
    return [];
  }
};

module.exports = function walk(dir, { loader } = {}) {
  assert(typeof loader === 'function', 'opts.loader must be a function');

  const root = {};
  const paths = _readdirSync(dir, { withFileTypes: true });

  for (let fd of paths) {
    const { name } = fd;
    const fullPath = dir + path.sep + name;

    if (fd.isDirectory()) {
      root[name] = walk(fullPath, { loader });
    } else {
      const ext = path.extname(name);
      const key = path.basename(name, ext);
      root[key] = loader(fullPath);
    }
  }

  return root;
};
