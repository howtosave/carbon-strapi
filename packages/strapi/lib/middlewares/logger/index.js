'use strict';
const chalk = require('chalk');

const codeToColor = (code) => {
  return code >= 500
    ? chalk.red(code)
    : code >= 400
    ? chalk.yellow(code)
    : code >= 300
    ? chalk.cyan(code)
    : code >= 200
    ? chalk.green(code)
    : code;
};

/**
 * Logger hook
 */

module.exports = (strapi) => {
  return {
    /**
     * Initialize the hook
     */
    initialize() {
      const { level, exposeInContext, requests } = strapi.config.middleware.settings.logger;

      if (level) {
        strapi.log.level = level;
      }

      if (exposeInContext) {
        strapi.app.context.log = strapi.log;
      }

      if (requests && strapi.log.levelVal <= 20) {
        strapi.app.use(async (ctx, next) => {
          const start = Date.now();
          await next();

          const delta = Math.ceil(Date.now() - start);
          const userId = ctx.state && ctx.state.user && ctx.state.user.id;
          strapi.log.debug(`${codeToColor(ctx.status)} ${ctx.method} ${ctx.url} (${delta} ms) > ${userId ? chalk.gray(userId) : ''}`);
          if (strapi.log.levelVal <= 10) { // trace
            if (ctx.request.length > 0) strapi.log.trace('req body:', ctx.request.body);
            if (ctx.response.body) strapi.log.trace('res body:', ctx.response.body);
          }
        });
      }
    },
  };
};
