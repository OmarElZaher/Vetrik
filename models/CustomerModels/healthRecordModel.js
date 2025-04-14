const mongoose = require("mongoose");

const healthRecordSchema = mongoose.Schema(
	{
		filename: {
			type: String,
		},
		data: {
			type: Buffer,
		},
		contentType: {
			type: String,
		},
		pet: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Pet",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("HealthRecord", healthRecordSchema);
