const routes = require('express').Router();
import categoryController from '../controllers/category.controller'
import productController from '../controllers/product.controller'

function initApiRoutes() {

  let categoryCTRL = new categoryController()
  let productCTRL = new productController()

  routes.get('/category', async (req: any, res: any) => { await categoryCTRL.getAll(req, res)} )
  routes.get('/category/:id', async (req: any, res: any) => { await categoryCTRL.get(req, res)} )
  routes.post('/category', async (req: any, res: any) => { await categoryCTRL.save(req, res)} )
  routes.put('/category/:id', async (req: any, res: any) => { await categoryCTRL.update(req, res)} )

  routes.get('/product', async (req: any, res: any) => { await productCTRL.getAll(req, res)} )
  routes.get('/product/:id', async (req: any, res: any) => { await productCTRL.get(req, res)} )
  routes.post('/product', async (req: any, res: any) => { await productCTRL.save(req, res)} )
  routes.put('/product/:id', async (req: any, res: any) => { await productCTRL.update(req, res)} )
  
}

export default () => {
  initApiRoutes();
  return routes
};