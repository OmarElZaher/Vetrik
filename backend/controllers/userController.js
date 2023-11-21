const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/SystemModels/userModel");

// @desc Create A New User
// @route POST /user/createUser
// @access Public
const createUser = asyncHandler(async (req, res, next) => {
	// TODO: Handle password requirements / email validation (regex) and check tokens/cookies

	const { username, email, firstName, lastName, password, confirmPassword } =
		req.body;

	// Checks if all fields are entered
	if (
		!username ||
		!email ||
		!firstName ||
		!lastName ||
		!password ||
		!confirmPassword
	) {
		res.status(400);
		throw new Error("Please Enter All Fields");
	}

	// Validation Checks
	const usernameExists = await User.findOne({ username });
	const emailExists = await User.findOne({ email });

	if (usernameExists) {
		res.status(400);
		throw new Error("Username Taken, Please Try Another One");
	} else if (emailExists) {
		res.status(400);
		throw new Error("A User With This Email Already Exists");
	} else if (password !== confirmPassword) {
		res.status(400);
		throw new Error("Passwords Do Not Match");
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({
		username,
		email,
		firstName,
		lastName,
		password: hashedPassword,
	});

	if (user) {
		res.status(201).json({
			_id: user.id,
			username: user.username,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("Invalid User Data");
	}
});

// @desc Update User Credentials
// @route PATCH /user/updateProfile
// @access Private
const updateProfile = asyncHandler(async (req, res) => {});

// @desc Delete User
// @route DELETE /user/deleteUser
// @access Private
const deleteUserProfile = asyncHandler(async (req, res) => {
	const confirm = req.body;

	if (confirm !== "CONFIRM") {
		res.status(400);
		throw new Error("Please Enter CONFIRM");
	} else {
		await User.findByIdAndDelete(req.user._id);
		res.json({ message: "User Removed" });
	}
});

// @desc Get My Info
// @route GET /user/getUserInfo
// @access Private
const getUserInfo = asyncHandler(async (req, res) => {
	const user = req.user;

	res.json({
		_id: user._id,
		username: user.username,
		email: user.email,
		name: user.fullName,
	});
});

// Generate Token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
};

module.exports = {
	createUser,
	getUserInfo,
	deleteUserProfile,
};
