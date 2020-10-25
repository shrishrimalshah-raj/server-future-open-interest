import express from 'express';

import BookController from './controller';

const router = express.Router()

// health check
router.get('/health', (req, res) => res.send({message: "Book API Working"}))

// findById
router.get('/:id', BookController.findById)

// insert new data
router.post('/create', BookController.create)

// get all data
router.get('/', BookController.find)


export default router;
