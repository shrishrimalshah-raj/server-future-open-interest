import mongoose from "mongoose";

const Schema = mongoose.Schema;

// FILE
const BookSchema = new Schema({
  name: { type: String, required: false },
  type: { type: String, required: false },
});


const BookModel = mongoose.model('Book', BookSchema);
export default BookModel;


