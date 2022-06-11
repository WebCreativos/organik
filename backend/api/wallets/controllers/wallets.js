'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async findOne(ctx) {
        const {user} = ctx.state
        const entity = strapi.query('wallets').findOne({user:user.id})
        return entity
    },
    async update(ctx) {
        const {user} = ctx.state
        const body = ctx.request.body
        
        let coins = 0
        
        var entity = await strapi.query('wallets').findOne({user:user.id})
        if(body.transaction == "add"){
            coins = entity.coins + body.coins
        }else {
            coins = entity.coins - body.coins
        }
        entity =  await strapi.query('wallets').update({user:user.id},{coins:coins})

        return entity
    }
};
