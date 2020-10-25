import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import fetch from "node-fetch";
import axios from "axios";
const http = require("http");
const socketIo = require("socket.io");

import routes from "./controller";
import { NseService } from "./service/Nse";
import { NiftyService } from "./service/Nifty";
import { BankNiftyOptionChainService } from "./service/BankNiftyOptionChain";
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // < Interesting
app.set("socketio", io);

app.use(cors()); // We're telling express to use CORS
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// morgan
app.use(morgan("tiny"));

app.use("/api", routes);

// app.get("/stock", async (req, res) => {
//   const url =
//     "https://www.bloombergquint.com/feapi/markets/options/put-call-ratio?security-type=index&limit=200";

//   const response = await axios.get(url, {
//     headers: {
//       "X-Requested-With": "XMLHttpRequest",
//       contentType: "application/json",
//     },
//   });

//   console.log("DATA *****", response.data);
//   res.send(response.data);
// });

// app.get("/nse-india", async (req, res) => {
//   const response = await axios.get(
//     "https://www.nseindia.com/api/liveEquity-derivatives?index=nifty_bank_fut",
//     {
//       headers: {
//         accept: "*/*",
//         "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
//         "sec-fetch-dest": "empty",
//         "sec-fetch-mode": "cors",
//         "sec-fetch-site": "same-origin",
//         cookie:
//           '_ga=GA1.2.2006193904.1593869534; _gid=GA1.2.1724336317.1601487080; bm_mi=A4238A608B7BEBA8C6F4D533B318AB50~bG/mJ1FUuif0RV4orQ51MPfNSV7lx4gUtQ1/PgYUWVKhSUK02rxxf0MImxrEh3Hm1a3QC/6vHiBve0LKiFUPA9MSDcN9nKddalQQmS+9Eiy4hr9HE8hMbth6aKaYQmd8imy0L7QyPExb+wHQ44DkNWHbvdhGDpeppop+6dWM8eTqSoUlfRyd3RvwGm3N7pqWV7LwxpvgWCFKJnxySQ4F21lEF6x+Hc/s/Ubmn/OT4El1SyvFG+P3wyKUMAd9dZ1/5QJvWwR52VCLTIr7jhx/tDDsGGoeNK/I3ojBs5nZ1L7sXZmyrMsfuNhHoli4IopkNMB86N2T60nmcdR3e2gxdg==; ak_bmsc=0A65E9193900E075D43299338D4C1DA2173F6D048B650000CB69755F25259938~pl7GDkNDEPEQGdTKb1PphdIx0Ndjc3YAZtxuunplf53TRptnijN8BR4jJOQvMGle6+8MiwVg6OkTLgP0dCqrSNToNU48+fGkRi5PF9isU4HDhuIeAhVpDXpEwpi+c745XjvELQKouRMKbVx86F3lcclubXf8X+spk3frfjj4XVQebbahs6mGVVcKS/O1W7FqQxzM/BGkDqGI2Ola2o9FuMObEY3l7Oi/M1hmH6VTjrNnJxm/A3gnzx1z+IomuOXC4u; nsit=4_lPgBG3ATtfhL-SXCoc-7O6; _gat_UA-143761337-1=1; nseappid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkubnNlIiwiYXVkIjoiYXBpLm5zZSIsImlhdCI6MTYwMTUzMDk3NCwiZXhwIjoxNjAxNTM0NTc0fQ.5IXGHjFifMkzOdc_YpTvIGX1-rgcL-xwyW6j4A5z-28; RT="z=1&dm=nseindia.com&si=b7c537c1-8452-4681-84ff-78ff633828f3&ss=kfqd8zkd&sl=2&tt=4cf&bcn=%2F%2F684d0d38.akstat.io%2F"; bm_sv=F987B3E5F59D55C8681BC7B4D65F9D33~ZP9XtgWqTIZ25LE7MTOHcMrsr2+lnWwgUrbMMHD9BAwN/854O/UIwBEfADbLCiQRJ6d7S6zPX5EeH28d2lFxpG9BbQ9ywXfB8LeG7pnMgwwZeai5eexh/dnHQOQeNMnescQ8Yg5A9E3JlSvnNQGF9K3GNPBKj7TJAniSgn5cNaw=',
//         mode: "cors",
//         "user-agent": "Mozilla/5.0 (X11; Linux x86_64)",
//         "content-encoding": "gzip",
//         "content-type": "application/json"
//       },
//     }
//   );

//   console.log("DATA *****", response.data);
//   res.send(response.data);
// });

app.get("/", (req, res) => {
  res.send("Hello Babel");
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const getApiAndEmit = async (socket, strikePrice) => {
  try {
    const bankNiftyData = await NseService.findLastRecord(200);
    const niftyData = await NiftyService.findLastRecord(200);
    const bankNiftyOptionChainData = await BankNiftyOptionChainService.find({
      strikePrice: parseInt(strikePrice),
    });
  
    const newData = await BankNiftyOptionChainService.findLastRecordByCreatedAt();
    const underlyingValue = Math.ceil(newData.underlyingValue / 100) * 100;

    const strikePricesArray = () => {
      const tempArray = [];
      for (let i = 1; i <= 8; i++) {
        if (i <= 4) {
          const roundedNumber = underlyingValue - i * 100;
          const value = Math.ceil(roundedNumber / 100) * 100;
          tempArray.push(value);
        }
        if (i === 4) {
          tempArray.push(underlyingValue);
        }
        if (i > 4) {
          const roundedNumber = underlyingValue + (i - 4) * 100;
          const value = Math.ceil(roundedNumber / 100) * 100;
          tempArray.push(value);
        }
      }

      return tempArray;
    };

    const strikeArray = strikePricesArray().sort();
    const allStrikePricesData = [];

    const forLoop = async (_) => {
      console.log("Start");

      for (let index = 0; index < strikeArray.length; index++) {
        const num = strikeArray[index];
        const data = await BankNiftyOptionChainService.find({
          strikePrice: num,
        });
        allStrikePricesData.push(data);
      }

      console.log("End");
    };

    await forLoop();
    console.log("strikeArray *****", strikeArray);
    // console.log("allStrikePricesData *****", allStrikePricesData[0]);
    const data = { bankNiftyData, niftyData, bankNiftyOptionChainData, allStrikePricesData };

    socket.emit("FromAPI", data);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

let interval;
io.on("connection", (socket) => {
  console.log("New client connected");
  let strikePrice = socket.handshake.query["strikePrice"] || "22000";

  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket, strikePrice), 10000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

export default server;
