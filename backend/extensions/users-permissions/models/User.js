'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    lifecycles: {

        afterCreate(result) {
            strapi.query('publicaciones').create({content:`Bienvenido ${result.username} a Appets!`,main_picture:1, user:1})
        },
    }
};