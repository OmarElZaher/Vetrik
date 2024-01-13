const express = require("express");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("body-parser");
require("colors");
require("dotenv").config();

const port = process.env.PORT || 8080;

connectDB();

const app = express();

// TODO: Fix lowercase for password

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(morgan("dev"));
app.use(helmet());
// app.use((req, res, next) => {
// 	convertToLowerCase(req.body);
// 	next();
// });

// function convertToLowerCase(obj) {
// 	for (let key in obj) {
// 		if (typeof obj[key] === "object") {
// 			convertToLowerCase(obj[key]); // Recursive call for nested objects
// 		} else if (typeof obj[key] === "string") {
// 			obj[key] = obj[key].toLowerCase(); // Convert string to lowercase
// 		}
// 	}
// }

app.use("/user", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, () =>
	console.log(`Server started on port ${port}...`.green.bold)
);
