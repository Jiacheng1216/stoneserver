const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();
// mongodb://localhost:27017/stoneDB

mongoose
  .connect(
    "mongodb+srv://ah88121601:hs90842995@shiningstonecluster.jh1t7d1.mongodb.net/?retryWrites=true&w=majority&appName=ShiningStoneCluster"
  )
  .then(() => {
    console.log("Connected to stoneDB");
  })
  .catch((e) => {
    console.log(e);
  });

// === Middleware 設定 ===
//當發送images的路由時,會導向uploads資料夾
app.use("/images", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// === Health Check 路由 ===
app.get("/health", (req, res) => {
  console.log('五分鐘檢查一次health')
  res.status(200).send("OK");
});

// === 掛載 API 路由 ===
app.use("/api/item", require("./routes/item-route"));

// === 啟動伺服器 ===
app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running on port 8080");
});
