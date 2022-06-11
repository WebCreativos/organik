const { sanitizeEntity } = require('strapi-utils');
const { v4: uuidv4 } = require('uuid');
 
const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

module.exports = {
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }

    console.log(user)

    const walletExists = await strapi.query('wallets').count({ user: user.id })
        
    if (walletExists == 0) {
    
        let uuid = uuidv4()
        await strapi.query('wallets').create({
            user: user,
            uuid: uuid,
            coins: 0
        })
     
    }


    const userQuery = await strapi.query('user', 'users-permissions');

    return sanitizeUser(user, { model: userQuery.model });
  },
  async findOne(ctx) {
    const { id } = ctx.params
    const user = ctx.state.user;

    const entity = await strapi.query('user', 'users-permissions').findOne({ id: id })
    
    await strapi.query('likes').find({ user: id }).then((data)=>{
      entity.likes = data.length
    })
    entity.followers  = await strapi.query('seguidor-seguido').count({ seguido: id })

    entity.followings  = await strapi.query('seguidor-seguido').count({ seguidor: id }) 

    entity.following  = await strapi.query('seguidor-seguido').count({ seguido: id, seguidor:user.id }).then((data)=>{
      return data != 0
    })

    return sanitizeUser(entity);
  },
};
