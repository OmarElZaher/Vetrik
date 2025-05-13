const mongoose = require("mongoose");

const caseSchema = mongoose.Schema(
	{
		petId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Pet",
			required: true,
		},
		secretaryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		vetId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		reasonForVisit: {
			type: String,
			required: true,
		},
		actionsTaken: {
			type: String,
			default: "",
		},
		status: {
			type: String,
			enum: ["waiting", "in-progress", "completed", "closed"],
			default: "waiting",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Case", caseSchema);
