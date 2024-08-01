const router = require("express").Router();
const jwt = require("jsonwebtoken");
const UserController = require("../controllers/UserController");
const UploadedLogoModel = require("../model/uploadedLogo");
const UserModel = require("../model/user");
const apiResponse = require("../helpers/apiResponse");
const DIR = "upload/";
var multer = require("multer"),
  path = require("path");

var fs = require("fs");
const { decode } = require("punycode");

var dir = "./public";
var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, "./public");
    },
    filename: function (req, file, callback) {
      callback(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return callback(/*res.end('Only images are allowed')*/ null, false);
    }
    callback(null, true);
  },
});
router.post("/uploadFile", upload.any(), async (req, res) => {
  try {
    const token = req.headers.token;
    const secret = process.env.JWT_SECRET;
    const decodedToken = jwt.verify(token, secret);
    const userInfo = await UserModel.findById(decodedToken.id);
    if (userInfo?.isSubscribed == false) {
      return apiResponse.ErrorResponse(res, "not subscribed");
    }
    const expirationTime = decodedToken.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    if (expirationTime > currentTime && req.files) {
      let new_product = new UploadedLogoModel();
      new_product.name = req.files[0].filename;
      new_product.user_id = decodedToken.id;
      new_product.save((err, data) => {
        if (err) {
          return apiResponse.ErrorResponse(res, "Failed to upload.");
        } else {
          return apiResponse.successResponseWithData(
            res,
            "File upload success.",
            data
          );
        }
      });
    } else {
      return apiResponse.ErrorResponse(res, "Failed to upload.");
    }
  } catch (e) {
    console.log(e);

    return apiResponse.ErrorResponse(res, "Failed to upload.");
  }
});

module.exports = router;
