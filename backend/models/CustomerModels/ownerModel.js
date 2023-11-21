const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
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
			enum: ["Male", "Female"],
			required: true,
		},
		preferredContactMethod: {
			type: String,
			enum: ["Email", "Phone", "Both", "Neither"],
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

ownerSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("Owner", ownerSchema);
