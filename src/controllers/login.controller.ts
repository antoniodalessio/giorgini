import { User, IUser } from './../models'
var crypto = require('crypto');

class LoginController {
  
  async login(req: any, res: any) {

    const { username, password } = req.body
    const hash = this.toHash(username, password)

    let result:IUser[] = await User.find({ hash })

    if (result.length > 0) {
      let token = this.createRandomToken()
      result[0].token = token;
      await User.updateOne({_id: result[0]._id},result[0])
      res.status(200).json({ token })
    }else{
      res.status(403).json({error: ''})
    }
    
  }

  async checkAuth(req: any, res: any) {
    const token = req.body.token
    let result:IUser[] = await User.find({ token })
    if (result.length > 0) {
      res.status(200).json({message: "User authenticated"})
    }else{
      res.status(403).json({error: ''})
    }
  }

  async logout(req: any, res: any) {
    const token = req.body.token
    let result:IUser[] = await User.find({ token })
    result[0].token = ""
    await User.updateOne({_id: result[0]._id},result[0])
    res.status(200).json({message: "logout"}) 
  }

  toHash(username: string, password: string) {
    return crypto.createHash('sha256').update(`${username}${password}`).digest('base64');
  }

  createRandomToken() {
    return crypto.randomBytes(64).toString('hex');
  }

}

export default LoginController;