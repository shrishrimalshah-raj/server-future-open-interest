import mongoose from "mongoose";

const Schema = mongoose.Schema;

// {

  


// }

// BankNiftySchema
const FutureOpenInterestSchema = new Schema({
  "symbol-strike": { type: String, required: false },
  "spot-price": { type: Number, required: false },
  "call-open-interest": { type: Number, required: false },
  "call-open-interest-change": { type: Number, required: false },
  "call-open-interest-change-percentage": { type: Number, required: false },
  "put-open-interest": { type: Number, required: false },
  "put-open-interest-change": { type: Number, required: false },
  "put-open-interest-change-percentage": { type: Number, required: false },
  "future-open-interest": { type: Number, required: false },
  "future-open-interest-change": { type: Number, required: false },
  "future-open-interest-change-percentage": { type: Number, required: false },
  "total-open-interest": { type: Number, required: false },
  "total-open-interest-change": { type: Number, required: false },
  "total-open-interest-change-percentage": { type: Number, required: false },
  "1m-open-interest-change": { type: Number, required: false },
  "1m-open-interest-change-percentage": { type: Number, required: false },
  "rollover": { type: Number, required: false },
  "rollover-percentage": { type: Number, required: false },
  "turnover": { type: Number, required: false },
  "notional-turnover": { type: Number, required: false },
  "premium-turnover": { type: Number, required: false },
  "pcr-open-interest-current": { type: Number, required: false },
  "pcr-open-interest-previous": { type: Number, required: false },
  "pcr-open-interest-change": { type: Number, required: false },
  "pcr-volume-current": { type: Number, required: false },
  "pcr-volume-previous": { type: Number, required: false },
  "pcr-volume-change": { type: Number, required: false },
  "symbol": { type: String, required: false },
  "pcr-oi": { type: Number, required: false },
   createdAt: { type: Date, required: false },
   "broadcasted-at": { type: String, required: false },
});

const FutureOpenInterestModel = mongoose.model(
  "FutureOpenInterest",
  FutureOpenInterestSchema
);
export default FutureOpenInterestModel;
