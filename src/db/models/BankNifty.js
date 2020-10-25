import mongoose from "mongoose";

const Schema = mongoose.Schema;

// BankNiftySchema
const BankNiftySchema = new Schema({
  openInterest: { type: Number, required: false },
  volume: { type: Number, required: false },
  pChange: { type: Number, required: false },
  change: { type: Number, required: false },
  underlyingValue: { type: Number, required: false },
  lastPrice: { type: Number, required: false },
  timestamp: { type: String, required: false },
  createdAt: { type: Date, required: false },
});


const BankNiftyModel = mongoose.model('BankNifty', BankNiftySchema);
export default BankNiftyModel;


