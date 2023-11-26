// Imports
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

const User = require("../models/SystemModels/userModel");
const Owner = require("../models/CustomerModels/ownerModel");
const Pet = require("../models/CustomerModels/petModel");
const VaccinationCard = require("../models/CustomerModels/vaccinationModel");

// ----------------------------------------------------------------
// Global Variables

let otpExpiry;

// ----------------------------------------------------------------
// Helper Functions

const generateToken = (id) => {
	// TODO Update Token Expiration
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
};

function passwordValidator(password) {
	const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/;

	if (!passwordRegex.test(password)) {
		return false;
	} else {
		return true;
	}
}

function emailValidator(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!emailRegex.test(email)) {
		return false;
	} else {
		return true;
	}
}

function generateOTP() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

// ----------------------------------------------------------------
// Admin Roles

// @desc Create A New User
// @route POST /user/createUser
// @access Private
const createUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (!user.isAdmin) {
		res.status(401);
		throw new Error("Unauthorized: Not An Admin");
	} else {
		const {
			username,
			email,
			firstName,
			lastName,
			password,
			confirmPassword,
			isAdmin,
		} = req.body;

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
		if (!emailValidator(email)) {
			res.status(400);
			throw new Error("Invalid email format");
		}

		// Password requirements
		if (!passwordValidator(password)) {
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
			isAdmin,
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
	}
});

// @desc Create A New Admion
// @route POST /user/createAdmin
// @access Private
const createAdmin = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (!user.isAdmin) {
			res.status(401);
			throw new Error("Unauthorized: Not An Admin");
		}

		req.body.isAdmin = true;

		// Call the createUser function with isAdmin set to true
		await createUser(req, res, () => {}, { ...req.body, isAdmin: true });

		// If execution reaches here, the admin is created successfully
		res.status(200).json({ message: "Admin Created" });
	} catch (error) {
		res.status(400);
		throw new Error(error.stack);
	}
});

// @desc Get All Users
// @route GET /user/getUsers
// @access Private
const getUsers = asyncHandler(async (req, res) => {
	if ((await User.findById(req.user._id)).isAdmin) {
		const users = await User.find();

		if (users.length > 0) {
			res.status(200).json(users);
		} else {
			res.status(400).json({ message: "No Users Found!" });
		}
	} else {
		res.status(401);
		throw new Error("Unauthorized: Not An Admin");
	}
});

// @desc Delete A User
// @route GET /user/deleteUser/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
	if ((await User.findById(req.user._id)).isAdmin) {
		const deleted = await User.findByIdAndDelete(req.params.id);

		if (deleted) {
			res.status(200).json({ message: "User Deleted" });
		}
	} else {
		res.status(401);
		throw new Error("Unauthorized: Not An Admin");
	}
});

// TODO decision
// @desc Admin Sends Notification to All Users
// @route POST /user/sendNotification
// @access Private
const sendNotification = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (!user.isAdmin) {
		res.status(401);
		throw new Error("Unauthorized: Not An Admin");
	} else {
	}
});

