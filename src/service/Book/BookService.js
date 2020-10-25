import { RootRepository } from '../RootRepository';
import { BookModel } from '../../db/models'

class BookService extends RootRepository {
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

}

export default new BookService(BookModel);
