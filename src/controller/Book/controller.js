import mongoose from 'mongoose';
import moment from 'moment';
import { BookService } from "../../service/Book";

class BookController {

  async find(req, res) {
    try {
      const data = await BookService.find()
      return res.status(200).json({ message: "Data fetch successfully", data })
    } catch (error) {
      return res.status(500).json({ "error": error })
    }
  }
  
  async findById(req, res) {
    const { id } = req.params;
    try {
      const data = await BookService.findById(id)
      return res.status(200).json({ message: "Data fetch successfully", data })
    } catch (error) {
      return res.status(500).json({ "error": error })
    }
  }

  async create(req, res) {
    const { name } = req.body;
    const newObject = {
      name,
    };
    
    try {
      const data = await BookService.create(newObject)
      return res.status(201).json({ message: "New record created", data });

    } catch (error) {
      return res.status(500).json({ "error": error })
    }
  }
}

export default new BookController();