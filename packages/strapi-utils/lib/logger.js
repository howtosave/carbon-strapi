'use strict';

/**
 * Logger.
 */

const pino = require('pino');
const _ = require('lodash');

function getLogLevel() {
  if (!_.isString(process.env.STRAPI_LOG_LEVEL)) {
    // Default value.
    return 'trace';
  }

  const logLevels = Object.keys(pino.levels.values);
  const logLevel = process.env.STRAPI_LOG_LEVEL.toLowerCase();

  if (!_.includes(logLevels, logLevel)) {
    throw new Error(
      "Invalid log level set in STRAPI_LOG_LEVEL environment variable. Accepted values are: '" +
        logLevels.join("', '") +
        "'."
    );
  }

  return logLevel;
}

function getBool(envVar, defaultValue) {
  if (_.isBoolean(envVar)) return envVar;
  if (_.isString(envVar)) {
    if (envVar === 'true') return true;
    if (envVar === 'false') return false;
  }
  return defaultValue;
}

const PRINT_TIMESTAMP = getBool(process.env.STRAPI_LOG_TIMESTAMP, true);
const logFormatter = (logs, options) =>
  `${
    PRINT_TIMESTAMP ? options.asColoredText({ level: 10 }, `[${new Date().toISOString()}] `) : ''
  }${options.prefix} ${logs.stack ? logs.stack : logs.msg}`;

const logger = () => {
  const loggerConfig = {
    level: getLogLevel(),
    timestamp: false,
  };

  if (getBool(process.env.STRAPI_LOG_PRETTY_PRINT, true)) {
    const pretty = pino.pretty({
      formatter: logFormatter,
    });
    pretty.pipe(process.stdout);
    return pino(loggerConfig, pretty);
  }
  return pino(loggerConfig);
};

module.exports = logger();
