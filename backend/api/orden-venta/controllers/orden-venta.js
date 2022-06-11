'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
    async create(ctx) {
        let data = {
            user:ctx.request.body.user,
            producto:ctx.request.body.producto,
            estado:"Pendiente"
          }
          console.log(strapi.services)
          let entities = await strapi.query('orden-venta').create(data)

        return entities
    }
};
