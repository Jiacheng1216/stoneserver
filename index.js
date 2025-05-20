const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// 建議加上這行，讓 req.ip 能正確取得原始 IP（如果有反向代理）
app.set("trust proxy", true);

// === 連接 MongoDB ===
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

// 當請求 /images 路由時，對應到 uploads 資料夾中的靜態檔案
app.use("/images", express.static("uploads"));

// 解析 JSON 與 URL 編碼的請求資料
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 啟用 CORS（允許所有來源）
app.use(cors({ origin: "*" }));

// Middleware：顯示每次請求的 IP
app.use((req, res, next) => {
  const xForwardedFor = req.headers["x-forwarded-for"];
  const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : req.ip;
  console.log(`🟢 收到請求，來源IP：${ip}`);
  next();
});

// 設定 CORS header（強制允許跨來源）
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// === Health Check 路由 ===
app.get("/health", (req, res) => {
  console.log("五分鐘檢查一次 health");
  res.status(200).send("OK");
});

// === 掛載 API 路由 ===
app.use("/api/item", require("./routes/item-route"));

// === 啟動伺服器 ===
app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running on port 8080");
});
