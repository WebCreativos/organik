'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');


/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    /**
     * Retrieve records.
     *
     * @return {Array}
     */

    async find(ctx) {
        const { user } = ctx.state
        const { followers } = ctx.query

        console.log(ctx.query)
        var filter = {
            _sort: 'created_at:DESC'
        }

        filter = {...filter, ...ctx.query}

        if(followers) {
            console.log(user.id)
            let seguidos = await strapi.query('seguidor-seguido').find({ seguidor: 3 })
            filter.user_in = seguidos
            delete filter.followers
        }

        
        
        let publicaciones = await strapi.query('publicaciones').find(filter)
        return Promise.all(
            publicaciones.map(async entity => {
 
                //lista de likes
                entity.likes = await strapi.query('likes').count({ publicacion: entity.id })
                entity.myPublication = entity.user.id == user.id
                entity.likeUser = await strapi.query('likes').count({ publicacion: entity.id, user: user.id })
                entity.likeUser = entity.likeUser>0
                entity.comentarios = await strapi.query('comentarios').count({ publicacion: entity.id })
                return entity
            })
        );

    },


    async findOne(ctx) {
        const { id } = ctx.params
        const entity = await strapi.services.publicaciones.findOne({ id })
        let likes = await strapi.query('likes').find({ publicacion: id })
        entity['likes'] = likes.map(element => {
            // mostrar solo el id del usuario y el username
            return {
                like_id: element.id,
                user_id: element.user.id,
                username: element.user.username
            }
        })
        entity.comments = await strapi.query('comentarios').find({ publicacion: id })
        return sanitizeEntity(entity, { model: strapi.models.publicaciones })
    },
    async findPublic(){ 
        const knex = strapi.connections.default;
        const result = knex.from('publicaciones').rightJoin('likes', 'publicaciones.id', 'likes.publicacion').select("publicaciones.*","likes.user as identifier").where("likes.user",2)
        return result.toSQL()  
    },
    async create(ctx) {
        let entity;
        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx)
            entity = await strapi.services.publicaciones.create(data, { files })
        } else {
            entity = await strapi.services.publicaciones.create(ctx.request.body)
        }
        entity['likes'] = []
        return sanitizeEntity(entity, { model: strapi.models.publicaciones })

    },
    async likesAndComents(publicaciones) {
        Promise.all(
            publicaciones.map(async entity => {
                sanitizeEntity(entity, { model: strapi.models.publicaciones })
                    //lista de likes
                let likes = await strapi.query('likes').find({ publicacion: entity.id })
                entity.likes = likes.map(element => {
                    // mostrar solo el id del usuario y el username
                    return {
                        like_id: element.id,
                        user_id: element.user.id,
                        username: element.user.username
                    }
                })
                let comentarios = await strapi.query('comentarios').find({ publicacion: entity.id })
                entity.comentarios_cant = comentarios.length
                return entity
            })
        );
    },

    async addLike(ctx){
        const { id } = ctx.params
        const { user } = ctx.state
        await strapi.query('likes').create({ user: user.id, publicacion:id })
        return {"msg":"success"}
    },
    async removeLike(ctx){
        const { id } = ctx.params
        const { user } = ctx.state
        await strapi.query('likes').delete({ user: user.id, publicacion:id })
        return {"msg":"success"}
    },
    async random(ctx){

        //limit to 10 posts using strapi 


        const result = await strapi
        .query("publicaciones")
        .model.query((qb) => {
          qb.orderByRaw("RANDOM()"),
          qb.limit(10)
        })
        .fetchAll()
        return result.toJSON()
    }

};