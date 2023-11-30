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
	verifyOTP,
	resetPassword,
	getPetInfo,
	updatePetProfile,
	deletePetProfile,
	createVaccinationCard,
	getVaccinationCard,
	addVaccination,
	renewVaccination,
	deleteVaccination,

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
router.get("/getOwnerInfo/:ownerId", authenticate, getOwnerInfo); // COMPLETE
router.get("/getOwner", authenticate, getOwner); // COMPLETE
router.get("/getOwnerPets/:ownerId", authenticate, getOwnerPets); // COMPLETE
router.get("/getUsers", authenticate, getUsers); // COMPLETE
router.get("/getPetInfo/:petId", authenticate, getPetInfo); // COMPLETE
router.get("/getVaccinationCard/:petId", authenticate, getVaccinationCard); // COMPLETE

// POST methods for /user
router.post("/createAdmin", authenticate, createAdmin); // COMPLETE
router.post("/createUser", authenticate, createUser); // COMPLETE
router.post("/login", loginUser); // COMPLETE
router.post("/changePassword", authenticate, changePassword); // COMPLETE

router.post("/requestOTP", requestOTP); // COMPLETE
router.post("/verifyOTP", verifyOTP); // COMPLETE
router.post("/resetPassword", resetPassword); // COMPLETE

router.post("/createOwner", authenticate, createOwner); // COMPLETE

router.post("/createPet", authenticate, createPet); // COMPLETE
router.post("/createVaccinationCard/:petId", authenticate, createVaccinationCard); // COMPLETE
router.post("/addVaccination/:petId", authenticate, addVaccination); //

// PATCH methods for /user
router.patch("/updateProfile", authenticate, updateUserProfile); // COMPLETE
router.patch("/updateOwner/:ownerId", authenticate, updateOwnerProfile); // COMPLETE
router.patch("/updatePet/:petId", authenticate, updatePetProfile); // COMPLETE

// PUT methods for /user
router.put(
	"/renewVaccination/:petId/:vaccinationId",
	authenticate,
	renewVaccination
); // COMPLETE

// DELETE methods for /user
router.delete("/deleteUser", authenticate, deleteUserProfile); // COMPLETE
router.delete("/deleteUser/:id", authenticate, deleteUser); // COMPLETE
router.delete("/deleteOwner/:ownerId", authenticate, deleteOwnerProfile); // COMPLETE
router.delete("/deletePet/:petd", authenticate, deletePetProfile); // COMPLETE
router.delete(
	"/deleteVaccination/:petId/:vaccinationId",
	authenticate,
	deleteVaccination
); // COMPLETE

// ----------------------------------------------------------------

// Export router
module.exports = router;
