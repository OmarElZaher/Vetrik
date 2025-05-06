const express = require("express");
const router = express.Router();

const {
	createCase,
	getAllCases,
	deleteCase,
	getCaseById,
	updateCase,
	acceptCase,
	getUnassignedCases,
	getCompletedCases,
	completeCase,
	unassignCase,
	getAssignedCases,
} = require("../controllers/caseController");
const { authenticate } = require("../middleware/authMiddleware");

// ----------------------------------------------------------------
// GET methods for /case
// ----------------------------------------------------------------
router.get("/getAllCases", authenticate, getAllCases);
router.get("/getCaseById/:caseId", authenticate, getCaseById);
router.get("/getUnassignedCases", authenticate, getUnassignedCases);
router.get("/getAssignedCases", authenticate, getAssignedCases);
router.get("/getCompletedCases", authenticate, getCompletedCases);

// ----------------------------------------------------------------
// POST methods for /case
// ----------------------------------------------------------------
router.post("/createCase", authenticate, createCase);

// ----------------------------------------------------------------
// PUT methods for /case
// ----------------------------------------------------------------
router.put("/updateCase/:caseId", authenticate, updateCase);

// ----------------------------------------------------------------
// PATCH methods for /case
// ----------------------------------------------------------------
router.patch("/:caseId/acceptCase", authenticate, acceptCase);
router.patch("/:caseId/unassignCase", authenticate, unassignCase);
router.patch("/:caseId/completeCase", authenticate, completeCase);

// ----------------------------------------------------------------
// DELETE methods for /case
// ----------------------------------------------------------------
router.delete("/deleteCase/:caseId", authenticate, deleteCase);

module.exports = router;
