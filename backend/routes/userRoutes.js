// Imports
const express = require("express");
const router = express.Router();

const {
	createAdmin,
	createUser,
	getUsers,
	deleteUser,

	loginUser,
	deleteUserProfile,
	getUserInfo,
	updateUserProfile,
	changePassword,
	requestOTP,

	createOwner,
	getOwnerInfo,
	getOwner,
	getOwnerPets,
	deleteOwnerProfile,
	updateOwnerProfile,

	createPet,
} = require("../controllers/userController");

const { authenticate } = require("../middleware/authMiddleware");

// ----------------------------------------------------------------

// GET methods for /user
router.get("/getUserInfo", authenticate, getUserInfo); // COMPLETE
router.get("/getOwnerInfo/:id", authenticate, getOwnerInfo); // COMPLETE
router.get("/getOwner", authenticate, getOwner); // COMPLETE
router.get("/getOwnerPets/:id", authenticate, getOwnerPets); // COMPLETE
router.get("/getUsers", authenticate, getUsers); // COMPLETE

// POST methods for /user
router.post("/createAdmin", authenticate, createAdmin); // COMPLETE
router.post("/createUser", authenticate, createUser); // COMPLETE
router.post("/login", loginUser); // COMPLETE
router.post("/changePassword", authenticate, changePassword); // COMPLETE
router.post("/requestOTP", requestOTP); // NOT -- COMPLETE

router.post("/createOwner", authenticate, createOwner); // COMPLETE

router.post("/createPet", authenticate, createPet); // COMPLETE

// PATCH methods for /user
router.patch("/updateProfile", authenticate, updateUserProfile); // COMPLETE
router.patch("/updateOwner/:id", authenticate, updateOwnerProfile); // COMPLETE

// DELETE methods for /user
router.delete("/deleteUser", authenticate, deleteUserProfile); // COMPLETE
router.delete("/deleteUser/:id", authenticate, deleteUser); // COMPLETE
router.delete("/deleteOwner/:id", authenticate, deleteOwnerProfile); // COMPLETE

// ----------------------------------------------------------------

// Export router
module.exports = router;
