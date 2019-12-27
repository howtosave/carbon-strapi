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
      // API, admin 및 plugins의 router에 prefix를 적용함
      const prefix = _.get(strapi.config, 'currentEnvironment.request.router.prefix', '');
      strapi.router.prefix(prefix);

      if (!_.isEmpty(_.get(strapi.admin, 'config.routes', false))) {
        // Create router for admin.
        // Prefix router with the admin's name.
        // admin router에 prefix를 적용함
        const router = new Router({
          prefix: `${prefix}/admin`,
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
          // plugins router에 prefix를 적용함
          const router = new Router({
            prefix: `${prefix}/${pluginName}`,
          });

          // Exclude routes with prefix.
          const excludedRoutes = _.omitBy(
            plugin.config.routes,
            o => !_.has(o.config, 'prefix')
          );

          _.forEach(
            _.omit(plugin.config.routes, _.keys(excludedRoutes)),
            value => {
              composeEndpoint(value, { plugin: pluginName, router });
            }
          );

          // /!\ Could override main router's routes.
          if (!_.isEmpty(excludedRoutes)) {
            _.forEach(excludedRoutes, value => {
              composeEndpoint(value, {
                plugin: pluginName,
                router: strapi.router,
              });
            });
          }

          // Mount plugin router
          strapi.app.use(router.routes()).use(router.allowedMethods());
        });
      }
    },
  };
};
