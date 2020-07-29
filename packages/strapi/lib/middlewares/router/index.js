'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');
const Router = require('koa-router');
const createEndpointComposer = require('./utils/composeEndpoint');
/**
 * Router hook
 */

module.exports = strapi => {
  const composeEndpoint = createEndpointComposer(strapi);

  return {
    /**
     * Initialize the hook
     */

    initialize() {
      _.forEach(strapi.config.routes, value => {
        composeEndpoint(value, { router: strapi.router });
      });

      strapi.router.prefix(strapi.config.get('middleware.settings.router.prefix', ''));

      if (!_.isEmpty(_.get(strapi.admin, 'config.routes', false))) {
        // Create router for admin.
        // Prefix router with the admin's name.
        const router = new Router({
          // [PTK] fix prefix-url issue
          prefix: `${strapi.config.get('middleware.settings.router.prefix', '')}/admin`,
        });

        _.forEach(strapi.admin.config.routes, value => {
          composeEndpoint(value, { router });
        });

        // Mount admin router on Strapi router
        strapi.app.use(router.routes()).use(router.allowedMethods());
      }

      if (strapi.plugins) {
        // Parse each plugin's routes.
        _.forEach(strapi.plugins, (plugin, pluginName) => {

          const router = new Router({
            // [PTK] fix prefix-url issue
            prefix: `${strapi.config.get('middleware.settings.router.prefix', '')}/${pluginName}`,
          });

          (plugin.config.routes || []).forEach(route => {
            const hasPrefix = _.has(route.config, 'prefix');
            composeEndpoint(route, {
              plugin: pluginName,
              router: hasPrefix ? strapi.router : router,
            });
          });

          // [PTK] router tracing
          strapi.log.debug(">>>>>>>>>> PLUGIN ROUTER:", pluginName);
          router.stack.forEach((item) => {
            strapi.log.debug('  ', item.methods, '\t', item.path);
          });
        
          // Mount plugin router
          strapi.app.use(router.routes()).use(router.allowedMethods());
        });
      }
    },
  };
};
