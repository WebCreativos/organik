'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find(ctx) {
        const {
          id
        } = ctx.params
        const user = ctx.state.user;
        const params = ctx.query
        
        const entities = await strapi.query('seguidor-seguido').find(params)
    
        return Promise.all(
            entities.map(async entity => { 
            if(params.seguidor) {
                entity.following = entity.seguidor.id == user.id

            }else {
                entity.following = entity.seguido.id == user.id
            }
            return entity
          })
        );
     
      },
    
};