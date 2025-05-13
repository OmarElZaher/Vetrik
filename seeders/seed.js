const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "../.env" });

// Import your models
const User = require("../models/SystemModels/userModel");
const Owner = require("../models/CustomerModels/ownerModel");
const Pet = require("../models/CustomerModels/petModel");
const HealthRecord = require("../models/CustomerModels/healthRecordModel");
const Vaccination = require("../models/CustomerModels/vaccinationModel");
const Case = require("../models/SystemModels/caseModel");

// Connect to MongoDB
mongoose
	.connect(
		"mongodb+srv://omar:omar@modernvetclinic.wsalpkd.mongodb.net/ModernVetDB?retryWrites=true&w=majority&appName=ModernVetClinic"
	)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Could not connect to MongoDB", err));

// Sample data for seeding
const users = [
	{
		username: "admin",
		password: "Aa123456",
		email: "admin@admin.com",
		role: "admin",
		firstName: "Admin",
		lastName: "User",
		phone: "1234567890",
	},
	{
		username: "vet1",
		password: "Vv123456",
		email: "vet1@modernvet.com",
		role: "vet",
		firstName: "John",
		lastName: "Doe",
		phone: "1234567891",
	},
	{
		username: "secretary1",
		password: "Ss123456",
		email: "secretary1@modernvet.com",
		role: "secretary",
		firstName: "Jane",
		lastName: "Smith",
		phone: "1234567892",
	},
];

const owners = [
	{
		firstName: "Michael",
		lastName: "Johnson",
		fullName: "Michael Johnson",
		email: "michael@example.com",
		phone: "5551234567",
		mobileNumber: "5551234567",
		address: "123 Main St",
		gender: "male", // Changed to lowercase
		preferredContactMethod: "phone", // Changed to lowercase
		receiveNotifications: true, // Added required field
	},
	{
		firstName: "Sarah",
		lastName: "Williams",
		fullName: "Sarah Williams",
		email: "sarah@example.com",
		phone: "5559876543",
		mobileNumber: "5559876543",
		address: "456 Oak Ave",
		gender: "female", // Changed to lowercase
		preferredContactMethod: "email", // Changed to lowercase
		receiveNotifications: true, // Added required field
	},
];

const pets = [
	{
		name: "Max",
		species: "Dog",
		breed: "Golden Retriever",
		age: 3,
		gender: "male",
		weight: 30,
		type: "dog", // Changed to match the enum values in the schema
		dob: new Date("2020-05-15"),
		// Will link to owner after creation
	},
	{
		name: "Luna",
		species: "Cat",
		breed: "Siamese",
		age: 2,
		gender: "female",
		weight: 4.5,
		type: "cat", // Changed to match the enum values in the schema
		dob: new Date("2021-03-10"),
		// Will link to owner after creation
	},
];

