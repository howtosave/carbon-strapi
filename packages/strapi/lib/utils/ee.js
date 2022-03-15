'use strict';

const _ = require('lodash');

// [PK] hack EE
const internals = { isEE: true, licenseInfo: { type: "gold" } };
const features = {
  bronze: [],
  silver: [],
  gold: ['sso'],
};

module.exports = () => {
  return true;
};

Object.defineProperty(module.exports, 'licenseInfo', {
  get: () => {
    mustHaveKey('licenseInfo');
    return internals.licenseInfo;
  },
  configurable: false,
  enumerable: false,
});

Object.defineProperty(module.exports, 'isEE', {
  get: () => {
    mustHaveKey('isEE');
    return internals.isEE;
  },
  configurable: false,
  enumerable: false,
});

Object.defineProperty(module.exports, 'features', {
  get: () => {
    mustHaveKey('licenseInfo');

    const { type: licenseType } = module.exports.licenseInfo;

    return {
      isEnabled(feature) {
        return features[licenseType].includes(feature);
      },
      getEnabled() {
        return features[licenseType];
      },
    };
  },
  configurable: false,
  enumerable: false,
});

const mustHaveKey = key => {
  if (!_.has(internals, key)) {
    const err = new Error('Tampering with license');
    err.stack = null;
    throw err;
  }
};
