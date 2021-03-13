const routes = require('express').Router();
import ContactController from '../controllers/contact.controller'
import MailchimpController from '../controllers/Mailchimp.controller'

function initPublicRoutes() {

    const mailchimpCtrl: MailchimpController = new MailchimpController()
    routes.post('/emailsubscribe', async (req: any, res: any) => { await mailchimpCtrl.saveEmailAddressPost(req, res)} )
}

export default () => {
    initPublicRoutes();
    return routes
  };