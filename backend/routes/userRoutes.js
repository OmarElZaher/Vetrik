const express = require("express");
const router = express.Router();

const {
	createUser,
	deleteUserProfile,
	getUserInfo,
} = require("../controllers/userController");

const { authenticate } = require("../middleware/authMiddleware");

router.get("/getUserInfo", authenticate, getUserInfo);

router.post("/createUser", createUser);

router.delete("/deleteUser", authenticate, deleteUserProfile);

module.exports = router;
