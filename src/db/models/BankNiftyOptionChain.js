import mongoose from "mongoose";

const Schema = mongoose.Schema;

// BankNiftySchema
const BankNiftyOptionChainSchema = new Schema({
  identifier: { type: String, required: false },
  expiryDate: { type: String, required: false },
  optionType: { type: String, required: false },
  strikePrice: { type: Number, required: false },
  lastPrice: { type: Number, required: false },
  change: { type: Number, required: false },
  pChange: { type: Number, required: false },
  volume: { type: Number, required: false },
  underlyingValue: { type: Number, required: false },
  openInterest: { type: Number, required: false },
  noOfTrades: { type: String, required: false },
  timestamp: { type: String, required: false },
  createdAt: { type: Date, required: false },
});


const BankNiftyOptionChainModel = mongoose.model('BankNiftyOptionChain', BankNiftyOptionChainSchema);
export default BankNiftyOptionChainModel;



