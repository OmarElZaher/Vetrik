const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Case = require("../models/SystemModels/caseModel");
const User = require("../models/User");

// @desc Create A New Case
// @route POST /case/createCase
// @access Private
const createCase = asyncHandler(async (req, res) => {
	try {
		const { petId, reasonForVisit } = req.body;

		if (!petId || !reasonForVisit) {
			return res.status(400).json({ message: "Please fill all fields" });
		}

		const newCase = await Case.create({
			petId,
			reasonForVisit,
			secretaryId: req.user._id,
		});

		if (!newCase) {
			return res.status(500).json({ message: "Failed to create case" });
		}
		return res.status(201).json({
			message: "Case created successfully",
			case: newCase,
		});
	} catch (error) {
		res.status(500);
		throw new Error(error.message);
	}
});

// @desc Get All Cases
// @route GET /case/getAllCases
// @access Private
const getAllCases = asyncHandler(async (req, res) => {
	try {
		const cases = await Case.find({}).populate("petId secretaryId vetId");

		if (cases.length === 0 || !cases) {
			return res.status(404).json({ message: "No cases found" });
		}
		return res.status(200).json({
			message: "Cases retrieved successfully",
			cases,
		});
	} catch (error) {
		res.status(500);
		throw new Error(error.message);
	}
});

// @desc Get Case By ID
// @route GET /case/getCase/:id
// @access Private
const getCaseById = asyncHandler(async (req, res) => {
	try {
		const caseId = req.params.id;

		if (!mongoose.Types.ObjectId.isValid(caseId)) {
			return res.status(400).json({ message: "Invalid case ID" });
		}

		const caseData = await Case.findById(caseId)
			.populate("petId secretaryId vetId")
			.exec();

		if (!caseData || caseData.length === 0) {
			return res.status(404).json({ message: "Case not found" });
		}
		return res.status(200).json({
			message: "Case retrieved successfully",
			case: caseData,
		});
	} catch (error) {
		res.status(500);
		throw new Error(error.message);
	}
});

// @desc Update Case
// @route PUT /case/updateCase/:id
// @access Private
const updateCase = asyncHandler(async (req, res) => {
	try {
		const caseId = req.params.id;
		const { status, actionsTaken } = req.body;

		if (!mongoose.Types.ObjectId.isValid(caseId)) {
			return res.status(400).json({ message: "Invalid case ID" });
		}

		const updatedCase = await Case.findByIdAndUpdate(
			caseId,
			{ status, actionsTaken },
			{ new: true }
		);

		if (!updatedCase) {
			return res.status(404).json({ message: "Case not found" });
		}
		return res.status(200).json({
			message: "Case updated successfully",
			case: updatedCase,
		});
	} catch (error) {
		res.status(500);
		throw new Error(error.message);
	}
});

// @desc Delete Case
// @route DELETE /case/deleteCase/:id
// @access Private
const deleteCase = asyncHandler(async (req, res) => {
	try {
		const caseId = req.params.id;

		if (!mongoose.Types.ObjectId.isValid(caseId)) {
			return res.status(400).json({ message: "Invalid case ID" });
		}

		const deletedCase = await Case.findByIdAndDelete(caseId);

		if (!deletedCase) {
			return res.status(404).json({ message: "Case not found" });
		}
		return res.status(200).json({
			message: "Case deleted successfully",
			case: deletedCase,
		});
	} catch (error) {
		res.status(500);
		throw new Error(error.message);
	}
});

// @desc View unassigned cases
// @route GET /case/getUnassignedCases
// @access Private
const getUnassignedCases = asyncHandler(async (req, res) => {
	try {
		const unassignedCases = await Case.find({
			vetId: null,
			status: "waiting",
		})
			.populate("petId")
			.populate("secretaryId", "fullName email");

		if (unassignedCases.length === 0) {
			return res.status(404).json({ message: "No unassigned cases found" });
		}
		return res.status(200).json({
			message: "Unassigned cases retrieved successfully",
			cases: unassignedCases,
		});
	} catch (error) {
		res.status(500);
		throw new Error(error.message);
	}
});

// @desc Assign a case to a vet
// @route PATCH /case/:caseId/acceptCase
// @access Private
const acceptCase = asyncHandler(async (req, res) => {
	try {
		const caseId = req.params.caseId;

		if (!caseId) {
			return res.status(400).json({ message: "Case ID is required" });
		}

		if (!req.user || req.user.role !== "vet") {
			return res.status(403).json({ message: "Unauthorized" });
		}

		const caseData = await Case.findById(caseId);

		if (!caseData) {
			return res.status(404).json({ message: "Case not found" });
		}

		if (caseData.vetId) {
			return res.status(400).json({ message: "Case already assigned" });
		}

		if (!mongoose.Types.ObjectId.isValid(caseId)) {
			return res.status(400).json({ message: "Invalid case ID" });
		}

		const updatedCase = await Case.findByIdAndUpdate(
			caseId,
			{ vetId: req.user._id, status: "in-progress" },

			{ new: true }
		);

		if (!updatedCase) {
			return res.status(404).json({ message: "Case not found" });
		}
		return res.status(200).json({
			message: "Case assigned successfully",
			case: updatedCase,
		});
	} catch (error) {
		res.status(500);
		throw new Error(error.message);
	}
});

