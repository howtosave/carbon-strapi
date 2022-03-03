'use strict';
/**
 * Strapi telemetry package.
 * You can learn more at https://strapi.io/documentation/developer-docs/latest/getting-started/usage-information.html
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { scheduleJob } = require('node-schedule');

const ee = require('../../utils/ee');
const wrapWithRateLimit = require('./rate-limiter');
const createSender = require('./sender');
const createMiddleware = require('./middleware');
const isTruthy = require('./is-truthy');

const LIMITED_EVENTS = [
  'didSaveMediaWithAlternativeText',
  'didSaveMediaWithCaption',
  'didDisableResponsiveDimensions',
  'didEnableResponsiveDimensions',
];

const createTelemetryInstance = strapi => {
  // [PK] removed telemetry


  return {
    destroy() {
    },
    async send() {
      return true;
    },
  };
};

const hash = str =>
  crypto
    .createHash('sha256')
    .update(str)
    .digest('hex');

const hashProject = strapi => hash(`${strapi.config.info.name}${strapi.config.info.description}`);

const hashDep = strapi => {
  const depStr = JSON.stringify(strapi.config.info.dependencies);
  const readmePath = path.join(strapi.dir, 'README.md');

  try {
    if (fs.existsSync(readmePath)) {
      return hash(`${depStr}${fs.readFileSync(readmePath)}`);
    }
  } catch (err) {
    return hash(`${depStr}`);
  }

  return hash(`${depStr}`);
};

module.exports = createTelemetryInstance;
