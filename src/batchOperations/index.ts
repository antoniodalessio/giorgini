// import imageHelper from '../helpers/ImageHelper'
// var fs = require('fs');
// var Jimp = require('jimp');
// var webp = require('webp-converter');
// const sharp = require('sharp');


// class BatchOperations {

//   private imgHelper: imageHelper 

//   constructor() {
//     this.imgHelper = new imageHelper()
//     this.convertImagesToWebp()
//     //this.test()
//   }

//   jpgsTowebps() {

//   } 
  
//   async convertImagesToWebp() {
//     let files = await fs.readdirSync('./site/images/work/')
//     for(const file of files) {
//       if(file.match(/.jpg/ig)) {
//         const fileName = file.replace('.jpg', '')

//         await sharp(`${process.env.SITE_IMAGE_PATH}${file}`)
//                 .toFile(`${process.env.SITE_IMAGE_PATH}../webp/${fileName}.webp`, (e: any, info: any) => {console.log(e, info)})

//         /*await webp.cwebp(
//           `${process.env.SITE_IMAGE_PATH}${file}`,
//           `${process.env.SITE_IMAGE_PATH}../webp/${fileName}.webp`,
//           "-q 80",
//           function(status: any,error: any){
//              //if conversion successful status will be '100'
//             //if conversion fails status will be '101'
//             console.log(status,error);	
//           });*/
//       }
//     }
//   }

//   async test() {
//     await webp.cwebp(
//       `${process.env.SITE_IMAGE_PATH}vestito-cerimonia_normal.jpg`,
//       `${process.env.SITE_IMAGE_PATH}../webp/vestito-cerimonia_normal.webp`,
//       "-q 80",
//       function(status: any,error: any){
//          //if conversion successful status will be '100'
//         //if conversion fails status will be '101'
//         console.log(status,error);	
//       });
//   }
// }

// export default BatchOperations