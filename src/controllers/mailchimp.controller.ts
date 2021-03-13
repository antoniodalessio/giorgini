var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(process.env.MAILCHIMP_TOKEN);


class MailchimpController {
  constructor() {

  }
  async init() {

  }

  async saveEmailAddress(email_address: string) {

    console.log(email_address)
    
    try {
      const useregistered = await mailchimp.post(`/lists/${process.env.MAILCHIMP_LIST}/members`, {
        email_address : email_address,
        status : 'subscribed'
      })

      console.log("useregistered", useregistered)

      if (useregistered.id) {
        return true
      }else{
        return false
      }
    }catch(e) {
      console.log(e)
      return false
    }
  }

  async saveEmailAddressPost(req: any, res: any) {
    let response = await this.saveEmailAddress(req.body.email)
    try {
      if (response) {
        res.status(200).json({result: response});
      }else{
        res.status(406).json({result: response});
      }
    }catch(e) {
      res.status(406).json(e);
    }
  }

}


export default MailchimpController