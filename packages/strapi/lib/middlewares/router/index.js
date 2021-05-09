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

      if (_.has(strapi.admin, 'config.routes')) {
        const router = new Router({
          // [PK] fix prefix-url issue
          prefix: `${strapi.config.get('middleware.settings.router.prefix', '')}/admin`,
        });

        _.get(strapi.admin, 'config.routes', []).forEach(route => {
          composeEndpoint(route, { plugin: 'admin', router });
        });

        // Mount admin router on Strapi router
        strapi.app.use(router.routes()).use(router.allowedMethods());
      }

      if (strapi.plugins) {
        // Parse each plugin's routes.
        _.forEach(strapi.plugins, (plugin, pluginName) => {

          const router = new Router({
            // [PK] fix prefix-url issue
            prefix: `${strapi.config.get('middleware.settings.router.prefix', '')}/${pluginName}`,
          });

          (plugin.config.routes || []).forEach(route => {
            const hasPrefix = _.has(route.config, 'prefix');
            composeEndpoint(route, {
              plugin: pluginName,
              router: hasPrefix ? strapi.router : router,
            });
          });

          // [PK] router tracing
          //strapi.log.debug(">>>>>>>>>> PLUGIN ROUTER:", pluginName);
          //router.stack.forEach((item) => {
          //  strapi.log.debug('  ', item.methods, '\t', item.path);
          //});
        
          // Mount plugin router
          strapi.app.use(router.routes()).use(router.allowedMethods());
        });
      }
    },
  };
};
