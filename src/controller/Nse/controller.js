import mongoose from "mongoose";
import moment from "moment";
import { NseService } from "../../service/Nse";
import { NiftyService } from "../../service/Nifty";
import { BankNiftyOptionChainService } from "../../service/BankNiftyOptionChain";
// NiftyService
import axios from "axios";
import { RootRepository } from "../../service/RootRepository";
import {
  BankNiftyOptionChainModel,
  FutureOpenInterestModel,
} from "../../db/models";

const puppeteer = require("puppeteer");
var cron = require("node-cron");

let cookie =
  '_ga=GA1.2.1708496955.1601883681; _gid=GA1.2.21449181.1601883681; ak_bmsc=C38C07040491AC5B467AABC2C7E1D998173F6D04156600004B037C5FC996FF75~plECiYzxC1PTzo2MiFS8PTVVv5MCY69DE4EYAXpr8mQFT7c2Rgth0hUjZcpnf7K6cCbKSniY/bZUOGatYpllmV/vkgIdZsmyJJvJS+Q81TCJyJobYVk23rU2ql1T5py2WOYNSZfTjovPSuHPtLbemX+xrG3SsrP/xhnkd7/OD/RM3olCd79HxT6/8HqMxT35tOKgWZsoKduu1q8s2+KxGcKKkRyOoFIAdyb+hv82f02yk=; nsit=AO2jpoNzpLjHfGr4LqrZtEOv; nseappid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkubnNlIiwiYXVkIjoiYXBpLm5zZSIsImlhdCI6MTYwMTk2NzA2NCwiZXhwIjoxNjAxOTcwNjY0fQ.bRYQJq4L3eXLvLqztuelH9XMrmozgdV_MLB9QkCFkuY; bm_mi=9D4A804C4974E7DFB505040EE994C73C~0JGbuiU6Kv/JBU2yQzdSXwkThBzYmnYnpCBfIg7JyqMuq0mni/fh7AWSAjaQCRzjCKi4Y/rinAMACXkeZVt9DqKGhdNTY1q8fHPrnqESZS7E4T8KqKVwfmjPTuy3ztjiPRloQKCev0KgxtK/A2+UD0OgIhKDAfiHUrokY0axTARsrW6bS8QdyX0AsYWSGQw7VehrZyd5E26h8DqHxICYO6D4j/9adjZCGbiQgCQa9La0INc2atNLsAD0H1kMIkNNETEFYhMSfRhxKjRRXzAeiZCBbUQSlKBuQkeYVblUyVpQTrsrqf1DmEyC00E1Pjbg; RT="sl=0&ss=kfxilmq6&tt=0&z=1&dm=nseindia.com&si=b7c537c1-8452-4681-84ff-78ff633828f3&bcn=%2F%2F684d0d3b.akstat.io%2F"; _gat_UA-143761337-1=1; bm_sv=A90C17771AB5E39C68DA5C44DAC0B32C~PaGg27TsDYO6vn05CwgbAd9nrOA1001KzrGeZTPJRJ3S8GNHe+aVHDIskGFiGqZb/uT29LGA1mgcA9P6IXHUtJ1M5534z2VO3Q0COgFaQeuWE2SF+h/o/bbdQRNCt3fa6Q5a6zSkZQU5VMN4ghoXReIU2UifETZumztQLiStgSc=';

let i = 0;

const getCookie = async () => {
  console.log("CRON JOB START");

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const websiteUrl =
    "https://www.nseindia.com/market-data/most-active-contracts";

  const response = await page.goto(websiteUrl, {
    waitUntil: "networkidle2",
  });

  const headers = response.headers();
  console.log(headers);
  let tempCookie = headers["set-cookie"];
  const spltArray = tempCookie.split(";");
  const newCookie = `${spltArray[0]};${spltArray[4]};`;
  cookie = newCookie.replace(/ SameSite=Lax\n/g, "");
  console.log("CRON JOB END");

  await browser.close();
};

