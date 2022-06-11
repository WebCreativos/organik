'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {

    lifecycles: {
        async afterFind(results, params, populate) {
            return Promise.all(results.map(async accesorio => {
                let id_subcategoria = accesorio.producto.subcategoria
                let slug_subcategoria = await strapi.query('subcategoria').findOne({ id: id_subcategoria })
                accesorio.producto.subcategoria = slug_subcategoria.slug
                return accesorio
            }))
        }
    }
};