// @desc Unassign a case from a vet
// @route PATCH /case/:caseId/unassignCase
// @access Private
const unassignCase = asyncHandler(async (req, res) => {
	try {
		const caseId = req.params.caseId;

		if (!caseId) {
			return res.status(400).json({ message: "Case ID is required" });
		}

		if (!req.user || req.user.role !== "vet") {
			return res.status(403).json({ message: "Unauthorized" });
		}

		const caseData = await Case.findById(caseId);

		if (!caseData) {
			return res.status(404).json({ message: "Case not found" });
		}

		if (!mongoose.Types.ObjectId.isValid(caseId)) {
			return res.status(400).json({ message: "Invalid case ID" });
		}

		const updatedCase = await Case.findByIdAndUpdate(
			caseId,
			{ vetId: null, status: "waiting" },
			{ new: true }
		);

		if (!updatedCase) {
			return res.status(404).json({ message: "Case not found" });
		}
		return res.status(200).json({
			message: "Case unassigned successfully",
			case: updatedCase,
		});
	} catch (error) {
		res.status(500);
		throw new Error(error.message);
	}
});

// @desc Get all cases assigned to a vet
// @route GET /case/getAssignedCases
// @access Private
const getAssignedCases = asyncHandler(async (req, res) => {
	try {
		if (!req.user || req.user.role !== "vet") {
			return res.status(403).json({ message: "Unauthorized" });
		}

		const assignedCases = await Case.find({ vetId: req.user._id })
			.populate("petId secretaryId")
			.exec();

		if (assignedCases.length === 0) {
			return res.status(404).json({ message: "No assigned cases found" });
		}
		return res.status(200).json({
			message: "Assigned cases retrieved successfully",
			cases: assignedCases,
		});
	} catch (error) {
		res.status(500);
		throw new Error(error.message);
	}
});

// @desc Vet completes case and reports to secretary
// @route PATCH /case/:caseId/completeCase
// @access Private
const completeCase = asyncHandler(async (req, res) => {
	try {
		const caseId = req.params.caseId;

		const { actionsTaken } = req.body;

		if (!caseId) {
			return res.status(400).json({ message: "Case ID is required" });
		}

		if (!req.user || req.user.role !== "vet") {
			return res.status(403).json({ message: "Unauthorized" });
		}

		const caseData = await Case.findById(caseId);

		if (!caseData) {
			return res.status(404).json({ message: "Case not found" });
		}

		if (!mongoose.Types.ObjectId.isValid(caseId)) {
			return res.status(400).json({ message: "Invalid case ID" });
		}

		const updatedCase = await Case.findByIdAndUpdate(
			caseId,
			{ status: "completed", actionsTaken },
			{ new: true }
		);

		if (!updatedCase) {
			return res.status(404).json({ message: "Case not found" });
		}

		// Notify the secretary about the completed case
		const secretary = await User.findById(updatedCase.secretaryId);
		if (secretary) {
			secretary.notifications.unshift({
				message: `Case ${updatedCase._id} has been completed by ${req.user.fullName}`,
				caseId: updatedCase._id,
			});
			await secretary.save();
		}

		return res.status(200).json({
			message: "Case completed successfully",
			case: updatedCase,
		});
	} catch (error) {
		res.status(500);
		throw new Error(error.message);
	}
});
// @desc Get completed cases for secretary
// @route GET /case/getCompletedCases
// @access Private
const getCompletedCases = asyncHandler(async (req, res) => {
	try {
		if (!req.user || req.user.role !== "secretary") {
			return res.status(403).json({ message: "Unauthorized" });
		}

		const completedCases = await Case.find({ status: "completed" })
			.populate("petId vetId")
			.sort({ updatedAt: -1 })
			.exec();

		if (completedCases.length === 0) {
			return res.status(404).json({ message: "No completed cases found" });
		}
		return res.status(200).json({
			message: "Completed cases retrieved successfully",
			cases: completedCases,
		});
	} catch (error) {
		res.status(500);
		throw new Error(error.message);
	}
});

module.exports = {
	createCase,
	getAllCases,
	getCaseById,
	updateCase,
	deleteCase,
	getUnassignedCases,
	acceptCase,
	unassignCase,
	getAssignedCases,
	completeCase,
	getCompletedCases,
};
