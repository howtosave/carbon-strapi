'use strict';

const _ = require('lodash');
const { join } = require('path');
// [PTK] fse replacement
const { access } = require('fs').promises;
const loadFiles = require('../load/load-files');

// [PTK] fse replacement
const _exists = async path => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

module.exports = async strapi => {
  const componentsDir = join(strapi.dir, 'components');

  if (!(await _exists(componentsDir))) {
    return {};
  }

  const map = await loadFiles(componentsDir, '*/*.*(js|json)');

  return Object.keys(map).reduce((acc, category) => {
    Object.keys(map[category]).forEach(key => {
      const schema = map[category][key];

      const filePath = join(componentsDir, category, schema.__filename__);

      if (!schema.collectionName) {
        return strapi.stopWithError(
          `Component ${key} is missing a "collectionName" property.\nVerify file ${filePath}.`
        );
      }

      const uid = `${category}.${key}`;

      acc[uid] = Object.assign(schema, {
        __schema__: _.cloneDeep(schema),
        uid,
        category,
        modelType: 'component',
        modelName: key,
        globalId: schema.globalId || _.upperFirst(_.camelCase(`component_${uid}`)),
      });
    });

    return acc;
  }, {});
};
