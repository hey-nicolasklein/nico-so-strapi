'use strict';

/**
 * site-settings service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::site-setting.site-setting');
