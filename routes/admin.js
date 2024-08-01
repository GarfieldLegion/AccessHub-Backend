const router = require("express").Router();
const AdminController = require("../controllers/AdminController");

router.post("/adLogin", AdminController.adLogin);

module.exports = router;
