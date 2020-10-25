import { RootRepository } from '../RootRepository';
import { BankNiftyModel } from '../../db/models'

class NseService extends RootRepository {
  constructor(model) {
    super(model)
  }

  async find() {
    const result = await super.find();
    return result;
  }
  
  async create(item) {
    const result = await super.create(item);
    return result;
  }

  async findById(_id) {
    const result = await super.findById(_id);
    return result;
  }

  async find() {
    const result = await super.find();
    return result;
  }

  async findLastRecord(limit) {
    const result = await super.findLastRecord({timestamp: -1}, limit);
    return result.sort(function(a,b){
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
  }

}

export default new NseService(BankNiftyModel);
