// Imports
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const User = require("../models/SystemModels/userModel");
const Owner = require("../models/CustomerModels/ownerModel");
const Pet = require("../models/CustomerModels/petModel");
const VaccinationCard = require("../models/CustomerModels/vaccinationModel");
const HealthRecord = require("../models/CustomerModels/healthRecordModel");

// ----------------------------------------------------------------
// Global Variables

let otpExpiry;

// ----------------------------------------------------------------
// Helper Functions

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "1d",
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
	try {
		const user = req.user;

		if (!user.role === "admin") {
			res.status(400).json({ message: "غير مصرح: ليس الأدمن" });
			return;
		} else {
			const {
				username,
				email,
				firstName,
				lastName,
				password,
				confirmPassword,
				role,
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
				res.status(400).json({ message: "يرجى إدخال جميع الحقول" });
				return;
			}

			// Validate email format using a regular expression
			if (!emailValidator(email)) {
				res.status(400).json({ message: "البريد الإلكتروني غير صحيحة" });
				return;
			}

			// Password requirements
			if (!passwordValidator(password)) {
				res.status(400).json({
					message:
						"يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، بما في ذلك حرف كبير واحد، وحرف صغير واحد، ورقم واحد",
				});
				return;
			}

			// Validation Checks
			const usernameExists = await User.findOne({ username });
			const emailExists = await User.findOne({ email });

			if (usernameExists) {
				res
					.status(400)
					.json({ message: "اسم المستخدم مأخوذ، يرجى تجربة اسم آخر" });
				return;
			} else if (emailExists) {
				res
					.status(400)
					.json({ message: "يوجد مستخدم بهذا البريد الإلكتروني بالفعل" });
				return;
			} else if (password !== confirmPassword) {
				res.status(400).json({ message: "كلمات المرور غير متطابقة" });
				return;
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			const user = await User.create({
				username,
				email,
				firstName,
				lastName,
				password: hashedPassword,
				role,
			});

			if (user) {
				res.status(200).json({
					message: "User Created Successfully",
					_id: user.id,
					username: user.username,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					role: user.role,
				});
			} else {
				res.status(400).json({ message: "Invalid User Data" });
				return;
			}
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Create A New Admion
// @route POST /user/createAdmin
// @access Private
const createAdmin = asyncHandler(async (req, res) => {
	try {
		if (!req.user.role === "admin") {
			res.status(400).json({ message: "غير مصرح: ليس لديك صلاحيات الأدمن" });
			return;
		}

		req.body.role = "admin";

		// Call the createUser function with isAdmin set to true
		await createUser(req, res, () => {}, {
			...req.body,
			role: "admin",
		});
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Create A New Veterinarian
// @route POST /user/createVet
// @access Private
const createVet = asyncHandler(async (req, res) => {
	try {
		if (!req.user.role === "admin") {
			res.status(400).json({ message: "غير مصرح: ليس الأدمن" });
			return;
		}

		req.body.role = "vet";

		await createUser(req, res, () => {}, {
			...req.body,
			role: "vet",
		});
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Create A New Secretary
// @route POST /user/createSecretary
// @access Private
const createSecretary = asyncHandler(async (req, res) => {
	try {
		if (!req.user.role === "admin") {
			res.status(400).json({ message: "غير مصرح: ليس الأدمن" });
			return;
		}

		req.body.role = "secretary";

		await createUser(req, res, () => {}, {
			...req.body,
			role: "secretary",
		});
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Set user as admin
// @route PATCH /user/setAdmin/:userId
// @access Private
const setAdmin = asyncHandler(async (req, res) => {
	try {
		if (!req.user.role === "admin") {
			res.status(400).json({ message: "غير مصرح: ليس لديك صلاحيات الأدمن" });
			return;
		}

		const { userId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			res.status(400).json({ message: "Invalid User ID" });
			return;
		}

		const user = await User.findById(userId);

		if (!user) {
			res.status(400).json({ message: "المستخدم غير موجود" });
			return;
		}

		if (user.role === "admin") {
			res.status(400).json({ message: "المستخدم هو أدمن بالفعل" });
			return;
		}

		user.role = "admin";
		await user.save();

		res.status(200).json({ message: "تم تغيير دور المستخدم إلى أدمن" });
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Set user as vet
// @route PATCH /user/setVet/:userId
// @access Private
const setVet = asyncHandler(async (req, res) => {
	try {
		if (!req.user.role === "admin") {
			res.status(400).json({ message: "غير مصرح: ليس لديك صلاحيات الأدمن" });
			return;
		}

		const { userId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			res.status(400).json({ message: "Invalid User ID" });
			return;
		}
		const user = await User.findById(userId);

		if (!user) {
			res.status(400).json({ message: "المستخدم غير موجود" });
			return;
		}

		if (user.role === "vet") {
			res.status(400).json({ message: "المستخدم هو طبيب بيطري بالفعل" });
			return;
		}

		user.role = "vet";

		await user.save();

		res.status(200).json({ message: "تم تغيير دور المستخدم إلى طبيب بيطري" });
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Set user as secretary
// @route PATCH /user/setSecretary/:userId
// @access Private
const setSecretary = asyncHandler(async (req, res) => {
	try {
		if (!req.user.role === "admin") {
			res.status(400).json({ message: "غير مصرح: ليس لديك صلاحيات الأدمن" });
			return;
		}

		const { userId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			res.status(400).json({ message: "Invalid User ID" });
			return;
		}

		const user = await User.findById(userId);

		if (!user) {
			res.status(400).json({ message: "المستخدم غير موجود" });
			return;
		}

		if (user.role === "secretary") {
			res.status(400).json({ message: "المستخدم هو سكرتير بالفعل" });
			return;
		}

		user.role = "secretary";

		await user.save();

		res.status(200).json({ message: "تم تغيير دور المستخدم إلى سكرتير" });
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Get Users (Except Logged In User)
// @route POST /user/getUsers
// @access Private
const getUsers = asyncHandler(async (req, res) => {
	try {
		if (req.user.role === "admin") {
			const { fullName, username, email } = req.body;
			let query = { username: { $ne: req.user.username } };

			if (fullName) {
				query.fullName = new RegExp(fullName, "i");
			}
			if (username) {
				query.username = new RegExp(username, "i");
			}
			if (email) {
				query.email = new RegExp(email, "i");
			}

			const users = await User.find(query);

			if (users.length > 0) {
				res.status(200).json({
					message: "Users Retrieved",
					users,
				});
			} else {
				res.status(400).json({ message: "لم يتم العثور على مستخدمين!" });
			}
		} else {
			res.status(400).json({ message: "غير مصرح: ليس لديك صلاحيات الأدمن" });
		}
	} catch (error) {
		res.status(500);
		throw new Error(error.message);
	}
});

// @desc Delete A User
// @route DELETE /user/deleteUser/:userId
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
	try {
		if (req.user.role === "admin") {
			const userId = req.params.userId;

			if (!mongoose.Types.ObjectId.isValid(userId)) {
				res.status(400).json({ message: "Invalid User ID" });
				return;
			}

			const deleted = await User.findByIdAndDelete(userId);

			if (deleted) {
				res.status(200).json({ message: "تم حذف المستخدم بنجاح" });
			} else {
				res
					.status(400)
					.json({ message: "User Not Found, Please Check User ID Provided" });
				return;
			}
		} else {
			res.status(400).json({ message: "غير مصرح: ليس لديك صلاحيات الأدمن" });
			return;
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Get User Info
// @route GET /user/getUserInfo/:userId
// @access Private
const getUserInfoById = asyncHandler(async (req, res) => {
	try {
		if (req.user.role === "admin") {
			const userId = req.params.userId;

			if (!mongoose.Types.ObjectId.isValid(userId)) {
				res.status(400).json({ message: "Invalid User ID" });
				return;
			}

			const user = await User.findById(userId).select("-password");

			if (user) {
				res.status(200).json({
					message: "User Retrieved Successfully",
					user: user,
				});
			} else {
				res.status(400).json({ message: "المستخدم غير موجود" });
				return;
			}
		} else {
			res.status(400).json({ message: "غير مصرح: ليس لديك صلاحيات الأدمن" });
			return;
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// ----------------------------------------------------------------
// General User Roles

// @desc Update User Credentials
// @route PATCH /user/updateProfile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
	try {
		const { username, email, password, passwordResetOTP, role } = req.body;

		if (password || passwordResetOTP || role) {
			res.status(400).json({ message: "Cannot Do That, Nice Try Though ;)" });
			return;
		}

		if (!emailValidator(email)) {
			res.status(400).json({ message: "البريد الإلكتروني غير صحيح" });
			return;
		}

		if (username === "") {
			res.status(400).json({ message: "اسم المستخدم لا يمكن أن يكون فارغًا" });
			return;
		}

		// Check if the updated username is already taken by another user
		if (username) {
			const usernameExists = await User.findOne({
				_id: { $ne: req.user._id }, // Exclude the current user from the search
				username,
			});

			if (usernameExists) {
				res.status(400).json({ message: "اسم المستخدم مأخوذ بالفعل" });
				return;
			}
		}

		// Check if the updated email is already taken by another user
		if (email) {
			const emailExists = await User.findOne({
				_id: { $ne: req.user._id }, // Exclude the current user from the search
				email,
			});

			if (emailExists) {
				res.status(400).json({ message: "البريد الإلكتروني مستخدم بالفعل" });
				return;
			}
		}

		const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body);

		if (updatedUser) {
			res.status(200).json({ message: "تم تحديث المستخدم بنجاح" });
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Delete User
// @route DELETE /user/deleteUser
// @access Private
const deleteUserProfile = asyncHandler(async (req, res) => {
	try {
		const { confirm } = req.body;

		if (confirm !== "CONFIRM") {
			res.status(400).json({ message: "يرجى إدخال 'CONFIRM'" });
		} else {
			const deleted = await User.findByIdAndDelete(req.user._id);

			if (deleted) {
				res.status(200).json({ message: "تم حذف المستخدم بنجاح" });
			} else {
				res.status(400).json({ message: "User Not Found" });
				return;
			}
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Login User
// @route POST /user/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			res.status(400).json({ message: "يرجى إدخال جميع الحقول" });
		}

		const user = await User.findOne({ username: username });

		if (!user) {
			res.status(400).json({ message: "اسم المستخدم غير صحيح" });
		} else {
			if (await bcrypt.compare(password, user.password)) {
				let token = generateToken(user._id);
				res.cookie("token", token, {
					httpOnly: true,
					secure: true,
					sameSite: "none",
				});
				res.status(200).json({
					message: "تم تسجيل الدخول بنجاح",
					token: token,
					role: user.role,
					userId: user._id,
				});
			} else {
				res.status(400).json({ message: "كلمة المرور غير صحيحة" });
			}
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Logout User
// @route POST /user/logout
// @access Private
const logoutUser = asyncHandler(async (req, res) => {
	try {
		res
			.clearCookie("token")
			.status(200)
			.json({ message: "تم تسجيل الخروج بنجاح" });
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Get User Info
// @route GET /user/getUserInfo
// @access Private
const getUserInfo = asyncHandler(async (req, res) => {
	try {
		const user = req.user;

		if (user) {
			res.status(200).json({
				message: "User Retrieved Successfully",
				_id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				username: user.username,
				role: user.role,
			});
		} else {
			res.status(400).json({ message: "المستخدم غير موجود" });
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Get Secretary Notifications
// @route GET /user/getSecretaryNotifications
// @access Private
const getSecretaryNotifications = asyncHandler(async (req, res) => {
	try {
		if (req.user.role === "secretary") {
			const user = await User.findById(req.user._id)
				.select("notifications")
				.exec();
			if (user.notifications.length > 0) {
				res.status(200).json({
					message: "تم استرجاع الإشعارات بنجاح",
					notifications: user.notifications,
				});
			} else {
				res.status(400).json({ message: "لم يتم العثور على إشعارات!" });
				return;
			}
		} else {
			res.status(400).json({ message: "غير مصرح: ليس لديك صلاحيات السكرتير" });
			return;
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Create New Owner
// @route POST /user/createOwner
// @access Private
const createOwner = asyncHandler(async (req, res) => {
	const { fullName, mobileNumber, email, gender, receiveNotifications } =
		req.body;

	if (!fullName || !mobileNumber || !gender || !receiveNotifications) {
		res.status(400).json({ message: "يرجى إدخال جميع الحقول" });
		return;
	}

	try {
		// Check if the email or mobileNumber already exist in the database
		const existingOwner = await Owner.findOne({
			$or: [{ email }, { mobileNumber }],
		});

		if (existingOwner) {
			res.status(400).json({
				message: "يوجد مالك بالفعل بهذا البريد الإلكتروني أو رقم الهاتف",
			});
			return;
		}

		// Check if email inputted
		if (!email) {
			req.body.email = "––";
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

			res
				.status(200)
				.json({ message: "تم إنشاء المالك بنجاح", ownerId: owner._id });
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Get Owner Information
// @route GET /user/getOwnerInfo/:ownerId
// @access Private
const getOwnerInfo = asyncHandler(async (req, res) => {
	try {
		const ownerId = req.params.ownerId;

		if (!mongoose.Types.ObjectId.isValid(ownerId)) {
			res.status(400).json({ message: "Invalid Owner ID" });
			return;
		}

		const owner = await Owner.findById(ownerId).populate("pets");

		if (owner) {
			res.status(200).json(owner);
		} else {
			res.status(400).json({ message: "لم يتم العثور على المالك!" });
			return;
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Get Owner
// @route POST /user/getOwner/
// @access Private
const getOwner = asyncHandler(async (req, res) => {
	const { fullName, mobileNumber, email } = req.body;
	try {
		let query = {};

		if (fullName) {
			query.fullName = new RegExp(fullName, "i");
		}
		if (mobileNumber) {
			query.mobileNumber = new RegExp(mobileNumber, "i");
		}
		if (email) {
			query.email = new RegExp(email, "i");
		}

		const owner = await Owner.find(query).populate("pets");

		if (owner.length > 0) {
			res.status(200).json(owner);
		} else {
			res.status(400).json({ message: "لم يتم العثور على مالكين!" });
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Get Owner Pets
// @route GET /user/getOwnerPets/:ownerId
// @access Private
const getOwnerPets = asyncHandler(async (req, res) => {
	try {
		const ownerId = req.params.ownerId;

		if (!mongoose.Types.ObjectId.isValid(ownerId)) {
			res.status(400).json({ message: "Invalid User ID" });
			return;
		}

		const owner = await Owner.findById(ownerId).populate("pets");

		if (!owner) {
			res.status(400).json({ message: "لم يتم العثور على المالك!" });
			return;
		} else if (owner.pets.length > 0) {
			res.status(200).json({
				message: "Retrieved Owner Pets Successfuly",
				pets: owner.pets,
			});
		} else {
			res.status(400).json({ message: "لم يتم العثور على حيوانات أليفة!" });
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Update Owner Information
// @route PATCH /user/updateOwner/:ownerId
// @access Private
const updateOwnerProfile = asyncHandler(async (req, res) => {
	try {
		const ownerId = req.params.ownerId;

		if (!mongoose.Types.ObjectId.isValid(ownerId)) {
			res.status(400).json({ message: "Invalid User ID" });
			return;
		}

		const {
			fullName,
			mobileNumber,
			email,
			gender,
			preferredContactMethod,
			receiveNotifications,
		} = req.body;

		// Check if there was no data entered
		if (
			!fullName &&
			!mobileNumber &&
			!email &&
			!gender &&
			!preferredContactMethod &&
			!receiveNotifications
		) {
			res.status(400).json({ message: "يرجى إدخال أي بيانات للتحديث" });
			return;
		}

		const updatedOwner = await Owner.findByIdAndUpdate(ownerId, req.body);

		if (updatedOwner) {
			res.status(200).json({ message: "تم تحديث بيانات المالك بنجاح" });
		} else {
			res.status(400).json({ message: "Owner Not Found!" });
			return;
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Add Pet To Owner
// @route POST /user/addPetToOwner/:ownerId/:petId
// @access Private
const addPetToOwner = asyncHandler(async (req, res) => {
	try {
		const ownerId = req.params.ownerId;

		if (!mongoose.Types.ObjectId.isValid(ownerId)) {
			res.status(400).json({ message: "Invalid Owner ID" });
			return;
		}

		const petId = req.params.petId;

		if (!mongoose.Types.ObjectId.isValid(petId)) {
			res.status(400).json({ message: "Invalid Pet ID" });
			return;
		}

		const owner = await Owner.findById(ownerId);

		if (!owner) {
			res.status(400).json({ message: "لم يتم العثور على المالك!" });
			return;
		}

		const pet = await Pet.findById(petId);

		if (!pet) {
			res.status(400).json({ message: "لم يتم العثور على الحيوان الأليف!" });
			return;
		}

		// Check if the pet is already associated with the owner
		if (owner.pets.includes(petId)) {
			res.status(400).json({ message: "الحيوان الأليف مرتبط بالفعل بالمالك" });
			return;
		}

		owner.pets.push(petId);
		await owner.save();

		pet.owners.push(ownerId);
		await pet.save();

		res.status(200).json({ message: "Pet Added To Owner", owner: owner });
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Remove Pet From Owner
// @route DELETE /user/removePetFromOwner/:ownerId/:petId
// @access Private
const removePetFromOwner = asyncHandler(async (req, res) => {
	try {
		const ownerId = req.params.ownerId;

		if (!mongoose.Types.ObjectId.isValid(ownerId)) {
			res.status(400).json({ message: "Invalid Owner ID" });
			return;
		}

		const petId = req.params.petId;

		if (!mongoose.Types.ObjectId.isValid(petId)) {
			res.status(400).json({ message: "Invalid Pet ID" });
			return;
		}

		const owner = await Owner.findById(ownerId);

		if (!owner) {
			res.status(400).json({ message: "لم يتم العثور على المالك!" });
			return;
		}

		const pet = await Pet.findById(petId);

		if (!pet) {
			res.status(400).json({ message: "Pet Not Found!" });
			return;
		}

		// Check if the pet is associated with the owner
		if (!owner.pets.includes(petId)) {
			res.status(400).json({ message: "Pet Not Associated With Owner" });
			return;
		}

		// Remove the pet from the owner's pets array
		const index = owner.pets.indexOf(petId);
		if (index !== -1) {
			owner.pets.splice(index, 1);
			await owner.save();
		}

		// Remove the owner from the pet's owners array
		const ownerIndex = pet.owners.indexOf(ownerId);
		if (ownerIndex !== -1) {
			pet.owners.splice(ownerIndex, 1);
			await pet.save();
		}

		res.status(200).json({
			message: "تم إزالة الحيوان الأليف من المالك",
			ownerId: owner._id,
			petId: pet._id,
		});
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Delete Owner
// @route DELETE /user/deleteOwner/:ownerId
// @access Private
const deleteOwnerProfile = asyncHandler(async (req, res) => {
	try {
		const ownerId = req.params.ownerId;

		if (!mongoose.Types.ObjectId.isValid(ownerId)) {
			res.status(400).json({ message: "Invalid User ID" });
			return;
		}

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

		if (deletedOwner) {
			res.status(200).json({ message: "تم إزالة المالك من النظام" });
		}
	} catch (error) {
		res.status(500);
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

		// TODO: Update weight classes and age according to animal
		if (pet.age < 1) {
			pet.ageClass = "Puppy/Kitten";
		} else if (pet.age >= 1 && pet.age < 5) {
			pet.ageClass = "Adult";
		} else {
			pet.ageClass = "Senior";
		}

		if (pet.weight < 2.2) {
			pet.weightClass = "Extra Small";
		} else if (pet.weight >= 2.2 && pet.weight < 5.4) {
			pet.weightClass = "Small";
		} else if (pet.weight >= 5.4 && pet.weight < 11.3) {
			pet.weightClass = "Medium";
		} else if (pet.weight >= 11.3 && pet.weight < 36.2) {
			pet.weightClass = "Large";
		} else {
			pet.weightClass = "Extra Large";
		}

		pet.save();

		// Associate the pet with each owner
		for (const ownerId of ownerIds) {
			const owner = await Owner.findById(ownerId);
			owner.pets.push(pet._id);
			await owner.save();
		}

		res.status(200).json({ message: "Pet Created Successfully", pet: pet });
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Get Pet
// @route GET /user/getPet
// @access Private
const getPet = asyncHandler(async (req, res) => {
	const { name, type, breed, gender } = req.body;
	try {
		let query = {};

		if (name) {
			query.name = new RegExp(name, "i");
		}
		if (type) {
			query.type = new RegExp(type, "i");
		}
		if (breed) {
			query.breed = new RegExp(breed, "i");
		}
		if (gender) {
			query.gender = gender;
		}

		const pet = await Pet.find(query).populate("owners");

		if (pet.length > 0) {
			res.status(200).json(pet);
		} else {
			res.status(400).json({ message: "لم يتم العثور على حيوانات أليفة!" });
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Get Pet Information
// @route GET /user/getPetInfo/:petId
// @access Private
const getPetInfo = asyncHandler(async (req, res) => {
	try {
		const petId = req.params.petId;

		if (!mongoose.Types.ObjectId.isValid(petId)) {
			res.status(400).json({ message: "Invalid Pet ID" });
			return;
		}

		const pet = await Pet.findById(petId).populate({
			path: "owners",
			select: "fullName mobileNumber email",
		});

		if (!pet) {
			res.status(400).json({ message: "Pet Not Found!" });
			return;
		} else {
			res
				.status(200)
				.json({ message: "Gotten Pet Successfuly", pet: pet, petAge: pet.age });
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Update Pet Information
// @route PATCH /user/updatePet/:petId
// @access Private
const updatePetProfile = asyncHandler(async (req, res) => {
	try {
		const petId = req.params.petId;

		if (!mongoose.Types.ObjectId.isValid(petId)) {
			res.status(400).json({ message: "Invalid User ID" });
			return;
		}

		const updatedPet = await Pet.findByIdAndUpdate(petId, req.body);

		if (updatedPet) {
			res.status(200).json({ message: "تم تحديث بيانات الحيوان الأليف بنجاح" });
		} else {
			res.status(400).json({ message: "Pet Not Found!" });
			return;
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Delete Pet
// @route DELETE /user/deletePet/:petId
// @access Private
const deletePetProfile = asyncHandler(async (req, res) => {
	try {
		const petId = req.params.petId;

		if (!mongoose.Types.ObjectId.isValid(petId)) {
			res.status(400).json({ message: "Invalid User ID" });
			return;
		}

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
			res
				.status(200)
				.json({ message: "تم حذف الحيوان الأليف بنجاح", petId: pet._id });
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Create New Vaccination Card
// @route POST /user/createVaccinationCard/:petId
// @access Private
const createVaccinationCard = asyncHandler(async (req, res) => {
	try {
		const petId = req.params.petId;

		if (!mongoose.Types.ObjectId.isValid(petId)) {
			res.status(400).json({ message: "Invalid Pet ID" });
			return;
		}

		const pet = await Pet.findById(petId);

		if (!pet) {
			res.status(400).json({ message: "Pet Not Found" });
			return;
		}

		const vaccinationCardExists = await VaccinationCard.findOne({
			pet: pet._id,
		});

		if (vaccinationCardExists) {
			res
				.status(400)
				.json({ message: "الحيوان الأليف لديه بطاقة تطعيم بالفعل" });
			return;
		}

		const { vaccineName, vaccineBatch, vaccineGivenDate, vaccineRenewalDate } =
			req.body;

		if (!vaccineName || !vaccineBatch || !vaccineGivenDate) {
			res.status(400).json({ message: "يرجى إدخال جميع الحقول" });
			return;
		}

		const vaccinationCard = await VaccinationCard.create({
			pet: pet._id,
			vaccine: {
				vaccineName,
				vaccineBatch,
				vaccineGivenDate,
				vaccineRenewalDate,
			},
		});

		if (vaccinationCard) {
			res.status(200).json({ message: "تم إنشاء بطاقة التطعيم بنجاح" });
		} else {
			res.status(400).json({ message: "Invalid Data" });
			return;
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Delete Pet Vaccination Card
// @route DELETE /user/deleteVaccinationCard/:petId
// @access Private
const deleteVaccinationCard = asyncHandler(async (req, res) => {
	const { petId } = req.params;

	try {
		if (!mongoose.Types.ObjectId.isValid(petId)) {
			res.status(400).json({ message: "Invalid Pet ID" });
			return;
		}

		const pet = await Pet.findById(petId);

		if (!pet) {
			res.status(400).json({ message: "Pet Not Found" });
			return;
		}

		const vaccinationCard = await VaccinationCard.findOne({ pet: pet._id });

		if (!vaccinationCard) {
			res.status(400).json({ message: "الحيوان الأليف ليس لديه بطاقة تطعيم" });
			return;
		}

		await VaccinationCard.findByIdAndDelete(vaccinationCard._id);

		res.status(200).json({ message: "تم حذف بطاقة التطعيم بنجاح" });
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Get Pet Vaccination Card
// @route GET /user/getVaccinationCard/:petId
// @access Private
const getVaccinationCard = asyncHandler(async (req, res) => {
	try {
		const petId = req.params.petId;

		if (!mongoose.Types.ObjectId.isValid(petId)) {
			res.status(400).json({ message: "Invalid User ID" });
			return;
		}

		const pet = await Pet.findById(petId);

		if (!pet) {
			res.status(400).json({ message: "Pet Not Found" });
			return;
		}

		const vaccinationCard = await VaccinationCard.findOne({ pet: petId });

		if (!vaccinationCard) {
			res.status(400).json({ message: "الحيوان الأليف ليس لديه بطاقة تطعيم" });
			return;
		} else {
			res.status(200).json({
				message: "Retrieved Vaccination Card Successfuly",
				vaccinationCard,
				pet,
			});
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Add To Pet Vaccination Card
// @route POST /user/addVaccination/:petId
// @access Private
const addVaccination = asyncHandler(async (req, res) => {
	try {
		const petId = req.params.petId;

		if (!mongoose.Types.ObjectId.isValid(petId)) {
			res.status(400).json({ message: "Invalid User ID" });
			return;
		}

		const pet = await Pet.findById(req.params.petId);

		if (!pet) {
			res.status(400).json({ message: "Pet Not Found" });
			return;
		}

		const vaccinationCard = await VaccinationCard.findOne({ pet: pet._id });

		if (!vaccinationCard) {
			res.status(400).json({
				message:
					"Pet Does Not Have A Vaccination Card, Please Create One First",
			});
		}

		const { vaccineName, vaccineBatch, vaccineGivenDate } = req.body;

		if (!vaccineName || !vaccineBatch || !vaccineGivenDate) {
			res.status(400).json({ message: "يرجى إدخال جميع الحقول" });
			return;
		} else {
			vaccinationCard.vaccine.push(req.body);
			await vaccinationCard.save();
			res.status(200).json({ message: "تم إضافة التطعيم بنجاح" });
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
		const petId = req.params.petId;

		if (!mongoose.Types.ObjectId.isValid(petId)) {
			res.status(400).json({ message: "Invalid Pet ID" });
			return;
		}

		const vaccinationId = req.params.vaccinationId;

		if (!mongoose.Types.ObjectId.isValid(vaccinationId)) {
			res.status(400).json({ message: "Invalid Vaccination ID" });
			return;
		}

		const pet = await Pet.findById(petId);

		if (!pet) {
			res.status(400).json({ message: "Pet not found" });
			return;
		}

		const vaccinationCard = await VaccinationCard.findOne({ pet: pet._id });

		if (!vaccinationCard) {
			res
				.status(400)
				.json({ message: "Vaccination card not found for the pet" });
			return;
		}

		const vaccinationIndex = vaccinationCard.vaccine.findIndex(
			(vaccine) => vaccine._id.toString() === vaccinationId
		);

		if (vaccinationIndex === -1) {
			res.status(400).json({ message: "Vaccination not found" });
			return;
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

		res.status(200).json({ message: "تم تجديد التطعيم بنجاح" });
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Delete Pet Vaccination
// @route DELETE /user/deleteVaccination/:petId/:vaccinationId
// @access Private
const deleteVaccination = asyncHandler(async (req, res) => {
	try {
		const petId = req.params.petId;

		if (!mongoose.Types.ObjectId.isValid(petId)) {
			res.status(400).json({ message: "Invalid Pet ID" });
			return;
		}

		const vaccinationId = req.params.vaccinationId;

		if (!mongoose.Types.ObjectId.isValid(vaccinationId)) {
			res.status(400).json({ message: "Invalid Vaccination ID" });
			return;
		}

		const pet = await Pet.findById(petId);

		if (!pet) {
			res.status(400).json({ message: "Pet not found" });
			return;
		}

		const vaccinationCard = await VaccinationCard.findOne({ pet: pet._id });

		if (!vaccinationCard) {
			res
				.status(400)
				.json({ message: "Vaccination card not found for the pet" });
			return;
		}

		const vaccinationIndex = vaccinationCard.vaccine.findIndex(
			(vaccine) => vaccine._id.toString() === vaccinationId
		);

		if (vaccinationIndex === -1) {
			res.status(400).json({ message: "Vaccination not found" });
			return;
		}

		// Remove the vaccination from the array
		vaccinationCard.vaccine.splice(vaccinationIndex, 1);

		// Save the updated vaccination card
		await vaccinationCard.save();

		res.status(200).json({ message: "تم حذف التطعيم بنجاح" });
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Upload Health Record
// @route POST /user/uploadHealthRecord/:petId
// @access Private
const uploadHealthRecord = asyncHandler(async (req, res) => {
	const { petId } = req.params;

	try {
		if (!mongoose.Types.ObjectId.isValid(petId)) {
			res.status(400).json({ message: "Invalid Pet ID" });
			return;
		}

		const pet = await Pet.findById(petId);

		if (!pet) {
			res.status(400).json({ message: "Pet Not Found" });
			return;
		}

		if (!req.file) {
			res.status(400).json({ message: "يرجى تحميل ملف" });
			return;
		}

		const healthRecord = await HealthRecord.create({
			filename: req.file.originalname,
			data: req.file.buffer,
			contentType: req.file.mimetype,
			pet: pet._id,
		});

		if (healthRecord) {
			res
				.status(200)
				.json({ message: "تم رفع السجل الصحي بنجاح", healthRecord });
		} else {
			res.status(400).json({ message: "Invalid Data" });
			return;
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Get All Pet Health Records
// @route GET /user/getAllHealthRecords/:petId
// @access Private
const getAllHealthRecords = asyncHandler(async (req, res) => {
	const { petId } = req.params;
	const pet = await Pet.findById(petId);

	try {
		const healthRecords = await HealthRecord.find({ pet: pet._id });

		if (!healthRecords) {
			res.status(400).json({ message: "Health Records Not Found" });
			return;
		} else {
			res.status(200).json({
				message: "تم استرجاع السجلات الصحية بنجاح",
				healthRecords,
			});
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Download Health Record
// @route GET /user/downloadHealthRecord/:petId/:healthRecordId
// @access Private
const downloadHealthRecord = asyncHandler(async (req, res) => {
	const { petId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(petId)) {
		res.status(400).json({ message: "Invalid Pet ID" });
		return;
	}

	const pet = await Pet.findById(petId);

	if (!pet) {
		res.status(400).json({ message: "Pet Not Found" });
		return;
	}

	const { healthRecordId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(healthRecordId)) {
		res.status(400).json({ message: "Invalid Health Record ID" });
		return;
	}

	try {
		const healthRecord = await HealthRecord.findOne({
			_id: healthRecordId,
			pet: pet._id,
		});

		if (!healthRecord) {
			res.status(400).json({ message: "Health Record Not Found" });
			return;
		} else {
			res.setHeader(
				"Content-Disposition",
				`attachment; filename="${healthRecord.filename}"`
			);
			res.setHeader("Content-Type", `${healthRecord.contentType}`);
			res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
		}

		res.status(200).send(healthRecord.data);
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Delete Health Record
// @route DELETE /user/deleteHealthRecord/:healthRecordId
// @access Private
const deleteHealthRecord = asyncHandler(async (req, res) => {
	const { healthRecordId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(healthRecordId)) {
		res.status(400).json({ message: "Invalid Health Record ID" });
		return;
	}

	try {
		const healthRecord = await HealthRecord.findByIdAndDelete(healthRecordId);

		if (!healthRecord) {
			res.status(400).json({ message: "Health Record Not Found" });
			return;
		} else {
			res.status(200).json({ message: "تم حذف السجل الصحي بنجاح" });
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Change Password
// @route POST /user/changePassword
// @access Private
const changePassword = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		const { oldPassword, newPassword, confirmPassword } = req.body;

		if (!oldPassword || !newPassword || !confirmPassword) {
			res.status(400).json({ message: "Enter All Fields" });
			return;
		}

		if (!(await bcrypt.compare(oldPassword, user.password))) {
			res.status(400).json({ message: "Invalid Password" });
			return;
		} else if (await bcrypt.compare(newPassword, user.password)) {
			res.status(400).json({
				message:
					"لا يمكن أن تكون كلمة المرور الجديدة هي نفسها كلمة المرور القديمة",
			});
			return;
		} else if (newPassword !== confirmPassword) {
			res.status(400).json({ message: "كلمات المرور غير متطابقة" });
			return;
		} else if (!passwordValidator(newPassword)) {
			res.status(400).json({
				message:
					"يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، بما في ذلك حرف كبير واحد، وحرف صغير واحد، ورقم واحد",
			});
			return;
		} else {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(newPassword, salt);

			user.password = hashedPassword;
			await user.save();
			res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });
			req.user = null;
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Forgot Username
// @route POST /user/forgotUsername
// @access Public
const forgotUsername = asyncHandler(async (req, res) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		res.status(400).json({ message: "User Not Found!" });
		return;
	} else {
		try {
			const transporter = nodemailer.createTransport({
				service: "Gmail",
				secure: true,
				auth: {
					user: "omarelzaher93@gmail.com",
					pass: "ifrijtiwsdnqnlbk",
				},
			});

			const mailOptions = {
				from: "omarelzaher93@gmail.com",
				to: user.email,
				subject: "[NO REPLY] Your Username Request",
				html: `<h1>Hello, Dr. ${user.lastName}.</h1>
				<h2> Your username is <b>${user.username}</b>.</h2>
				<p>If you did not request to retrieve your username, you can safely disregard this message.</p>
				<p>This Is An Automated Message, Please Do Not Reply.</p>`,
			};

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					res.status(500);
					throw new Error("Failed to Send Username Email.");
				} else {
					res.status(200).json({
						message: "تم إرسال اسم المستخدم، يرجى التحقق من بريدك الإلكتروني",
					});
				}
			});
		} catch (error) {
			res.status(500);
			throw new Error(error);
		}
	}
});

// @desc Request OTP
// @route POST /user/requestOTP
// @access Public
const requestOTP = asyncHandler(async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			res.status(400).json({ message: "User Not Found!" });
			return;
		} else {
			const otp = generateOTP();
			user.passwordResetOTP = otp;
			await user.save();
			otpExpiry = new Date();
			otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

			const transporter = nodemailer.createTransport({
				service: "Gmail",
				secure: true,
				auth: {
					user: "omarelzaher93@gmail.com",
					pass: "ifrijtiwsdnqnlbk",
				},
			});

			const mailOptions = {
				from: "omarelzaher93@gmail.com",
				to: user.email,
				subject: "[NO REPLY] Your Password Reset Request",
				html: `<h1>You have requested to reset your password.<h1>
                <p>Your OTP is ${otp}<p>
                <p>Your OTP will expire in 5 MINUTES<p>
                <p>If you did not request to reset your password, you can safely disregard this message.<p>
                <p>This Is An Automated Message, Please Do Not Reply.<p>`,
			};

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					res.status(500);
					throw new Error("Failed to Send OTP Email.");
				} else {
					res
						.status(200)
						.json({ message: "تم إرسال OTP، يرجى التحقق من بريدك الإلكتروني" });
				}
			});
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Verify OTP
// @route POST /user/verifyOTP
// @access Public
const verifyOTP = asyncHandler(async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		const otp = req.body.otp;

		if (!otp) {
			res.status(400).json({ message: "يرجى إدخال OTP" });
			return;
		} else {
			if (Date.now() > otpExpiry) {
				res
					.status(400)
					.json({ message: "انتهت صلاحية OTP، يرجى المحاولة مرة أخرى" });
				return;
			} else {
				if (user.passwordResetOTP === otp) {
					user.passwordResetOTP = "";
					await user.save();
					otpExpiry = null;
					res.status(200).json({ message: "تم التحقق من OTP بنجاح" });
				} else {
					res.status(400).json({ message: "OTP غير صحيح" });
					return;
				}
			}
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

// @desc Reset Password
// @route POST /user/resetPassword
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		const { newPassword, confirmPassword } = req.body;

		if (!newPassword || !confirmPassword) {
			res.status(400).json({ message: "يرجى إدخال جميع الحقول" });
			return;
		} else if (newPassword !== confirmPassword) {
			res.status(400).json({ message: "كلمات المرور غير متطابقة" });
			return;
		} else if (!passwordValidator(newPassword)) {
			res.status(400).json({
				message:
					"يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، بما في ذلك حرف كبير واحد، وحرف صغير واحد، ورقم واحد",
			});
			return;
		} else {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(newPassword, salt);

			user.password = hashedPassword;
			await user.save();
			res.status(200).json({ message: "تم إعادة تعيين كلمة المرور بنجاح" });
		}
	} catch (error) {
		res.status(500);
		throw new Error(error);
	}
});

module.exports = {
	createAdmin,
	createUser,
	createVet,
	createSecretary,
	getUsers,
	setAdmin,
	setVet,
	setSecretary,
	getUserInfoById,
	deleteUser,

	uploadHealthRecord,
	downloadHealthRecord,
	getAllHealthRecords,
	deleteHealthRecord,

	loginUser,
	logoutUser,
	getUserInfo,
	getSecretaryNotifications,
	deleteUserProfile,
	updateUserProfile,
	changePassword,
	forgotUsername,
	requestOTP,
	verifyOTP,
	resetPassword,
	getPet,
	addPetToOwner,
	getPetInfo,
	updatePetProfile,
	deletePetProfile,
	createVaccinationCard,
	deleteVaccinationCard,
	removePetFromOwner,
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
