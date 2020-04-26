import { Model } from 'mongoose';

class BaseController {
  
  protected model:any; 
  
  async getAll(req: any, res: any, populate: string) {
      try { 
        const data = await this.model.find().populate(populate)
        res.header('Content-Range' , '2' );
        res.status(200).json(data);
      }catch(e) {
        res.status(500).json(e);
      }
    }

    async get(req: any, res: any, populate: string) {
      try {
        const id = req.params.id
        const data = await this.model.findOne({_id: id}).populate(populate)
        res.status(200).json(data);
      }catch(e) {
        res.status(500).json(e);
      }
    }
}

export default BaseController;