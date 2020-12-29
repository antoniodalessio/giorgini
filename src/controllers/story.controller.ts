import BaseController from './base.controller'
import { Story, Image } from '../models'


class StoryController extends BaseController{
  
  constructor() {
    super()
    this.model = Story
  }

  async getAll(req: any, res: any) {
    await super.getAll(req, res, 'images')
  }

  async get(req: any, res: any) {
    await super.get(req, res, 'images')
  }

}

export default StoryController;