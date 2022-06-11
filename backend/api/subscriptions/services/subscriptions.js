'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */
const moment = require('moment')
module.exports = {
  async create(params, populate) {
    const countSubscription = await strapi.query('subscriptions').count({
      user: params.user.id
    })
    if (countSubscription > 0) {
      return await strapi.query('subscriptions').update({
        user: params.user.id
      }, params)
    } else {
      return await strapi.query('subscriptions').create({
        ...params,
        start: moment().toISOString(),
        end: moment().add(1, 'months').toISOString()
      })
    }
  }

};
