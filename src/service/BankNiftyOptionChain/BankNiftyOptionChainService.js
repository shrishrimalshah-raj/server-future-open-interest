import { RootRepository } from "../RootRepository";
import { BankNiftyOptionChainModel } from "../../db/models";

class BankNiftyOptionChainService extends RootRepository {
  constructor(model) {
    super(model);
  }

  async find(cond) {
    const result = await super.find(cond);
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

  async findLastRecord(limit) {
    const result = await super.findLastRecord({ timestamp: -1 }, limit);
    return result.sort(function (a, b) {
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
  }

  async findLastRecordByCreatedAt() {
    // var start = new Date("2015-03-25");
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);

    // return this._model
    //   .find(
    //     {
    //       createdAt: { $gte: start.toISOString(), $lt: end.toISOString() },
    //       strikePrice: cond.strikePrice,
    //     },
    //     fields,
    //     options
    //   )
    //   .sort({ timestamp: 1 });

    const result = await BankNiftyOptionChainModel.find()
      .sort({ createdAt: -1 })
      .limit(1);

    return result[0];
  }
}

export default new BankNiftyOptionChainService(BankNiftyOptionChainModel);
