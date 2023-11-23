// Imports
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

const User = require("../models/SystemModels/userModel");
const Owner = require("../models/CustomerModels/ownerModel");
const Pet = require("../models/CustomerModels/petModel");

// ----------------------------------------------------------------

// @desc Create A New User
// @route POST /user/createUser
// @access Public
const createUser = asyncHandler(async (req, res, next) => {
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

	// Validate email format using a regular expression
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		res.status(400);
		throw new Error("Invalid email format");
	}

	// Password requirements (customize based on your requirements)
	const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/;

	if (!passwordRegex.test(password)) {
		res.status(400);
		throw new Error(
			"Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one digit"
		);
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
			// token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("Invalid User Data");
	}
});

// @desc Update User Credentials
// @route PATCH /user/updateProfile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
	try {
		const { username, email } = req.body;

		// Check if the updated username is already taken by another user
		if (username) {
			const usernameExists = await User.findOne({
				username,
				_id: { $ne: req.user._id }, // Exclude the current user from the search
			});
			if (usernameExists) {
				res.status(400).json({ message: "Username is already taken" });
				return;
			}
		}

		// Check if the updated email is already taken by another user
		if (email) {
			const emailExists = await User.findOne({
				email,
				_id: { $ne: req.user._id }, // Exclude the current user from the search
			});
			if (emailExists) {
				res.status(400).json({ message: "Email is already in use" });
				return;
			}
		}

		const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body);

		if (updatedUser) {
			res.status(200).json({ message: "User Updated Successfully" });
		}
	} catch (error) {
		res.status(400);
		throw new Error(error);
	}
});

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

// @desc Login User
// @route POST /user/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		res.status(400).json({ message: "Please Enter All Fields" });
	}

	const user = await User.findOne({ username: username });

	if (!user) {
		res.status(400).json({ message: "Invalid Username" });
	} else {
		if (await bcrypt.compare(password, user.password)) {
			res
				.status(200)
				.json({ message: "Login Success", token: generateToken(user._id) });
		} else {
			res.status(400).json({ message: "Invalid Credentials" });
		}
	}
});

// @desc Get User Info
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

// @desc Create New Owner
// @route POST /user/createOwner
// @access Private
const createOwner = asyncHandler(async (req, res) => {
	const {
		firstName,
		lastName,
		mobileNumber,
		email,
		gender,
		preferredContactMethod,
		receiveNotifications,
	} = req.body;

	if (
		!firstName ||
		!lastName ||
		!mobileNumber ||
		!email ||
		!gender ||
		!preferredContactMethod ||
		!receiveNotifications
	) {
		res.status(400);
		throw new Error("Please Enter All Fields");
	}

	try {
		// Create the owner
		const owner = await Owner.create(req.body);

		if (owner) {
			// Update the pets associated with the owner
			const petIds = req.body.pets; // Assuming you have a field 'pets' in the request body

			if (petIds && Array.isArray(petIds)) {
				for (const petId of petIds) {
					const pet = await Pet.findById(petId);

					if (pet) {
						pet.owners.push(owner._id);
						await pet.save();
					}
				}
			}

			res.status(200).json({ message: "Owner Created Successfully" });
		}
	} catch (error) {
		res.status(400);
		throw new Error(error);
	}
});

// @desc Get Owner Information
// @route GET /user/getOwnerInfo/:id
// @access Private
const getOwnerInfo = asyncHandler(async (req, res) => {
	try {
		const owner = await Owner.findById(req.params.id);

		if (owner) {
			res.status(400).json(owner);
		}
	} catch (error) {
		res.status(400);
		throw new Error("Owner Not Found");
	}
});

// @desc Get Owner
// @route GET /user/getOwner/
// @access Private
const getOwner = asyncHandler(async (req, res) => {
	try {
		const owner = await Owner.find(req.body);

		if (owner) {
			res.status(200).json(owner);
		}
	} catch (error) {
		res.status(400);
		throw new Error(error);
	}
});

// @desc Get Owner Pets
// @route GET /user/getOwnerPets/:id
// @access Private
const getOwnerPets = asyncHandler(async (req, res) => {
	try {
		const owner = await Owner.findById(req.params.id).populate("pets");

		if (owner.pets.length > 0) {
			res.status(200).json(owner.pets);
		} else {
			res.status(400).json({ message: "No Pets Found!" });
		}
	} catch (error) {
		res.status(400);
		throw new Error(error);
	}
});

// @desc Update Owner Information
// @route PATCH /users/updateOwner/:id
// @access Private
const updateOwnerProfile = asyncHandler(async (req, res) => {
	try {
		const updatedOwner = await Owner.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);

		if (updatedOwner) {
			res.status(200).json({ message: "Owner Updated Successfully" });
		}
	} catch (error) {
		res.status(400);
		throw new Error(error);
	}
});

// @desc Delete Owner
// @route DELETE /user/deleteOwner/:id
// @access Private
const deleteOwnerProfile = asyncHandler(async (req, res) => {
	try {
		if (!(await Owner.findByIdAndDelete(req.params.id))) {
			res.status(400).json({ message: "Owner Not Found!" });
		} else {
			res.status(200).json({ message: "Owner Deleted Successfully" });
		}
	} catch (error) {
		res.status(400);
		throw new Error(error);
	}
});

// @desc Create Pet
// @route POST /user/createPet
// @access Private
const createPet = asyncHandler(async (req, res) => {
	try {
		const ownerIds = req.body.owners;

		// Check if ownerIds is an array
		if (!Array.isArray(ownerIds)) {
			res.status(400).json({ message: "Owners should be an array" });
			return;
		}

		// Check if any owner ID is invalid
		for (const ownerId of ownerIds) {
			const owner = await Owner.findById(ownerId);
			if (!owner) {
				res.status(400).json({ message: `Owner with ID ${ownerId} not found` });
				return;
			}
		}

		// Create the pet
		const pet = await Pet.create(req.body);

		// Associate the pet with each owner
		for (const ownerId of ownerIds) {
			const owner = await Owner.findById(ownerId);
			owner.pets.push(pet._id);
			await owner.save();
		}

		res.status(200).json({ message: "Pet Created Successfully" });
	} catch (error) {
		res
			.status(400)
			.json({ message: "Error creating pet", error: error.message });
	}
});

// Generate Token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
};

module.exports = {
	createUser,
	loginUser,
	getUserInfo,
	deleteUserProfile,
	updateUserProfile,

	createOwner,
	getOwnerInfo,
	getOwner,
	getOwnerPets,
	updateOwnerProfile,
	deleteOwnerProfile,

	createPet,
};
