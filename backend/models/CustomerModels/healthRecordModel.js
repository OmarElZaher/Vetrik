const mongoose = require("mongoose");

const healthRecordSchema = mongoose.Schema({
	filename: {
		type: String,
	},
	data: {
		type: Buffer,
	},
	pet: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Pet",
	},
});

module.exports = mongoose.model("HealthRecord", healthRecordSchema);
