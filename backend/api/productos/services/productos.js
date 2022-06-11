'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {

    async find(params, populate) {
        let products = await strapi.query('productos').find(params, populate)
        return Promise.all(products.map(async product => {
            if (product.categories.length>0)
                product.main_category = product.categories[0]
            
            if (product.pictures.length>0)
                product.main_picture = product.pictures[0]
            
            return product
        }))

    },

};