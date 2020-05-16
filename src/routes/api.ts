const routes = require('express').Router();
import pageController from '../controllers/page.controller'
import categoryController from '../controllers/category.controller'
import productController from '../controllers/product.controller'
import builderController from '../controllers/builder.controller'
import imageController from '../controllers/image.controller'
import customerController from '../controllers/customer.controller'
import fabricController from '../controllers/fabric.controller'
import reviewController from '../controllers/review.controller'

function initApiRoutes() {

  let pageCTRL = new pageController()
  let categoryCTRL = new categoryController()
  let productCTRL = new productController()
  let builderCTRL = new builderController()
  let imageCTRL = new imageController()
  let customerCTRL = new customerController()
  let fabricCTRL = new fabricController()
  let reviewCTRL = new reviewController()
  

  routes.use((req: any, res: any, next: any) => verifyToken(req, res, next))

  routes.get('/page', async (req: any, res: any) => { await pageCTRL.getAll(req, res)} )
  routes.get('/page/:id', async (req: any, res: any) => { await pageCTRL.get(req, res)} )
  routes.post('/page', async (req: any, res: any) => { await pageCTRL.create(req, res)} )
  routes.put('/page/:id', async (req: any, res: any) => { await pageCTRL.update(req, res)} )
  routes.delete('/page/:id', async (req: any, res: any) => { await pageCTRL.delete(req, res)} )

  routes.get('/category', async (req: any, res: any) => { await categoryCTRL.getAll(req, res)} )
  routes.get('/category/:id', async (req: any, res: any) => { await categoryCTRL.get(req, res)} )
  routes.post('/category', async (req: any, res: any) => { await categoryCTRL.create(req, res)} )
  routes.put('/category/:id', async (req: any, res: any) => { await categoryCTRL.update(req, res)} )
  routes.delete('/category/:id', async (req: any, res: any) => { await categoryCTRL.delete(req, res)} )

  routes.get('/product', async (req: any, res: any) => { await productCTRL.getAll(req, res)} )
  routes.get('/product/:id', async (req: any, res: any) => { await productCTRL.get(req, res)} )
  routes.post('/product', async (req: any, res: any) => { await productCTRL.create(req, res)} )
  routes.put('/product/:id', async (req: any, res: any) => { await productCTRL.update(req, res)} )
  routes.delete('/product/:id', async (req: any, res: any) => { await productCTRL.delete(req, res)} )

  routes.get('/image', async (req: any, res: any) => { await imageCTRL.getAll(req, res)} )
  routes.get('/image/:id', async (req: any, res: any) => { await imageCTRL.get(req, res)} )
  routes.post('/image', async (req: any, res: any) => { await imageCTRL.create(req, res)} )
  routes.put('/image/:id', async (req: any, res: any) => { await imageCTRL.update(req, res)} )
  routes.delete('/image/:id', async (req: any, res: any) => { await imageCTRL.delete(req, res)} )

  routes.get('/customer', async (req: any, res: any) => { await customerCTRL.getAll(req, res)} )
  routes.get('/customer/:id', async (req: any, res: any) => { await customerCTRL.get(req, res)} )
  routes.post('/customer', async (req: any, res: any) => { await customerCTRL.create(req, res)} )
  routes.put('/customer/:id', async (req: any, res: any) => { await customerCTRL.update(req, res)} )
  routes.delete('/customer/:id', async (req: any, res: any) => { await customerCTRL.delete(req, res)} )

  routes.get('/fabric', async (req: any, res: any) => { await fabricCTRL.getAll(req, res)} )
  routes.get('/fabric/:id', async (req: any, res: any) => { await fabricCTRL.get(req, res)} )
  routes.post('/fabric', async (req: any, res: any) => { await fabricCTRL.create(req, res)} )
  routes.put('/fabric/:id', async (req: any, res: any) => { await fabricCTRL.update(req, res)} )
  routes.delete('/fabric/:id', async (req: any, res: any) => { await fabricCTRL.delete(req, res)} )

  routes.get('/review', async (req: any, res: any) => { await reviewCTRL.getAll(req, res)} )
  routes.get('/review/:id', async (req: any, res: any) => { await reviewCTRL.get(req, res)} )
  routes.post('/review', async (req: any, res: any) => { await reviewCTRL.create(req, res)} )
  routes.put('/review/:id', async (req: any, res: any) => { await reviewCTRL.update(req, res)} )
  routes.delete('/review/:id', async (req: any, res: any) => { await reviewCTRL.delete(req, res)} )

  
  routes.get('/publish', async (req: any, res: any) => { await builderCTRL.publish(req, res)} )
  
}

function verifyToken(req: any, res: any, next: any) {
  const bearerHeader = req.headers['authorization'];

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

export default () => {
  initApiRoutes();
  return routes
};