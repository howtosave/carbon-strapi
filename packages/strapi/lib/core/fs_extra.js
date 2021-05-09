'use strict';

const fs = require('fs')
const { existsSync, readdirSync:fsReaddirSync } = fs;
const { access, readdir:fsReaddir, stat } = fs.promises;

/**
 * [PTK] fs helper
 */

module.exports = {
  /**
   * use functions in fs
   */    
  existsSync,
  stat,

  /**
   * exception handling
   */
  async exists(path) {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  },

  async readdir(path) {
    try {
      return await fsReaddir(path);
    } catch {
      return [];
    }
  },

  readdirSync(path, opt) {
    try {
      return fsReaddirSync(path, opt);
    } catch {
      return [];
    }
  },

};
