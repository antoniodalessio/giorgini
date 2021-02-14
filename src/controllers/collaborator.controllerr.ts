import BaseController from './base.controller'
import { Collaborator } from '../models'


class CollaboratorController extends BaseController{
  
  constructor() {
    super()
    this.model = Collaborator
  }

  async getAll(req: any, res: any) {
    await super.getAll(req, res, 'images')
  }

  async get(req: any, res: any) {
    await super.get(req, res, 'images')
  }

}

export default CollaboratorController;