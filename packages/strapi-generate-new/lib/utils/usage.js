'use strict';

async function captureException() {
  return Promise.resolve();
}

async function captureError() {
  return Promise.resolve();
}

function captureStderr(name) {
  return captureError(name);
}

function trackError() {
  return Promise.resolve();
}

function trackUsage() {
  return Promise.resolve();
}

module.exports = {
  trackError,
  trackUsage,
  captureException,
  captureStderr,
};
