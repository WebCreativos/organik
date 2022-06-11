'use strict';


/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const moment = require('moment')
const axios = require('axios')
const Paymentwall = require('paymentwall');
module.exports = {
  async paySubscription(ctx) {
    const access_token = 'APP_USR-5163273635838364-030120-174c9c1547d64596a9a186a3e30a1101-1082482735'//'APP_USR-1383752673623426-052820-8043a52dfbed8c67c7b3a2dd1df99e51-70070217'
    const {
      token,
      tarjeta
    } = ctx.request.body
    const user = ctx.state.user;

    var subscriptionData = {
      preapproval_plan_id:"2c9380847f46c33b017f472a47410010",
      card_token_id:token,
      payer_email:"test_user_73771723@testuser.com",
      payment_method_id: tarjeta,
    }
    
    var url = "https://api.mercadopago.com/preapproval?access_token="+access_token;


    try {
      var resp = await axios.post(url,subscriptionData)
      console.log("Aca")
      await strapi.query('subscriptions').create({
        subscriptionid: resp.data.id,
        user: user.id,
      })  
    } catch (error) {
      return {
        'error':strapi.services.orders.getErrorPayments(error.response.data.code)
      }
    }

  },
  /*

  async createSubscription(ctx) {
    const {
      user
    } = ctx.state

    Paymentwall.Configure(
      Paymentwall.Base.API_GOODS,
      't_afdea10ec5808417a5e3f0e6bb57ef',
      't_fe3e1010469ebc5ce60e9c94c9996c'
    );


    var subscription = new Paymentwall.Subscription(
      12, //price
      'USD', //currency code
      'description', //description of the product
      'brunodiharce@gmail.com', // user's email
      ctx.request.body.fingerprint, // fingerprint generated by Brick.js
      ctx.request.body.token, //one-time token
      'month',
      1, {
        'user_id': user.id
      }
    );

    return await new Promise((resolve, reject) => {
      subscription.createSubscription(async (brick_response) => {
        let status, idSubscription, response;
        if (brick_response.JSON_chunk ?.error == undefined) {
          response = 200
          status = 'Payed'
          idSubscription = brick_response.JSON_chunk.id

        } else {
          response = brick_response.JSON_chunk.code
          status = 'Rejected'
          idSubscription = 0
        }
        const countSubscription = await strapi.query('subscriptions').count({
          user: user.id
        })
        if (countSubscription > 0) {
          await strapi.query('subscriptions').update({
            user: user.id
          }, {
            status: status,
            subscriptionid: idSubscription,
            start: moment().toISOString(),
            end: moment().add(1, 'months').toISOString()

          })
        } else {
          await strapi.query('subscriptions').create({
            user: user.id,
            status: status,
            subscriptionid: idSubscription,
            start: moment().toISOString(),
            end: moment().add(1, 'months').toISOString()
          })
        }
        resolve(response)
      })
    })
  },
  */
  async getUserSubscription(ctx) {
    const {
      user
    } = ctx.state
    console.log(user.id)
    const entity = await strapi.query('subscriptions').findOne({
      user: user.id,
    })
    return entity
  },


  async pingbackSubscription(ctx) {
    const {
      user_id,
    } = ctx.request.body
    var pingback = Paymentwall.pingback(
      user,
      status, {
        'user_id': user
      }
    );
    if (pingback.validate()) {
      if (pingback.isDeliverable()) {
        await strapi.query('subscriptions').update({
          user: user_id
        }, {
          status: 'Payed',
          subscriptionid: subscriptionid,
          start: moment().toISOString(),
          end: moment().add(1, 'months').toISOString()
        })
      } else {
        await strapi.query('subscriptions').update({
          user: user_id
        }, {
          status: 'Rejected',
          subscriptionid: subscriptionid,
        })
      }
    }
    return 200
  }
}
