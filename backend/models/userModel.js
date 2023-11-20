const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: [true, "Please enter a username"],
		},
		email: {
			type: String,
			required: [true, "Please enter a valid email address"],
		},
		firstName: {
			type: String,
			required: [true, "Please enter your first name"],
		},
		lastName: {
			type: String,
			required: [true, "Please enter your last name"],
		},
		fullName: firstName + " " + lastName,
		passwordResetOTP: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
