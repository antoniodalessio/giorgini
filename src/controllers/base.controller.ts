import { Model } from 'mongoose';


class BaseController {
  
  protected model:any;

  isEmpty(obj: any) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
  
  async getAll(req: any, res: any, populate: string) {
      try {

        let limit = 0

        let filter = {}
        let sort = {}
        let range = []

        if (req.query.hasOwnProperty('filter')){
          filter = JSON.parse(req.query.filter)
        }
        
        if (req.query.hasOwnProperty('range')) {
          range = JSON.parse(req.query.range)
        }

        if (req.query.hasOwnProperty('sort')) {
          const sortTmp = JSON.parse(req.query.sort)
          sortTmp[1] == 'ASC' ? sort = `${sortTmp[0]}` : sort = `-${sortTmp[0]}`
        }

        const all = await this.model.find(filter)

        limit = range[1] - range[0] + 1

        const data = await this.model.find(filter).sort(sort).skip(range[0]).limit(limit).populate(populate)
        res.header('Content-Range' , all.length );
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

    async delete(req: any, res: any) {
      const id = req.params.id
      this.model.deleteOne({ _id:  id}, function (err: any) {
        if (err) {
          console.log(err)
          return
        }
      });
    }
}

export default BaseController;