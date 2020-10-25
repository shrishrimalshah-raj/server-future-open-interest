import express from "express";

import { BookRouter } from "./Book";
import { NseRouter } from "./Nse";
const router = express.Router();

// BOOK ROUTES
router.use("/book", BookRouter);
router.use("/nse", NseRouter);

export default router;
