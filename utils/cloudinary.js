const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const fileFilter = (req, file, callback) => {
  // 解决中文名乱码的问题 latin1 是一种编码格式
  file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
  callback(null, true)

  // 真正的檔案格式檢查
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error('Only jpg, jpeg, and png files are allowed'), false);
  }
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mern-items', // Cloudinary 上的資料夾名稱
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage,fileFilter});

module.exports = { cloudinary, upload };
