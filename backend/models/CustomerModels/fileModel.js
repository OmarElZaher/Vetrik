const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
	{
		owners: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Owner",
				required: true,
			},
		],
		pet: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Pet",
			required: true,
		},
		vaccinationCard: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "VaccinationCard",
		},
		attachedFiles: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "UploadedFiles",
			},
		],
		notes: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("File", fileSchema);
