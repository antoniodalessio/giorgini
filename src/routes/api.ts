const routes = require('express').Router();
import userController from '../controllers/user.controller'
import pageController from '../controllers/page.controller'
import storyController from '../controllers/story.controller'
import builderController from '../controllers/builder.controller'
import imageController from '../controllers/image.controller'
import serviceController from '../controllers/service.controller'

function initApiRoutes() {

  let userCTRL = new userController()
  let pageCTRL = new pageController()
  let builderCTRL = new builderController()
  let imageCTRL = new imageController()
  let storyCTRL = new storyController()
  let serviceCTRL = new serviceController()
  

  routes.use((req: any, res: any, next: any) => verifyToken(req, res, next))

  routes.get('/user', async (req: any, res: any) => { await userCTRL.getAll(req, res)} )
  routes.get('/user/:id', async (req: any, res: any) => { await userCTRL.get(req, res)} )
  routes.post('/user', async (req: any, res: any) => { await userCTRL.create(req, res)} )
  routes.put('/user/:id', async (req: any, res: any) => { await userCTRL.update(req, res)} )
  routes.delete('/user/:id', async (req: any, res: any) => { await userCTRL.delete(req, res)} )

  routes.get('/page', async (req: any, res: any) => { await pageCTRL.getAll(req, res)} )
  routes.get('/page/:id', async (req: any, res: any) => { await pageCTRL.get(req, res)} )
  routes.post('/page', async (req: any, res: any) => { await pageCTRL.create(req, res)} )
  routes.put('/page/:id', async (req: any, res: any) => { await pageCTRL.update(req, res)} )
  routes.delete('/page/:id', async (req: any, res: any) => { await pageCTRL.delete(req, res)} )

  routes.get('/story', async (req: any, res: any) => { await storyCTRL.getAll(req, res)} )
  routes.get('/story/:id', async (req: any, res: any) => { await storyCTRL.get(req, res)} )
  routes.post('/story', async (req: any, res: any) => { await storyCTRL.create(req, res)} )
  routes.put('/story/:id', async (req: any, res: any) => { await storyCTRL.update(req, res)} )
  routes.delete('/story/:id', async (req: any, res: any) => { await storyCTRL.delete(req, res)} )

  routes.get('/service', async (req: any, res: any) => { await serviceCTRL.getAll(req, res)} )
  routes.get('/service/:id', async (req: any, res: any) => { await serviceCTRL.get(req, res)} )
  routes.post('/service', async (req: any, res: any) => { await serviceCTRL.create(req, res)} )
  routes.put('/service/:id', async (req: any, res: any) => { await serviceCTRL.update(req, res)} )
  routes.delete('/service/:id', async (req: any, res: any) => { await serviceCTRL.delete(req, res)} )

  routes.get('/image', async (req: any, res: any) => { await imageCTRL.getAll(req, res)} )
  routes.get('/image/:id', async (req: any, res: any) => { await imageCTRL.get(req, res)} )
  routes.post('/image', async (req: any, res: any) => { await imageCTRL.create(req, res)} )
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