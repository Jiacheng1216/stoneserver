const router = require("express").Router();
// const ItemValidation = require("../validation").itemValidation;
// const multer = require("multer");
// const path = require("path");
const itemModels = require("../models/item-models");
const { upload } = require("../utils/cloudinary");
const { v2: cloudinary } = require("cloudinary");

router.use((req, res, next) => {
  // console.log("正在接收一個跟石頭有關的請求...");
  next();
});

// //接收前端上傳的圖片
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "..", "uploads"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const fileFilter = (req, file, callback) => {
//   // 解决中文名乱码的问题 latin1 是一种编码格式
//   file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
//   callback(null, true);
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter });

//上傳圖片的router(沒在用)
router.post("/postPhoto", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("沒有上傳圖片");
    }

    // 傳回 Cloudinary 上的圖片網址
    res.send({
      msg: "圖片上傳成功",
      imagePath: req.file.path, // Cloudinary 圖片網址
      imagePublicId: req.file.filename,
      fileName: req.file.originalname,
    });
  } catch (e) {
    return res.send(500).send("無法上傳圖片");
  }
});

//刊登商品的router(沒在用)
router.post("/", async (req, res) => {
  //確認資料是否符合規範
  // let { error } = ItemValidation(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  try {
    let {
      color,
      height,
      width,
      imagePath,
      imagePublicId,
      isPaper,
      firstLastNumbers,
      fileName,
    } = req.body;
    let postItem = new itemModels({
      color,
      height,
      width,
      imagePath,
      imagePublicId,
      isPaper,
      firstLastNumbers,
      fileName,
    });

    let savedItem = await postItem.save();

    console.log(`收到了上傳${color}石頭的請求...`);
    return res.send({
      msg: "成功刊登商品",
      savedItem,
    });
  } catch (e) {
    return res.status(500).send("無法儲存刊登的商品...");
  }
});

// 批量刪除的route
router.delete("/delete", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send("請提供要刪除的商品");
    }

    console.log(`收到了刪除 ${ids.length} 張圖片的請求...`);

    const results = await Promise.all(
      ids.map(async (id) => {
        const deleteItem = await itemModels.findByIdAndDelete(id);
        if (deleteItem?.imagePublicId) {
          await cloudinary.uploader.destroy(deleteItem.imagePublicId);
        }
        return deleteItem;
      })
    );

    return res.send({
      msg: "刪除資料成功",
      deletedCount: results.filter(Boolean).length,
      ids,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("刪除商品時出錯");
  }
});

//查詢資料庫中所有商品
router.get("/showItems", async (req, res) => {
  try {
    const allItems = await itemModels.find();

    console.log("收到了瀏覽並查詢所有石頭的請求...");

    return res.send(allItems);
  } catch (e) {
    res.status(500).send("無法查詢所有商品");
  }
});

//以商品id來查詢商品
router.get(`/folder/:color`, async (req, res) => {
  try {
    const itemColor = req.params.color;
    const findItem = await itemModels.find({ color: itemColor });
    console.log("收到瀏覽並查詢各別顏色石頭的請求...");
    res.send(findItem);
  } catch (e) {
    console.log(e);
  }
});

//編輯商品資訊(沒在用)
router.put("/edit/:id", async (req, res) => {
  const itemId = req.params.id;
  const { color, height, width, imagePath } = req.body;

  try {
    const item = await itemModels.findById(itemId);
    if (!item) {
      return res.status(404).send("商品未找到");
    }

    //更新商品資訊
    item.color = color;
    item.height = height;
    item.width = width;
    item.imagePath = imagePath;

    const updatedItem = await item.save();
    res.status(200).send({ msg: "更新商品成功!", updatedItem });
  } catch (e) {
    res.status(500).send("無法更新商品資訊");
  }
});

// 新 API: 一次上傳多張圖 + 儲存資料
router.post("/upload-multiple", upload.array("images"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("沒有收到圖片");
    }

    const { color, height, width, isPaper, firstLastNumbers, stoneOrigin } =
      req.body;

    const savedItems = await Promise.all(
      req.files.map((file) => {
        const newItem = new itemModels({
          color,
          height,
          width,
          stoneOrigin,
          imagePath: file.path,
          imagePublicId: file.filename,
          isPaper: isPaper === "true",
          firstLastNumbers,
          fileName: file.originalname.replace(/\.[^/.]+$/, ""),
        });

        return newItem.save();
      })
    );

    console.log(
      `收到一次性上傳 ${savedItems.length} 張 ${color} 石頭的請求...`
    );

    res.status(200).send({
      msg: "成功上傳多張圖片並儲存資料",
      savedItems,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("伺服器錯誤：無法完成批次上傳");
  }
});

module.exports = router;
