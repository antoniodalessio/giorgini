import BaseController from "./base.controller";
import { Fabric } from '../models/'


class FabricController extends BaseController {
  
  constructor() {
    super()
    this.model = Fabric
  }
  
  
  async getAll(req: any, res: any) {
    await super.getAll(req, res, '')
  }

  async get(req: any, res: any) {
    await super.get(req, res, '')
  }

}

export default FabricController;