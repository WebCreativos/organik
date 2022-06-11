'use strict';

const { ucs2 } = require("punycode");


/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {

    async find(params, populate) {

        var publicaciones = await strapi.query('publicaciones').find(params, populate)

        return Promise.all(
            publicaciones.map(async publicacion => {
                let likes = await strapi.query('likes').find({ publicacion: publicacion.id, _sort: 'created_at:ASC' }, populate)
                publicacion.likes = likes.map(like => {
                    return {
                        like_id: like.id,
                        user_id: like.user.id,
                        username: like.user.username
                    }
                })
                let comentarios = await strapi.query('comentarios').count({ publicacion: publicacion.id })
                publicacion.comentarios_cant = comentarios
                delete publicacion.user.password
                return publicacion
            })
        )
    },
    async findOne(params, populate) {
        const { id } = params
        const publicacion = await strapi.query('publicaciones').findOne({ id })
        const likes = await strapi.query('likes').find({ publicacion: id, _sort: 'created_at:ASC' })
        publicacion['likes'] = likes.map(like => {
            return {
                like_id: like.id,
                user_id: like.user.id,
                username: like.user.username
            }
        })
        delete publicacion.user.password
        return publicacion
    },
};