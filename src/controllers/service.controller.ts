import BaseController from './base.controller'
import { Service, Image } from '../models'


class ServiceController extends BaseController{

  
  constructor() {
    super()
    this.model = Service
  }

}

export default ServiceController;