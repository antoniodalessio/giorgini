const routes = require('express').Router();
import categoryController from '../controllers/category.controller'
import productController from '../controllers/product.controller'
import builderController from '../controllers/builder.controller'
import imageController from '../controllers/image.controller'

function initApiRoutes() {

  let categoryCTRL = new categoryController()
  let productCTRL = new productController()
  let builderCTRL = new builderController()
  let imageCTRL = new imageController()

  routes.use((req: any, res: any, next: any) => verifyToken(req, res, next))

  routes.get('/category', async (req: any, res: any) => { await categoryCTRL.getAll(req, res)} )
  routes.get('/category/:id', async (req: any, res: any) => { await categoryCTRL.get(req, res)} )
  routes.post('/category', async (req: any, res: any) => { await categoryCTRL.save(req, res)} )
  routes.put('/category/:id', async (req: any, res: any) => { await categoryCTRL.update(req, res)} )
  routes.delete('/category/:id', async (req: any, res: any) => { await categoryCTRL.delete(req, res)} )

  routes.get('/product', async (req: any, res: any) => { await productCTRL.getAll(req, res)} )
  routes.get('/product/:id', async (req: any, res: any) => { await productCTRL.get(req, res)} )
  routes.post('/product', async (req: any, res: any) => { await productCTRL.save(req, res)} )
  routes.put('/product/:id', async (req: any, res: any) => { await productCTRL.update(req, res)} )
  routes.delete('/product/:id', async (req: any, res: any) => { await productCTRL.delete(req, res)} )

  routes.get('/image', async (req: any, res: any) => { await imageCTRL.getAll(req, res)} )
  routes.get('/image/:id', async (req: any, res: any) => { await imageCTRL.get(req, res)} )
  routes.post('/image', async (req: any, res: any) => { await imageCTRL.save(req, res)} )
  routes.put('/image/:id', async (req: any, res: any) => { await imageCTRL.update(req, res)} )
  routes.delete('/image/:id', async (req: any, res: any) => { await imageCTRL.delete(req, res)} )

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