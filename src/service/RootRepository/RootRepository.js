import mongoose from "mongoose";

class RootRepository {
  constructor(model) {
    this._model = model;
  }

  static insertMany(records, model) {
    this._model = model;
    return this._model.insertMany(records);
  }

  findLastRecord(cond, limit) {
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);

    let condition = {
      createdAt: { $gte: start.toISOString(), $lt: end.toISOString() },
    };
    // console.log('condition ****', condition)
    // db.findDataByDateDemo.count({"UserLoginDate":{ "$gte": new Date("2019-05-02"), "$lt": new Date("2019-05-18") }});

    // {"createdAt":{ "$gte": new Date("2020-09-30")}}
    return this._model
      .find({
        createdAt: { $gte: start.toISOString(), $lt: end.toISOString() },
      })
      .sort(cond);
    // .limit(limit);
  }

  countDocuments() {
    return this._model.countDocuments({});
  }

  create(item) {
    return this._model.create(item);
  }

  findAll() {
    return this._model.find({});
  }

  update(_id, item) {
    console.log(this.toObjectId(_id));
    return this._model.update({ _id: this.toObjectId(_id) }, item, {
      upsert: true,
    });
  }

  delete(_id) {
    return this._model.remove({ _id: this.toObjectId(_id) });
  }

  deleteMany() {
    return this._model.deleteMany({});
  }

  findById(_id) {
    return this._model.findById(_id);
  }

  findOne(cond) {
    return this._model.findOne(cond);
  }

  find(cond, fields, options) {
    // var start = new Date("2015-03-25");
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);

    return this._model
      .find(
        {
          createdAt: { $gte: start.toISOString(), $lt: end.toISOString() },
          strikePrice: cond.strikePrice,
        },
        fields,
        options
      )
      .sort({ timestamp: 1 });
  }

  findByDate(cond, fields, options) {
    return this._model.find(cond, options);
  }

  toObjectId(_id) {
    return mongoose.Types.ObjectId.createFromHexString(_id);
  }
}

export default RootRepository;
