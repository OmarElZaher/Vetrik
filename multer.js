const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// Organize uploads into a 'files' subdirectory
		cb(null, path.join(__dirname, "uploads", "files"));
	},
	filename: function (req, file, cb) {
		// Generate a unique filename using crypto
		const uniqueSuffix =
			Date.now() + "-" + crypto.randomBytes(8).toString("hex");
		cb(null, `${file.originalname}-${uniqueSuffix}`);
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

module.exports = upload;
