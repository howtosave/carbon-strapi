'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const koaStatic = require('koa-static');
const stream = require('stream');

const utils = require('../../utils');

/**
 * Public assets hook
 */

module.exports = strapi => {
  return {
    /**
     * Initialize the hook
     */

    async initialize() {
      const { defaultIndex, maxAge, path: publicPath } = strapi.config.middleware.settings.public;
      const staticDir = path.resolve(strapi.dir, publicPath || strapi.config.paths.static);

      if (defaultIndex === true) {
        const index = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

        const serveIndexPage = async (ctx, next) => {
          // defer rendering of strapi index page
          await next();
          if (ctx.body != null || ctx.status !== 404) return;

          ctx.url = 'index.html';
          const isInitialised = await utils.isInitialised(strapi);
          const data = {
            serverTime: new Date().toUTCString(),
            isInitialised,
            ..._.pick(strapi, [
              'config.info.version',
              'config.info.name',
              'config.admin.url',
              'config.environment',
            ]),
          };
          const content = _.template(index)(data);
          const body = stream.Readable({
            read() {
              this.push(Buffer.from(content));
              this.push(null);
            },
          });
          // Serve static.
          ctx.type = 'html';
          ctx.body = body;
        };

        strapi.router.get('/', serveIndexPage);
        strapi.router.get('/index.html', serveIndexPage);
      }

      // serve files in public folder unless a sub router renders something else
      strapi.router.get(
        '/(.*)',
        koaStatic(staticDir, {
          maxage: maxAge,
          defer: true,
        })
      );

      if (!strapi.config.serveAdminPanel) return;

      const buildDir = path.resolve(strapi.dir, 'build');
      // [PTK] fix prefix-url issue
      // main router already has a prefix. so add a path w/o url prefix for static file service
      const adminPathWoPrefix = strapi.config.admin.path.replace(strapi.config.get('middleware.settings.router.prefix', ''), '');

      strapi.router.get(
        `${adminPathWoPrefix}/*`,
        async (ctx, next) => {
          ctx.url = path.basename(ctx.url);
          await next();
        },
        koaStatic(buildDir, {
          index: 'index.html',
          maxage: maxAge,
          defer: false,
        })
      );

      strapi.router.get(`${adminPathWoPrefix}*`, ctx => {
        ctx.type = 'html';
        ctx.body = fs.createReadStream(path.join(buildDir + '/index.html'));
      });
    },
  };
};
