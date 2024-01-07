const express = require("express");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("colors");
require("dotenv").config();

const port = process.env.PORT || 8080;

connectDB();

const app = express();

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

app.use("/user", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, () =>
	console.log(`Server started on port ${port}...`.green.bold)
);
