const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		dob: {
			type: Date,
			required: true,
		},
		ageClass: {
			type: String,
		},
		type: {
			type: String,
			required: true,
			enum: ["dog", "cat", "bird", "turtle", "monkey", "hamster", "fish"],
		},
		breed: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			enum: ["male", "female"],
			required: true,
		},
		weight: {
			type: Number,
			required: true,
		},
		weightClass: {
			type: String,
		},
		lastVist: {
			type: Date,
			required: true,
			default: Date.now,
		},
		owners: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Owner",
				required: true,
			},
		],
	},
	{
		timestamps: true,
	}
);

petSchema.virtual("age").get(function () {
	// Calculate age based on the date of birth
	const today = new Date();
	const birthDate = new Date(this.dob);
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();

	// Adjust age if the birthday hasn't occurred this year
	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birthDate.getDate())
	) {
		age--;
	}

	return age;
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
