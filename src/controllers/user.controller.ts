import BaseController from "./base.controller";
import { User } from '../models/'
import { Types } from 'mongoose';
import { toHash } from '../utils/utils'


class UserController extends BaseController {
  
  constructor() {
    super()
    this.model = User
  }

  async create(req: any, res: any) {
    try{
      const data = await this.model.find({username: req.body.username})
      if (data.length != 0) {
        res.status(500).json({error: `resource with a '${req.body.username}' slug already exists`})
        return;
      }

      req.body._id = new Types.ObjectId()
      const { username, password } = req.body
      req.body.hash = toHash(username, password)
      let user = new User(req.body)

      const result = await user.save()
      res.status(200).json({data: result});

    }catch(e){
      res.status(500).json(e)
    }
  }

  async update(req: any, res: any) {

    try {
      const id = req.params.id
      let data: any = await this.model.find({_id: id})
      
      if (data.length == 0) {
        res.status(500).json({error: `resource with '${id}' doesn't exists`})
        return;
      }

      const { username, password } = req.body
      req.body.hash = toHash(username, password)

      const result = await this.model.updateOne({ _id: id }, req.body)
      res.status(200).json({data: result});
    }catch(e) {
      res.status(500).json(e)
    }
  }
  
}

export default UserController;