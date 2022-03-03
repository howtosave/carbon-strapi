'use strict';

/**
 * Create a send function for event with all the necessary metadatas
 * @param {Object} strapi strapi app
 * @returns {Function} (event, payload) -> Promise{boolean}
 */
module.exports = strapi => {
  // [PK] removed telemetry
  return true;
};
