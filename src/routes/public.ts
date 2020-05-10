const routes = require('express').Router();
import ContactController from '../controllers/contact.controller'

function initPublicRoutes() {

    const contactCTRL: ContactController = new ContactController()

    routes.post('/contact', async (req: any, res: any) => { await contactCTRL.contact(req, res)} )
}

export default () => {
    initPublicRoutes();
    return routes
  };