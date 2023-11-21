const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
require("colors");

let gfs;

const connectGridFS = () => {
	if (!gfs) {
		const connection = mongoose.connection;

		connection.once("open", () => {
			try {
				// Create a new Grid instance
				gfs = Grid(connection.db, mongoose.mongo);

				// Set the collection name
				gfs.collection("uploads");

				console.log("GridFS connected".bgBlack.green.bold);
			} catch (error) {
				console.error("Error connecting to GridFS:", error);
			}
		});
	}
};

module.exports = { connectGridFS, gfs };
