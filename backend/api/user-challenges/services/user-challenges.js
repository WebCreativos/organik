'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
    async updateChallenges(params) {
        let cantC = await strapi.query(params.model).count({user:params.user})

        let userChallenges = await strapi.query('user-challenges').findOne({user:params.user})

        userChallenges = userChallenges.map((uc)=>{
            return uc.challenge.id
        })
        let challenges = await strapi.query('challenges').find({name:params.model,id_nin:userChallenges})

        let wallet = await strapi.query('wallets').findOne({user:params.user})

        challenges.forEach((challenge)=>{
            if(challenge.cant == cantC) {
                let coins = parseInt(wallet.coins) + parseInt(challenge.coins)
                strapi.query('wallets').update({user:params.user},{coins:coins})
                strapi.query('user-challenges').create({challenge:challenge.id,user:params.user})
            }
        })

        return true
    }
};
