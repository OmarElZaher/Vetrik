// const jwt = require("jsonwebtoken");
// const asyncHandler = require("express-async-handler");
// const User = require("../models/SystemModels/userModel");

// const authenticate = asyncHandler(async (req, res, next) => {
// 	// let token;

// 	// if (req.cookies && req.cookies.token) {
// 	// 	try {
// 	// 		// Get token from header
// 	// 		token = req.cookies.token;

// 	// 		// Verify token
// 	// 		const decoded = jwt.verify(token, process.env.JWT_SECRET);

// 	// 		const user = await User.findById(decoded.id).select("-password");

// 	// 		if (!user) {
// 	// 			res.status(401);
// 	// 			throw new Error("Unauthorized");
// 	// 		}

// 	// 		req.user = user;

// 	// 		next();
// 	// 	} catch (error) {
// 	// 		if (error.name === "TokenExpiredError") {
// 	// 			res.status(401);
// 	// 			throw new Error("Token has expired, please login again");
// 	// 		} else {
// 	// 			res.status(401);
// 	// 			throw new Error("Error: Unauthorized");
// 	// 		}
// 	// 	}
// 	// }

// 	// if (!token) {
// 	// 	res.status(401);
// 	// 	throw new Error("Not Logged In");
// 	// }

// 	const token = req.headers.authorization?.split(" ")[1];

// 	if (!token) {
// 		return res.status(401).json({ message: "No token provided" });
// 	}
// });

// module.exports = { authenticate };

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
	try {
		// ✅ Extract token from Authorization header
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ message: "No token provided" });
		}

		const token = authHeader.split(" ")[1];

		// ✅ Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// ✅ Attach user to request
		req.user = await User.findById(decoded.id).select("-password");

		next();
	} catch (error) {
		console.error(error);
		res.status(401).json({ message: "Not authorized, token failed" });
	}
};

module.exports = { protect };
