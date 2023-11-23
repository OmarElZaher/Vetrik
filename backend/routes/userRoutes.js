// Imports
const express = require("express");
const router = express.Router();

const {
	createUser,
	loginUser,
	deleteUserProfile,
	getUserInfo,
	updateUserProfile,

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

// POST methods for /user
router.post("/createUser", createUser); // COMPLETE
router.post("/login", loginUser); // COMPLETE

router.post("/createOwner", authenticate, createOwner); // COMPLETE

router.post("/createPet", authenticate, createPet); // COMPLETE

// PATCH methods for /user
router.patch("/updateProfile", authenticate, updateUserProfile); // COMPLETE
router.patch("/updateOwner/:id", authenticate, updateOwnerProfile); // COMPLETE

// DELETE methods for /user
router.delete("/deleteUser", authenticate, deleteUserProfile); // COMPLETE
router.delete("/deleteOwner/:id", authenticate, deleteOwnerProfile); // COMPLETE

// ----------------------------------------------------------------

// Export router
module.exports = router;
