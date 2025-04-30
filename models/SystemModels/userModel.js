const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		passwordResetOTP: {
			type: String,
			default: "",
		},
		role: {
			type: String,
			enum: ["admin", "vet", "secretary"],
			required: true,
			default: "vet",
		},
		notifications: [
			{
				message: {
					type: String,
					required: true,
				},
				read: {
					type: Boolean,
					default: false,
				},
				caseId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Case",
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

userSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", userSchema);