// ----------------------------------------------------------------
// General User Roles

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
	const { confirm } = req.body;

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

	res.status(200).json({
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
		// Check if the email or mobileNumber already exist in the database
		const existingOwner = await Owner.findOne({
			$or: [{ email }, { mobileNumber }],
		});

		if (existingOwner) {
			res.status(400);
			throw new Error(
				"An owner with this email or mobile number already exists"
			);
		}

		// Create the owner
		const owner = await Owner.create(req.body);

		if (owner) {
			// Update the pets associated with the owner
			const petIds = req.body.pets;

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
		const ownerId = req.params.id;

		// Find the owner
		const owner = await Owner.findById(ownerId);

		if (!owner) {
			res.status(400).json({ message: "Owner Not Found!" });
			return;
		}

		// Find all pets that have the owner
		const pets = await Pet.find({ owners: ownerId });

		// Update each pet's owners array to remove the owner
		const updatePromises = pets.map(async (pet) => {
			const index = pet.owners.indexOf(ownerId);
			if (index !== -1) {
				pet.owners.splice(index, 1);
				await pet.save();

				// Check if the pet has no owners after removal
				if (pet.owners.length === 0) {
					await Pet.findByIdAndDelete(pet._id);
				}
			}
		});

		// Wait for all updates to complete
		await Promise.all(updatePromises);

		// Delete the owner
		const deletedOwner = await Owner.findByIdAndDelete(ownerId);

		if (!deletedOwner) {
			res.status(400).json({ message: "Owner Not Found!" });
		} else {
			res.status(200).json({ message: "Owner Removed From System" });
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

// @desc Get Pet Information
// @route GET /user/getPetInfo/:id
// @access Private
const getPetInfo = asyncHandler(async (req, res) => {
	const pet = await Pet.findById(req.params.id).populate({
		path: "owners",
		select: "firstName lastName -_id",
	});

	if (!pet) {
		res.status(400).json({ message: "Pet Not Found!" });
	} else {
		res.status(200).json({ pet: pet, petAge: pet.age });
	}
});

// @desc Update Pet Information
// @route PATCH /user/updatePet/:id
// @access Private
const updatePetProfile = asyncHandler(async (req, res) => {
	try {
		const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body);

		if (updatedPet) {
			res.status(200).json({ message: "Pet Updated Successfully" });
		}
	} catch (error) {
		res.status(400);
		throw new Error(error);
	}
});

// @desc Delete Pet
// @route DELETE /user/deletePet/:id
// @access Private
const deletePetProfile = asyncHandler(async (req, res) => {
	try {
		const petId = req.params.id;

		// Find the pet
		const pet = await Pet.findById(petId);

		if (!pet) {
			res.status(400).json({ message: "Pet Not Found!" });
			return;
		}

		// Find all owners of the pet
		const owners = await Owner.find({ pets: petId });

		// Update each owner's pets array to remove the pet
		const updatePromises = owners.map(async (owner) => {
			const index = owner.pets.indexOf(petId);
			if (index !== -1) {
				owner.pets.splice(index, 1);
				await owner.save();

				// Check if the owner has no pets after removal
				if (owner.pets.length === 0) {
					await Owner.findByIdAndDelete(owner._id);
				}
			}
		});

		// Wait for all updates to complete
		await Promise.all(updatePromises);

		// Delete the pet
		const deletedPet = await Pet.findByIdAndDelete(petId);

		if (!deletedPet) {
			res.status(400).json({ message: "Pet Not Found!" });
		} else {
			res.status(200).json({ message: "Pet Deleted Successfully" });
		}
	} catch (error) {
		res.status(400);
		throw new Error(error);
	}
});

// @desc Create New Vaccination Card
// @route POST /user/createVaccinationCard/:id
// @access Private
const createVaccinationCard = asyncHandler(async (req, res) => {
	try {
		const pet = await Pet.findById(req.params.id);

		const { vaccineName, vaccineBatch, vaccineGivenDate, vaccineRenewalDate } =
			req.body;

		if (!vaccineName || !vaccineBatch || !vaccineGivenDate) {
			res.status(400).json({ message: "Please Enter All Fields" });
		}

		const vaccination = await VaccinationCard.create({
			pet: pet._id,
			vaccine: {
				vaccineName,
				vaccineBatch,
				vaccineGivenDate,
				vaccineRenewalDate,
			},
		});

		if (vaccination) {
			res.status(200).json({ message: "Vaccination Card Created" });
		} else {
			res.status(400).json({ message: "Invalid Data" });
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Get Pet Vaccination Card
// @route GET /user/getVaccinationCard/:id
// @access Private
const getVaccinationCard = asyncHandler(async (req, res) => {
	try {
		const petId = req.params.id;

		const vaccinationCard = await VaccinationCard.findOne({ pet: petId });

		if (!vaccinationCard) {
			res.status(400).json({ message: "Pet Does Not Have A Vaccination Card" });
		} else {
			res.status(200).json(vaccinationCard);
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Add To Pet Vaccination Card
// @route POST /user/addVaccination/:id
// @access Private
const addVaccination = asyncHandler(async (req, res) => {
	try {
		const pet = await Pet.findById(req.params.id);
		const vaccinationCard = await VaccinationCard.findOne({ pet: pet._id });

		if (!pet) {
			res.status(400).json({ message: "Pet Not Found" });
		}

		if (!vaccinationCard) {
			res.status(400).json({
				message:
					"Pet Does Not Have A Vaccination Card, Please Create One First",
			});
		}

		const { vaccineName, vaccineBatch, vaccineGivenDate } = req.body;

		if (!vaccineName || !vaccineBatch || !vaccineGivenDate) {
			res.status(400).json({ message: "Please Enter All Fields" });
		} else {
			vaccinationCard.vaccine.push(req.body);
			await vaccinationCard.save();
			res.status(200).json({ message: "Vaccination Added" });
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Renew Pet Vaccination
// @route PUT /user/renewVaccination/:petId/:vaccinationId
// @access Private
const renewVaccination = asyncHandler(async (req, res) => {
	try {
		const { petId, vaccinationId } = req.params;

		const pet = await Pet.findById(petId);

		if (!pet) {
			return res.status(404).json({ message: "Pet not found" });
		}

		const vaccinationCard = await VaccinationCard.findOne({ pet: pet._id });

		if (!vaccinationCard) {
			return res
				.status(404)
				.json({ message: "Vaccination card not found for the pet" });
		}

		const vaccinationIndex = vaccinationCard.vaccine.findIndex(
			(vaccine) => vaccine._id.toString() === vaccinationId
		);

		if (vaccinationIndex === -1) {
			return res.status(404).json({ message: "Vaccination not found" });
		}

		// Update the vaccineGivenDate to today's date
		vaccinationCard.vaccine[vaccinationIndex].vaccineGivenDate = new Date();

		if (!req.body.vaccineRenewalDate) {
			vaccinationCard.vaccine[vaccinationIndex].vaccineRenewalDate = null;
		} else {
			vaccinationCard.vaccine[vaccinationIndex].vaccineRenewalDate =
				req.body.vaccineRenewalDate;
		}

		// Save the updated vaccination card
		await vaccinationCard.save();

		res.status(200).json({ message: "Vaccination renewed successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
		throw new Error(error);
	}
});

// @desc Delete Pet Vaccination
// @route DELETE /user/deleteVaccination/:petId/:vaccinationId
// @access Private
const deleteVaccination = asyncHandler(async (req, res) => {
	try {
		const { petId, vaccinationId } = req.params;

		const pet = await Pet.findById(petId);

		if (!pet) {
			return res.status(404).json({ message: "Pet not found" });
		}

		const vaccinationCard = await VaccinationCard.findOne({ pet: pet._id });

		if (!vaccinationCard) {
			return res
				.status(404)
				.json({ message: "Vaccination card not found for the pet" });
		}

		const vaccinationIndex = vaccinationCard.vaccine.findIndex(
			(vaccine) => vaccine._id.toString() === vaccinationId
		);

		if (vaccinationIndex === -1) {
			return res.status(404).json({ message: "Vaccination not found" });
		}

		// Remove the vaccination from the array
		vaccinationCard.vaccine.splice(vaccinationIndex, 1);

		// Save the updated vaccination card
		await vaccinationCard.save();

		res.status(200).json({ message: "Vaccination deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
		throw new Error(error);
	}
});

// @desc Change Password
// @route POST /user/changePassword
// @access Private
const changePassword = asyncHandler(async (req, res) => {
	const user = await User.findOne({ _id: req.user._id });

	const { oldPassword, newPassword, confirmPassword } = req.body;

	if (!oldPassword || !newPassword || !confirmPassword) {
		res.status(400).json({ message: "Enter All Fields" });
	}

	if (!(await bcrypt.compare(oldPassword, user.password))) {
		res.status(400).json({ message: "Invalid Password" });
	} else if (await bcrypt.compare(newPassword, user.password)) {
		res
			.status(400)
			.json({ message: "New Password Cannot Be The Same As Old Password" });
	} else if (newPassword !== confirmPassword) {
		res.status(400).json({ message: "Passwords Don't Match" });
	} else if (!passwordValidator(newPassword)) {
		res.status(400).json({
			message:
				"Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one digit",
		});
	} else {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		user.password = hashedPassword;
		user.tokenVersion += 1;
		await user.save();
		res.status(200).json({ message: "Password Changed" });
		req.user = null;
	}
});

// @desc Request OTP
// @route POST /user/requestOTP
// @access Public
const requestOTP = asyncHandler(async (req, res) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		res.status(404).json({ message: "User Not Found!" });
	} else {
		const otp = generateOTP();
		user.passwordResetOTP = otp;
		await user.save();
		otpExpiry = new Date();
		otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
		console.log(otpExpiry);

		const transporter = nodemailer.createTransport({
			service: "",
			auth: {
				user: "",
				pass: "",
			},
		});

		const mailOptions = {
			from: "",
			to: user.email,
			subject: "[NO REPLY] Your Password Reset Request",
			html: `<h1>You have requested to reset your password.<h1>
                <p>Your OTP is ${otp}<p>
                <p>If you did not request to reset your password, you can safely disregard this message.<p>
                <p>This Is An Automated Message, Please Do Not Reply.<p>`,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				res.status(500);
				throw new Error("Failed to Send OTP Email.");
			} else {
				res.status(200).json({ message: "OTP Sent, Please Check Your Email" });
			}
		});
	}
});

// @desc Verify OTP
// @route POST /user/verifyOTP
// @access Public
const verifyOTP = asyncHandler(async (req, res) => {
	const user = await User.findOne({ email: req.body.email });
	const otp = req.body.otp;

	if (!otp) {
		res.status(400).json({ message: "Please Enter OTP" });
	} else {
		if (Date.now() > otpExpiry) {
			res.status(400).json({ message: "OTP Expired, Please Try Again" });
		} else {
			if (user.passwordResetOTP === otp) {
				user.passwordResetOTP = "";
				await user.save();
				otpExpiry = null;
				res.status(200).json({ message: "OTP Verified" });
			} else {
				res.status(400).json({ message: "Invalid OTP" });
			}
		}
	}
});

// @desc Reset Password
// @route POST /user/resetPassword
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
	const user = await User.findOne({ email: req.body.email });
	const { newPassword, confirmPassword } = req.body;

	if (!newPassword || !confirmPassword) {
		res.status(400).json({ message: "Enter All Fields" });
	} else if (newPassword !== confirmPassword) {
		res.status(400).json({ message: "Passwords Don't Match" });
	} else if (!passwordValidator(newPassword)) {
		res.status(400).json({
			message:
				"Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one digit",
		});
	} else {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		user.password = hashedPassword;
		await user.save();
		res.status(200).json({ message: "Password Has Been Reset" });
	}
});

module.exports = {
	// Admin Functions
	createAdmin,
	createUser,
	getUsers,
	deleteUser,

	loginUser,
	getUserInfo,
	deleteUserProfile,
	updateUserProfile,
	changePassword,
	requestOTP,
	verifyOTP,
	resetPassword,
	getPetInfo,
	updatePetProfile,
	deletePetProfile,
	createVaccinationCard,
	getVaccinationCard,
	addVaccination,
	renewVaccination,
	deleteVaccination,

	createOwner,
	getOwnerInfo,
	getOwner,
	getOwnerPets,
	updateOwnerProfile,
	deleteOwnerProfile,

	createPet,
};
