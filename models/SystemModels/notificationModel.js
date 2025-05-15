const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		case: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Case",
			required: true,
		},
		read: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			enum: ["case_completed"],
			default: "info",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Notification", notificationSchema);
