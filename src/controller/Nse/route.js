import express from "express";

import NseController from "./controller";

const router = express.Router();

// health check
router.get("/health", (req, res) => res.send({ message: "Nse API Working" }));

// bankniftyGet
router.get("/banknifty", NseController.getBankNiftyData);

// niftyGet
router.get("/nifty", NseController.getNiftyData);

// bankNiftyOptionChain
router.get("/bankniftyOptionChain", NseController.getBankNiftyOptionChainData);

// bankNiftyOptionChain
router.get(
  "/bankniftyOptionChain/:strikePrice",
  NseController.getBankNiftyOptionChainDataByStrikePrice
);

// insert new data
router.get("/recent-banknifty-records", NseController.findLastRecord);

// seed-future-stock-open-interest
router.get(
  "/seed-future-stock-open-interest",
  NseController.futureStockOpenInterest
);

// get-future-stock-list
router.get(
  "/future-stock-list/:filterCriteria",
  NseController.getFutureStockList
);

// get-future-stock-open-interest
router.get(
  "/get-future-stock-open-interest/:stockName",
  NseController.getFutureStockOpenInterest
);

router.get(
  "/test/:stockName",
  NseController.TestNewFunction
);

// get all data
router.get("/", NseController.find);

export default router;
