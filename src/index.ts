require('dotenv').config()
import App from './app'

const app = new App()

const mongoose = require('mongoose');



import Assemble from './assemble'
let assemble = new Assemble({
    templatesPath: process.env.TEMPLATES_PATH,
    partialsPath: `${process.env.TEMPLATES_PATH}/partials/`,
    defaultLayout: `${process.env.TEMPLATES_PATH}/layout/default.hbs`,
    defaultFolder: `${process.env.SITE_PATH}/`
})

//import FTP from './utils/ftp'

//var clientftp = new FTP(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);


//import { Product, Category } from './models'

async function initMongoose() { 

    /*let connection = await mongoose.connect(`${process.env.DB_HOST}${process.env.DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
*/

    /*let product = new Product({
        _id: new mongoose.Types.ObjectId(),
        title: "Giacca Kimono",
        description: "In jersey stampato",
        slug: "giacca-kimono-jersey-stampato"
    })

    product = await product.save()

    let category = new Category({
        _id: new mongoose.Types.ObjectId(),
        title: "Abiti su misura - Sartoria Firenze",
        slug:"abbigliamento sartoria firenze",
        products: [product._id]
    });

    await category.save()
    
    product.category = category._id
    await product.save()*/
    


    /*let category: any = await Category.find().populate('products');

    console.log(category[0])*/

}

//initMongoose()