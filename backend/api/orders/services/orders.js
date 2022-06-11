'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {

    //Extending the default create function in orders
    async create(params, populate) {
        let entity = null
        if(params.payment_method =='coins') {
            console.log("Aca")
            let wallet = await strapi.query('wallets').findOne({user:params.user.id})
            if(wallet.coins <params.products[0].coins){
                return 'error'
            }
            entity = await strapi.query('orders').create(params)
            console.log(params)
            await strapi.query('wallets').update({user:params.user.id},{coins:(wallet.coins - params.products[0].product.coins)})

        }
        let orderExists = await strapi.query('orders').findOne({
            user: params.user.id,
            status: "Pending"
        })
        if (orderExists) {
            entity = await strapi.query('orders').update({
                id: orderExists.id
            }, params)
        } else {
            entity = await strapi.query('orders').create(params)
        }
        return entity
    },
    //Custom function to get errors messages from payment
    getErrorPayments(status) {
        switch(status) {
            case 'cc_rejected_call_for_authorize':return 'Pago no autorizado.'
            break;
            case 'cc_rejected_insufficient_amount':return 'Fondos insuficientes.'
            break;
            case 'cc_rejected_bad_filled_other':return 'Pago rechazado por error en formulario.'
            break;
            case 'cc_rejected_other_reason':return 'Pago rechazado.'
            break;
            case 'cc_rejected_bad_filled_security_code':return 'Revisa el código de seguridad de la tarjeta.'
            break;
            case 'cc_rejected_bad_filled_date':return 'Revisa la fecha de vencimiento.'
            break;

        }
    }

};