const router = require("express").Router();
const UserController = require("../controllers/UserController");
const AdminController = require("../controllers/AdminController");

router.post("/adLogin", AdminController.adLogin);
router.post("/getAllUsers", AdminController.getAllUserInfo);
router.post("/changeUserRole", AdminController.changeUserRole);
router.post("/changeBlockStatus", AdminController.changeBlockStatus);
router.post("/changeSubStatus", AdminController.changeSubStatus);
router.post("/dashBoardCounts", AdminController.dashBoardCounts);
router.post("/getUserGeo", AdminController.getGeoInfo);
router.post("/getOverview", AdminController.getOverview);
router.post("/getTotalView", AdminController.getTotalView);

module.exports = router;
