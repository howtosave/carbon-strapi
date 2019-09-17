'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

/* eslint-disable no-unused-vars */
module.exports = {
  provider: 'local',
  name: 'Local server',
  init: (config) => {
    return {
      upload: (file) => {
        return new Promise((resolve, reject) => {
          const prefix = path.join(_.get(strapi.config.currentEnvironment.request, 'router.prefix', '/'), 'uploads');
          //console.log('>>>>>>>>> prefix and path: ', prefix, path.join(strapi.config.public.path, prefix, `${file.hash}${file.ext}`))
          // write file in public/assets folder
          fs.writeFile(path.join(strapi.config.public.path, prefix, `${file.hash}${file.ext}`), file.buffer, (err) => {
            if (err) {
              return reject(err);
            }

            file.url = `${prefix}/${file.hash}${file.ext}`;

            resolve();
          });
        });
      },
      delete: (file) => {
        return new Promise((resolve, reject) => {
          const prefix = path.join(_.get(strapi.config.currentEnvironment.request, 'router.prefix', '/'), 'uploads');
          const filePath = path.join(strapi.config.public.path, prefix, `${file.hash}${file.ext}`);

          if (!fs.existsSync(filePath)) {
            return resolve('File doesn\'t exist');
          }

          // remove file from public/assets folder
          fs.unlink(filePath, (err) => {
            if (err) {
              return reject(err);
            }

            resolve();
          });
        });
      }
    };
  }
};
