const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		mobileNumber: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			enum: ["male", "female"],
			required: true,
		},
		preferredContactMethod: {
			type: String,
			enum: ["email", "phone", "both", "neither"],
			required: true,
		},
		receiveNotifications: {
			type: Boolean,
			required: true,
			default: true,
		},
		pets: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Pet",
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Owner", ownerSchema);
