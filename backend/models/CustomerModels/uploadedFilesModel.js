const mongoose = require("mongoose");

const uploadedFilesSchema = mongoose.Schema(
	{
		files: [
			{
				filename: {
					type: String,
					required: true,
				},
				contentType: {
					type: String,
					required: true,
				},
				data: {
					type: Buffer,
					required: true,
				},
				uploader: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				uploadDate: {
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

const UploadedFiles = mongoose.model("UploadedFiles", uploadedFilesSchema);

module.exports = UploadedFiles;
