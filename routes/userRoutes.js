// Imports
const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerMiddleware");

const {
	createAdmin,
	createUser,
	createVet,
	createSecretary,
	getUsers,
	getUserInfoById,
	setAdmin,
	setVet,
	setSecretary,
	deleteUser,

	downloadHealthRecord,
	uploadHealthRecord,
	getAllHealthRecords,
	deleteHealthRecord,

	loginUser,
	logoutUser,
	deleteUserProfile,
	getUserInfo,
	getSecretaryNotifications,
	updateUserProfile,
	forgotUsername,
	changePassword,
	requestOTP,
	verifyOTP,
	resetPassword,
	addPetToOwner,
	getPet,
	getPetInfo,
	updatePetProfile,
	removePetFromOwner,
	deletePetProfile,
	createVaccinationCard,
	deleteVaccinationCard,
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
router.get("/getUserInfo", authenticate, getUserInfo); //
router.get(
	"/getSecretaryNotifications",
	authenticate,
	getSecretaryNotifications
); // COMPLETE
router.get("/getUserInfo/:userId", authenticate, getUserInfoById); //
router.get("/getOwnerInfo/:ownerId", authenticate, getOwnerInfo); // COMPLETE
router.get("/getOwnerPets/:ownerId", authenticate, getOwnerPets); // COMPLETE
router.get("/getPetInfo/:petId", authenticate, getPetInfo); // COMPLETE
router.get("/getVaccinationCard/:petId", authenticate, getVaccinationCard); // COMPLETE

router.get("/getAllHealthRecords/:petId", getAllHealthRecords);
router.get(
	"/downloadHealthRecord/:petId/:healthRecordId",
	downloadHealthRecord
);

// POST methods for /user
router.post("/getUsers", authenticate, getUsers); // COMPLETE
router.post("/createAdmin", authenticate, createAdmin); // COMPLETE
router.post("/createUser", authenticate, createUser); // COMPLETE
router.post("/createVet", authenticate, createVet); //
router.post("/createSecretary", authenticate, createSecretary); //
router.post("/login", loginUser); // COMPLETE
router.post("/changePassword", authenticate, changePassword); // COMPLETE
router.post("/forgotUsername", forgotUsername); // COMPLETE
router.post("/logout", authenticate, logoutUser); // COMPLETE

router.post("/requestOTP", requestOTP); // COMPLETE
router.post("/verifyOTP", verifyOTP); // COMPLETE
router.post("/resetPassword", resetPassword); // COMPLETE

router.post("/createOwner", authenticate, createOwner); // COMPLETE
router.post("/getOwner", authenticate, getOwner); // COMPLETE
router.post("/addPetToOwner/:ownerId/:petId", addPetToOwner); // COMPLETE

router.post("/getPet", getPet); // COMPLETE
router.post("/createPet", authenticate, createPet); // COMPLETE
router.post(
	"/createVaccinationCard/:petId",
	authenticate,
	createVaccinationCard
); // COMPLETE
router.post("/addVaccination/:petId", authenticate, addVaccination); // COMPLETE

router.post(
	"/uploadHealthRecord/:petId",
	upload.single("file"),
	uploadHealthRecord
);

// PATCH methods for /user
router.patch("/updateProfile", authenticate, updateUserProfile); // COMPLETE
router.patch("/updateOwner/:ownerId", authenticate, updateOwnerProfile); // COMPLETE
router.patch("/updatePet/:petId", authenticate, updatePetProfile); // COMPLETE
router.patch("/setAdmin/:userId", authenticate, setAdmin); // COMPLETE
router.patch("/setVet/:userId", authenticate, setVet); //
router.patch("/setSecretary/:userId", authenticate, setSecretary); //

// PUT methods for /user
router.put(
	"/renewVaccination/:petId/:vaccinationId",
	authenticate,
	renewVaccination
); // COMPLETE

// DELETE methods for /user
router.delete("/deleteUser", authenticate, deleteUserProfile); // COMPLETE
router.delete("/deleteUser/:userId", authenticate, deleteUser); // COMPLETE
router.delete("/deleteOwner/:ownerId", authenticate, deleteOwnerProfile); // COMPLETE
router.delete("/deletePet/:petId", authenticate, deletePetProfile); // COMPLETE
router.delete(
	"/removePetFromOwner/:ownerId/:petId",
	authenticate,
	removePetFromOwner
); // COMPLETE
router.delete(
	"/deleteVaccination/:petId/:vaccinationId",
	authenticate,
	deleteVaccination
); // COMPLETE
router.delete(
	"/deleteVaccinationCard/:petId",
	authenticate,
	deleteVaccinationCard
); // COMPLETE

router.delete("/deleteHealthRecord/:healthRecordId", deleteHealthRecord);

// ----------------------------------------------------------------

// Export router
module.exports = router;
