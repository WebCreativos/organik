'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const axios = require('axios')
const fs = require('fs')
const {
    createCanvas,
    loadImage
  } = require('canvas')

module.exports = {
    async generatePicture(ctx) {
        const { id } = ctx.params
        let dogToShare = await strapi.query('pets-to-adopt').findOne({id:id})


  
  
          const width = 630
          const height = 630
  
          const canvas = createCanvas(width, height)
          const context = canvas.getContext('2d')
          context.fillStyle = '#ffff'
          context.fillRect(0, 0, width, height)
  
  
  
          context.font = 'bold 20pt Menlo'
          context.textAlign = 'center'
          context.textBaseline = 'top'
  
          const text = dogToShare.name
  
          const textWidth = context.measureText(text).width
          context.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120)
          context.fillStyle = 'black'
          context.fillText(text, 50, 500)
  
          context.fillStyle = '#fff'
          context.font = 'bold 30pt Menlo'
          context.fillText('flaviocopes.com', 600, 530)
            console.log("aca")
          let image = await axios.get(dogToShare.pictures[0].url)
          await loadImage(dogToShare.pictures[0].url).then(image => {
            image.crossOrigin = "anonymous"
            context.drawImage(image, 0, 0, 150, 70)
          })
  
          await loadImage('https://app.appets.com.uy/logo.png').then(image => {
            image.crossorigin = "anonymous"
            context.drawImage(image, 0, 0, 140, 70)
          })

          await strapi.plugins.upload.services.upload.upload({ data: {fileInfo: canvas.toDataURL()}, files: {
            path: 'public/uploads', // Put your file path
            name: "asd.png",
            type: 'image/png'
          }})
          return "ok"
  
    }
};
