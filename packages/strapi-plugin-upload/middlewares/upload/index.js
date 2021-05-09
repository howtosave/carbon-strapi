'use strict';

const { join, isAbsolute } = require('path');
const range = require('koa-range');
const koaStatic = require('koa-static');

module.exports = strapi => ({
  initialize() {
    // [PTK] fix overring upload directory issue
    const pathSetting = strapi.config.paths.static || strapi.config.middleware.settings.public.path;
    // [PTK] supprot absolute path
    const staticDir = isAbsolute(pathSetting) ? pathSetting : join(strapi.dir, pathSetting);

    strapi.app.on('error', err => {
      if (err.code === 'EPIPE') {
        // when serving audio or video the browsers sometimes close the connection to go to range requests instead.
        // This causes koa to emit a write EPIPE error. We can ignore it.
        // Right now this ignores it globally and we cannot do much more because it is how koa handles it.
        return;
      }

      strapi.app.onerror(err);
    });

    strapi.router.get('/uploads/(.*)', range, koaStatic(staticDir, { defer: true }));
  },
});
