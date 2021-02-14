const routes = require('express').Router();
import userController from '../controllers/user.controller'
import pageController from '../controllers/page.controller'
import storyController from '../controllers/story.controller'
import builderController from '../controllers/builder.controller'
import imageController from '../controllers/image.controller'
import serviceController from '../controllers/service.controller'
import collaboratorController from '../controllers/collaborator.controllerr'

function initApiRoutes() {

  let userCTRL = new userController()
  let pageCTRL = new pageController()
  let builderCTRL = new builderController()
  let imageCTRL = new imageController()
  let storyCTRL = new storyController()
  let serviceCTRL = new serviceController()
  let collaboratorCTRL = new collaboratorController()
  

  routes.use((req: any, res: any, next: any) => verifyToken(req, res, next))

  createDefaultRoutes("user", userCTRL)
  createDefaultRoutes("page", pageCTRL)
  createDefaultRoutes("story", storyCTRL)
  createDefaultRoutes("service", serviceCTRL)
  createDefaultRoutes("collaborator", collaboratorCTRL)
  createDefaultRoutes("image", imageCTRL)

  
  routes.get('/publish', async (req: any, res: any) => { await builderCTRL.publish(req, res)} )
  
}

function createDefaultRoutes(route: String, controller: any) {
  routes.get(`/${route}`, async (req: any, res: any) => { await controller.getAll(req, res)} )
  routes.get(`/${route}/:id`, async (req: any, res: any) => { await controller.get(req, res)} )
  routes.post(`/${route}`, async (req: any, res: any) => { await controller.create(req, res)} )
  routes.put(`/${route}/:id`, async (req: any, res: any) => { await controller.update(req, res)} )
  routes.delete(`/${route}/:id`, async (req: any, res: any) => { await controller.delete(req, res)} )
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