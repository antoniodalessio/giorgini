const nodemailer = require("nodemailer");
const fetch = require('node-fetch');

let transporter = nodemailer.createTransport({
  host: "smtps.aruba.it",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PWD
  }
});


class ContactController {
  
  async sendEmailToInfo(data: any) {

     let info = await transporter.sendMail({
      from: `"${data.name} 👻" <${data.email}>`,
      to: `info@amaliacardo.it`,
      subject: "Richiesta informazioni dal sito amaliacardo.it",
      text: `${data.message}`,
      html: ''
    });

    return info
  }

  async sendEmailToContact(data: any) {
    
    let info = await transporter.sendMail({
      from: `"${data.name}" <info@amaliacardo.it>`,
      to: `${data.email}`,
      subject: "Richiesta informazioni dal sito amaliacardo.it",
      text: `Grazie {nome} per avermi contattato. Risponderò a breve alla tua richiesta: \n ${data.message}\n\n Amalia Cardo`,
      html: ''
    });

    return info

  }
  
  
  async contact(req: any, res: any) {
    
    fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_TOKEN}&response=${req.body['g-recaptcha-response']}`
      })
      .then((result: any) => result.json())
      .then(async (result: any) => {
        
        let sendEmailContactRes;
        let sendEmailInfoRes;

        if (result.success) {
          console.log(req.body, result)
          sendEmailInfoRes = await this.sendEmailToInfo(req.body)
          sendEmailContactRes = await this.sendEmailToContact(req.body)
          res.status(200).json({result, sendEmailContactRes, sendEmailInfoRes});
        }else{
          res.status(406).json({result, sendEmailContactRes, sendEmailInfoRes});
        }
        
      })
      .catch((e:any) => {
        res.status(406).json(e);
      })
  
  }




}

export default ContactController