class NseController {
  async getBankNiftyData(req, res) {
    if (i === 0) {
      console.log("CRON FUNCTION CALLED");
      getCookie();
      cron.schedule("*/15 * * * *", getCookie);
    }
    i = i + 1;
    try {
      console.log("************* getBankNiftyData API Called ***************");
      console.log("************* COOKIE *******", cookie);
      const result = await axios.get(
        "https://www.nseindia.com/api/liveEquity-derivatives?index=nifty_bank_fut",
        {
          headers: {
            accept: "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            cookie: cookie,
            mode: "cors",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64)",
            "content-encoding": "gzip",
            "content-type": "application/json",
          },
        }
      );

      const tempObj = {};
      let sum = [];
      let volumeArr = [];
      result.data.data.forEach((item, id) => {
        if (id === 0) {
          tempObj["pChange"] = item.pChange;
          tempObj["lastPrice"] = item.lastPrice;
          tempObj["change"] = item.change;
          tempObj["underlyingValue"] = item.underlyingValue;
        }
        sum.push(item["openInterest"]);
        volumeArr.push(item["noOfTrades"]);
      });
      tempObj["timestamp"] = result.data.timestamp;
      tempObj["createdAt"] = new Date();
      tempObj["openInterest"] = sum.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      );
      tempObj["volume"] = volumeArr.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      );

      const isDupicate = await NseService.findOne({
        timestamp: tempObj.timestamp,
      });
      console.log("isDupicate **************", isDupicate);
      if (!isDupicate) {
        const data = await NseService.create(tempObj);
        return res.status(201).json({ message: "New record created", data });
      }

      return res
        .status(201)
        .json({ message: "tempObj record created", tempObj });

      // var cron = require("node-cron");

      // cron.schedule("*/5 * * * *", () => {
      //   console.log("running a task 5 minutes");
      // });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async getNiftyData(req, res) {
    try {
      console.log("************* getNiftyData API Called ***************");
      const result = await axios.get(
        "https://www.nseindia.com/api/liveEquity-derivatives?index=nse50_fut",
        {
          headers: {
            accept: "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            cookie: cookie,
            mode: "cors",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64)",
            "content-encoding": "gzip",
            "content-type": "application/json",
          },
        }
      );

      const tempObj = {};
      let sum = [];
      let volumeArr = [];
      result.data.data.forEach((item, id) => {
        if (id === 0) {
          tempObj["pChange"] = item.pChange;
          tempObj["lastPrice"] = item.lastPrice;
          tempObj["change"] = item.change;
          tempObj["underlyingValue"] = item.underlyingValue;
        }
        sum.push(item["openInterest"]);
        volumeArr.push(item["noOfTrades"]);
      });
      tempObj["timestamp"] = result.data.timestamp;
      tempObj["createdAt"] = new Date();
      tempObj["openInterest"] = sum.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      );
      tempObj["volume"] = volumeArr.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      );

      const isDupicate = await NiftyService.findOne({
        timestamp: tempObj.timestamp,
      });
      console.log("isDupicate **************", isDupicate);
      if (!isDupicate) {
        const data = await NiftyService.create(tempObj);
        return res.status(201).json({ message: "New record created", data });
      }

      return res
        .status(201)
        .json({ message: "tempObj record created", tempObj });

      // var cron = require("node-cron");

      // cron.schedule("*/5 * * * *", () => {
      //   console.log("running a task 5 minutes");
      // });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async getBankNiftyOptionChainData(req, res) {
    try {
      console.log(
        "************* getBankNiftyOptionChainData API Called ***************"
      );
      const result = await axios.get(
        "https://www.nseindia.com/api/liveEquity-derivatives?index=nifty_bank_opt",
        {
          headers: {
            accept: "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            cookie: cookie,
            mode: "cors",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64)",
            "content-encoding": "gzip",
            "content-type": "application/json",
          },
        }
      );

      const expiryDate = "29-Oct-2020";

      const formattedData = result.data.data.filter((item) => {
        if (item.expiryDate === expiryDate) {
          item["timestamp"] = result.data.timestamp;
          item["createdAt"] = new Date();
          return item;
        }
      });

      const isDupicate = await BankNiftyOptionChainService.findOne({
        timestamp: result.data.timestamp,
      });
      console.log("isDupicate **************", isDupicate);
      if (!isDupicate) {
        const saveData = await RootRepository.insertMany(
          formattedData,
          BankNiftyOptionChainModel
        );
        return res.status(200).json(saveData);
      }

      return res.status(200).json(isDupicate);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async getBankNiftyOptionChainDataByStrikePrice(req, res) {
    try {
      console.log(
        "************* getBankNiftyOptionChainDataByStrikePrice API Called ***************"
      );
      const { strikePrice } = req.params;
      console.log("params", strikePrice);

      const getApiAndEmit = async (socket) => {
        const data = await BankNiftyOptionChainService.find({
          strikePrice: parseInt(strikePrice),
        });
        socket.emit("BankNiftyOptionChain", { bankNiftyOptionChainData: data });
      };

      var socket = req.app.get("socketio");

      let interval;

      if (interval) {
        clearInterval(interval);
      }
      interval = setInterval(() => getApiAndEmit(socket), 1000);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async find(req, res) {
    try {
      const data = await NseService.find();
      return res.status(200).json({ message: "Data fetch successfully", data });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async findById(req, res) {
    const { id } = req.params;
    try {
      const data = await NseService.findById(id);
      return res.status(200).json({ message: "Data fetch successfully", data });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async findLastRecord(req, res) {
    try {
      // const data = await NseService.findLastRecord(10);
      var io = req.app.get("socketio");

      let interval;

      if (interval) {
        clearInterval(interval);
      }
      const getApiAndEmit = async (socket) => {
        try {
          const res = await NseService.findLastRecord(10);
          socket.emit("FromAPI", res);
        } catch (error) {
          console.error(`Error: ${error.code}`);
        }
      };

      interval = setInterval(() => getApiAndEmit(io), 1000);
      return res.status(200).json({ message: "Data fetch successfully" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
  // future-stock-open-interest

  async futureStockOpenInterest(req, res) {
    try {
      const result = await axios.get(
        "https://www.bloombergquint.com/feapi/markets/options/open-interest?type=break-up&expiry=current&limit=200"
      );

      console.log("result **************", result);

      // const isDupicate = await FutureOpenInterestModel.result({
      //   ["broadcasted-at"]: result.data["broadcasted-at"],
      // });

      // console.log("isDupicate **************", isDupicate);
      // if (isDupicate) {
      //   return res.status(201).json({ message: "Duplicate record found", isDupicate });
      // }

      const newFormattedData = result.data["open-interest"].map((record) => {
        const pcrOI = (
          record["put-open-interest"] / record["call-open-interest"]
        ).toFixed(2);

        return {
          ...record,
          ["pcr-oi"]: Number(pcrOI) || 0,
          createdAt: new Date(),
          ["broadcasted-at"]: result["broadcasted-at"],
        };
      });

      const saveData = await RootRepository.insertMany(
        newFormattedData,
        FutureOpenInterestModel
      );

      if (!saveData) {
        return res
          .status(200)
          .json({ message: "something went wrong in data seeding" });
      }

      if (saveData) {
        console.log("********** Data seeded successfully *************");
        return res.status(200).json({ message: "Data seeded successfully" });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async getFutureStockOpenInterest(req, res) {
    try {
      const { stockName = "ACC" } = req.params;
      const result = await FutureOpenInterestModel.find({ symbol: stockName })
        .sort({
          createdAt: 1,
        })
        .limit(30);

      if (!result) {
        return res
          .status(200)
          .json({ message: "something went wrong in getting data" });
      }

      if (result) {
        console.log("********** Data Fetched successfully *************");
        return res.status(200).json(result);
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async TestNewFunction(req, res) {
    try {
      const { stockName = "ACC" } = req.params;
      const result = await FutureOpenInterestModel.find({ symbol: stockName })
        .sort({
          createdAt: -1,
        })
        .limit(2);

      const sortedArray = result.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      let filterBY = "";

      const res1 = sortedArray.reduce((acc, curr, idx) => {
        if (acc === undefined || acc === false) {
          return false;
        }

        if (idx === 0) {
          return curr;
        }

        if (idx > 0) {
          if (acc["spot-price"] > curr["spot-price"]) {
            if (acc["future-open-interest"] < curr["future-open-interest"]) {
              //acc-->prev day spot price > current day spot price (SELL)
              //acc-->prev day open-interest < current day open-interest (SELL)

              return curr;
            }
          } else {
            return false;
          }
        }
      }, {});

      const res2 = sortedArray.reduce((acc, curr, idx) => {
        if (acc === undefined || acc === false) {
          return false;
        }

        if (idx === 0) {
          return curr;
        }

        if (idx > 0) {
          //acc-->prev day spot price < current day spot price (BUY)
          //acc-->prev day open-interest < current day open-interest (BUY)
          if (acc["spot-price"] < curr["spot-price"]) {
            if (acc["future-open-interest"] < curr["future-open-interest"]) {
              return curr;
            }
          } else {
            return false;
          }
        }
      }, {});

      filterBY = res1
        ? "(SHORT BUILDUP) (SHORT) PRICE DECREASE AND OPEN INTEREST INCREASE"
        : res2
        ? "(LONG BUILDUP) (BUY) PRICE INCREASE AND OPEN INTEREST INCREASE"
        : "";

      if (!result) {
        return res
          .status(200)
          .json({ message: "something went wrong in getting data" });
      }

      if (result) {
        console.log("********** Data Fetched successfully *************");
        return res.status(200).json({
          filterBY: filterBY,
        });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async getFutureStockList(req, res) {
    // new Date(2020, 9, 16)
    var start = new Date(2020, 9, 16);
    start.setHours(0, 0, 0, 0);
    var end = new Date(2020, 9, 16);
    end.setHours(23, 59, 59, 999);

    try {
      const { filterCriteria = "maxOpenInterest" } = req.params;
      if (filterCriteria === "maxOpenInterest") {
        console.log("********** maxOpenInterest called *************");
        const result = await FutureOpenInterestModel.find({
          createdAt: { $gte: start.toISOString(), $lt: end.toISOString() },
        }).sort({
          ["future-open-interest"]: -1,
        });
        return res.status(200).json(result);
      } else if (filterCriteria === "pcrLessThan") {
        console.log("********** pcrLessThan called *************");

        const result = await FutureOpenInterestModel.find({
          ["pcr-oi"]: { $ne: 0 },
          ["pcr-oi"]: { $gt: 0.0, $lt: 0.5 },
          ["future-open-interest"]: { $gt: 0 },
          createdAt: { $gte: start.toISOString(), $lt: end.toISOString() },
        }).sort({ ["pcr-oi"]: -1 });

        return res.status(200).json(result);
      } else if (filterCriteria === "pcrMoreThan") {
        console.log("********** pcrMoreThan called *************");
        const result = await FutureOpenInterestModel.find({
          ["pcr-oi"]: { $ne: 0 },
          ["pcr-oi"]: { $gt: 1.2 },
          createdAt: { $gte: start.toISOString(), $lt: end.toISOString() },
        }).sort({ ["pcr-oi"]: -1 });

        return res.status(200).json(result);
      } else if (filterCriteria === "maxPCR") {
        console.log("********** maxPCR called *************");
        const result = await FutureOpenInterestModel.find({
          createdAt: { $gte: start.toISOString(), $lt: end.toISOString() },
        }).sort({ ["pcr-oi"]: -1 });

        return res.status(200).json(result);
      } else if (filterCriteria === "maxOICALL") {
        console.log("********** maxPCR called *************");
        const result = await FutureOpenInterestModel.find({
          createdAt: { $gte: start.toISOString(), $lt: end.toISOString() },
        }).sort({ ["call-open-interest"]: -1 });

        return res.status(200).json(result);
      } else if (filterCriteria === "maxOIPUT") {
        console.log("********** maxPCR called *************");
        const result = await FutureOpenInterestModel.find({
          createdAt: { $gte: start.toISOString(), $lt: end.toISOString() },
        }).sort({ ["put-open-interest"]: -1 });

        return res.status(200).json(result);
      }
      // db.getCollection('futureopeninterests').find({}).sort({["future-open-interest"] : -1})
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
}

export default new NseController();
