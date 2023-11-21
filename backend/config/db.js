const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
	try {
		// Connect to the database and silence any derecation warnings
		const conn = await mongoose.connect(process.env.MONGO_URI);

		// Log successful connection
		console.log(
			`MongoDB Connected Successfuly: ${conn.connection.host}`.magenta.bold
		);

		// Event Listeners
		mongoose.connection.on("connected", () => {
			console.log("MongoDB connected to database");
		});

		mongoose.connection.on("error", (err) => {
			console.error(`MongoDB connection error: ${err}`);
		});

		mongoose.connection.on("disconnected", () => {
			console.log("MongoDB disconnected");
		});
	} catch (error) {
		console.error(`Error connecting to MongoDB: ${error.message}`.red.bold);
		process.exit(1);
	}
};

module.exports = connectDB;
