import BaseController from './base.controller'
import { Service, Image } from '../models'


class ServiceController extends BaseController{

  constructor() {
    super()
    this.model = Service
  }

  async getAll(req: any, res: any) {
    await super.getAll(req, res, 'images')
  }

  async get(req: any, res: any) {
    await super.get(req, res, 'images')
  }

}

export default ServiceController;