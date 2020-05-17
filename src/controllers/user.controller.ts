import BaseController from "./base.controller";
import { User } from '../models/'


class UserController extends BaseController {
  
  constructor() {
    super()
    this.model = User
  }
  
}

export default UserController;