// routes/files.js
const express = require("express");
const router = express.Router();
const upload = require("../../multer");
const { connectGridFS, gfs } = require("../../gridfs");

// Connect to GridFS
connectGridFS();

// Upload route
router.post("/upload", upload.single("file"), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: "No file uploaded" });
	}

	const { originalname, buffer } = req.file;

	const writeStream = gfs.createWriteStream({
		filename: originalname,
	});

	writeStream.on("close", (file) => {
		res
			.status(200)
			.json({ file_id: file._id, message: "File uploaded successfully" });
	});

	writeStream.write(buffer);
	writeStream.end();
});

// Download route
router.get("/download/:id", (req, res) => {
	gfs.files.findOne(
		{ _id: mongoose.Types.ObjectId(req.params.id) },
		(err, file) => {
			if (err) {
				return res.status(500).json({ message: "Internal Server Error" });
			}

			if (!file) {
				return res.status(404).json({ message: "File not found" });
			}

			const readStream = gfs.createReadStream(file.filename);

			readStream.on("error", (err) => {
				res.status(500).json({ message: "Error reading file" });
			});
			readStream.pipe(res);
		}
	);
});

module.exports = router;
