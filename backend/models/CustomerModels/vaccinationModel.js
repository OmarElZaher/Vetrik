const mongoose = require("mongoose");

const vaccinationCardSchema = mongoose.Schema(
	{
		pet: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Pet",
			required: true,
		},
		vaccine: [
			{
				vaccineName: {
					type: String,
					required: true,
				},
				vaccineBatch: {
					type: String,
					required: true,
				},
				vaccineGivenDate: {
					type: Date,
					required: true,
				},
				vaccineRenewalDate: {
					type: Date,
					default: null,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("VaccinationCard", vaccinationCardSchema);
