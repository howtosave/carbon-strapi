'use strict';
/**
 * Strapi telemetry package.
 * You can learn more at https://strapi.io/documentation/developer-docs/latest/getting-started/usage-information.html
 */

// [PK] removed telemetry

const createTelemetryInstance = () => {
  return {
    destroy() {
    },
    async send() {
      return true;
    },
  };
};

module.exports = createTelemetryInstance;