// Seed data function
async function seedDatabase() {
	try {
		// Clear existing data
		await User.deleteMany({});
		await Owner.deleteMany({});
		await Pet.deleteMany({});
		await HealthRecord.deleteMany({});
		await Vaccination.deleteMany({});
		await Case.deleteMany({});

		console.log("Cleared existing data");

		// Seed users
		const createdUsers = [];
		for (const user of users) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(user.password, salt);

			const newUser = await User.create({
				...user,
				password: hashedPassword,
			});

			createdUsers.push(newUser);
		}
		console.log(`Seeded ${createdUsers.length} users`);

		// Seed owners
		const createdOwners = await Owner.insertMany(owners);
		console.log(`Seeded ${createdOwners.length} owners`);

		// Seed pets with owner references
		const petsWithOwners = pets.map((pet, index) => ({
			...pet,
			owners: [createdOwners[index % createdOwners.length]._id], // Changed to owners array
		}));

		const createdPets = await Pet.insertMany(petsWithOwners);
		console.log(`Seeded ${createdPets.length} pets`);

		// Update owners with pet references
		for (let i = 0; i < createdPets.length; i++) {
			const petId = createdPets[i]._id;
			const ownerId = createdOwners[i % createdOwners.length]._id;

			// Add this pet to the owner's pets array
			await Owner.findByIdAndUpdate(
				ownerId,
				{ $push: { pets: petId } },
				{ new: true }
			);
		}
		console.log(`Updated owners with pet references`);

		// Create some health records
		const healthRecords = [
			{
				filename: "max_annual_checkup.pdf",
				data: Buffer.from("Sample health record content for Max"), // Simplified for demo
				contentType: "application/pdf",
				pet: createdPets[0]._id,
			},
			{
				filename: "luna_skin_treatment.pdf",
				data: Buffer.from(
					"Sample health record content for Luna's skin condition"
				), // Simplified for demo
				contentType: "application/pdf",
				pet: createdPets[1]._id,
			},
		];

		const createdRecords = await HealthRecord.insertMany(healthRecords);
		console.log(`Seeded ${createdRecords.length} health records`);

		// Create some vaccinations
		const vaccinationCards = [
			{
				pet: createdPets[0]._id,
				vaccine: [
					{
						vaccineName: "Rabies",
						vaccineBatch: "RB12345",
						vaccineGivenDate: new Date(),
						vaccineRenewalDate: new Date(
							Date.now() + 365 * 24 * 60 * 60 * 1000
						), // 1 year from now
					},
					{
						vaccineName: "Distemper",
						vaccineBatch: "DT67890",
						vaccineGivenDate: new Date(),
						vaccineRenewalDate: new Date(
							Date.now() + 730 * 24 * 60 * 60 * 1000
						), // 2 years from now
					},
				],
			},
			{
				pet: createdPets[1]._id,
				vaccine: [
					{
						vaccineName: "Rabies",
						vaccineBatch: "RB54321",
						vaccineGivenDate: new Date(),
						vaccineRenewalDate: new Date(
							Date.now() + 365 * 24 * 60 * 60 * 1000
						), // 1 year from now
					},
					{
						vaccineName: "Feline Distemper (Panleukopenia)",
						vaccineBatch: "FD98765",
						vaccineGivenDate: new Date(),
						vaccineRenewalDate: new Date(
							Date.now() + 365 * 24 * 60 * 60 * 1000
						), // 1 year from now
					},
				],
			},
		];

		const createdVaccinationCards = await mongoose
			.model("VaccinationCard")
			.insertMany(vaccinationCards);
		console.log(
			`Seeded ${
				createdVaccinationCards.length
			} vaccination cards with ${createdVaccinationCards.reduce(
				(total, card) => total + card.vaccine.length,
				0
			)} vaccines`
		);

		// Create some cases
		const cases = [
			{
				petId: createdPets[0]._id,
				secretaryId: createdUsers.find((u) => u.role === "secretary")._id,
				vetId: createdUsers.find((u) => u.role === "vet")._id,
				reasonForVisit: "Annual wellness exam",
				actionsTaken: "Performed physical examination, administered vaccines",
				status: "completed",
			},
			{
				petId: createdPets[1]._id,
				secretaryId: createdUsers.find((u) => u.role === "secretary")._id,
				vetId: createdUsers.find((u) => u.role === "vet")._id,
				reasonForVisit: "Skin rash and itching",
				actionsTaken: "Prescribed antihistamines and medicated shampoo",
				status: "completed",
			},
			{
				petId: createdPets[0]._id,
				secretaryId: createdUsers.find((u) => u.role === "secretary")._id,
				reasonForVisit: "Limping on right front leg",
				status: "waiting",
			},
			{
				petId: createdPets[1]._id,
				secretaryId: createdUsers.find((u) => u.role === "secretary")._id,
				vetId: createdUsers.find((u) => u.role === "vet")._id,
				reasonForVisit: "Follow-up on skin condition",
				status: "in-progress",
			},
		];

		const createdCases = await Case.insertMany(cases);
		console.log(`Seeded ${createdCases.length} cases`);

		console.log("Database seeding completed successfully");
	} catch (error) {
		console.error("Error seeding database:", error);
	} finally {
		mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

// Run the seeder
seedDatabase();
