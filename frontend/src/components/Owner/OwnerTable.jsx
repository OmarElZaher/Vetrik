import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
	Box,
	Button,
	Card,
	CardBody,
	FormControl,
	Input,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Select,
	Text,
	useToast,
} from "@chakra-ui/react";

import { IoMdEye, IoMdAdd, IoMdArrowRoundBack } from "react-icons/io";
import { TbTrashXFilled } from "react-icons/tb";

import Spinner from "../General/Spinner";
import Footer from "../General/Footer";

function titleCase(str) {
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

export default function OwnerTable() {
	const navigate = useNavigate();
	const toast = useToast();
	const data = localStorage.getItem("ownerFilterData");
	const [isLoading, setIsLoading] = useState(false);
	const [viewDetailsPressed, setViewDetailsPressed] = useState(false);
	const [ownerData, setOwnerData] = useState(null);

	// Add Pet Details
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [breed, setBreed] = useState("");
	const [gender, setGender] = useState("");
	const [dob, setDob] = useState(null);

	const handleViewDetails = async (id) => {
		setViewDetailsPressed(true);
		try {
			setIsLoading(true);
			const response = await axios.get(
				`http://localhost:1234/user/getOwnerInfo/${id}`,
				{ withCredentials: true }
			);

			if (response.status === 200) {
				setOwnerData(response.data);
			} else {
				toast({
					title: response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: error.response.data.message,
				status: "error",
				duration: 2500,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddPet = async () => {
		try {
			setIsLoading(true);

			if (
				name === "" ||
				type === "" ||
				breed === "" ||
				gender === "" ||
				dob === null
			) {
				toast({
					title: "Please Enter All Fields",
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			} else {
				const formData = {
					owners: [ownerData._id],
					name: name,
					type: type,
					breed: breed,
					gender: gender,
					dob: dob,
				};

				const response = await axios.post(
					"http://localhost:1234/user/createPet",
					formData,
					{
						withCredentials: true,
					}
				);

				if (response.status === 200) {
					toast({
						title: response.data.message,
						status: "success",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
					setOwnerData((prev) => ({
						...prev,
						pets: prev.pets.concat(response.data.pet),
					}));
					setName("");
					setType("");
					setBreed("");
					setGender("");
					setDob(null);
				} else {
					toast({
						title: response.data.message,
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
			}
		} catch (error) {
			toast({
				title: error.response.data.message,
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeletePet = async (petId) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this pet?"
		);

		if (confirmDelete) {
			try {
				setIsLoading(true);

				const response = await axios.delete(
					`http://localhost:1234/user/deletePet/${petId}`,
					{
						withCredentials: true,
					}
				);

				if (response.status === 200) {
					toast({
						title: response.data.message,
						status: "success",
						duration: 2500,
						isClosable: true,
						position: "top",
					});

					setOwnerData((prev) => ({
						...prev,
						pets: prev.pets.filter((pet) => pet._id !== response.data.petId),
					}));
				} else {
					toast({
						title: response.data.message,
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
			} catch (error) {
				toast({
					title: error.response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleDeleteOwner = async (ownerId) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this owner?"
		);

		if (confirmDelete) {
			try {
				setIsLoading(true);
				const response = await axios.delete(
					`http://localhost:1234/user/deleteOwner/${ownerId}`,
					{
						withCredentials: true,
					}
				);

				if (response.status === 200) {
					toast({
						title: response.data.message,
						status: "success",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
					navigate("/search-owner");
				} else {
					toast({
						title: response.data.message,
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
			} catch (error) {
				toast({
					title: error.response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handleTypeChange = (e) => {
		setType(e.target.value);
	};

	const handleBreedChange = (e) => {
		setBreed(e.target.value);
	};

	const handleGenderChange = (e) => {
		setGender(e.target.value);
		console.log("GENDER ==>", gender);
	};

	const handleDobChange = (e) => {
		setDob(e.target.value);
	};

	if (data === null) {
		return (
			<>
				<Box
					display={"flex"}
					flexDirection={"column"}
					justifyContent={"center"}
					alignItems={"center"}
					height={"100vh"}
				>
					<Text fontWeight={"bold"} fontSize={"60px"} color={"red"}>
						NOT FOUND
					</Text>
					<Text fontSize={"25px"} textDecoration={"underline"}>
						Please Search For An Owner Before Accessing This Page
					</Text>
					<Button
						onClick={() => {
							navigate("/search-owner");
						}}
						_hover={{
							bg: "yellowgreen",
							color: "#000",
							transform: "scale(1.01)",
						}}
						_active={{
							transform: "scale(0.99)",
							opacity: "0.5",
						}}
						mt={10}
						width={"25vw"}
					>
						Go Back To Search
					</Button>
				</Box>
			</>
		);
	} else {
		return isLoading ? (
			<Spinner />
		) : viewDetailsPressed ? (
			<>
				<Box
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
					width={"100vw"}
					height={"100vh"}
				>
					{/* Owner Information */}
					<Card width='60vw' height='80vh' mt={15} mr={2}>
						<CardBody
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
						>
							<Box
								mb={2}
								height={"15%"}
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
							>
								<Text
									fontSize={"30px"}
									fontWeight={"bold"}
									textDecoration={"underline"}
								>{`${titleCase(ownerData.firstName)} ${titleCase(
									ownerData.lastName
								)}`}</Text>
							</Box>
							<hr />
							<Box
								height={"15%"}
								mb={2}
								display={"flex"}
								justifyContent={"space-evenly"}
							>
								<Box
									width={"33%"}
									m={2}
									p={2}
									display={"flex"}
									flexDirection={"column"}
									justifyContent={"center"}
									alignItems={"center"}
								>
									<Text fontSize={"24px"} fontWeight={"bold"}>
										Email
									</Text>
									<Text fontSize={"20px"}>{ownerData.email}</Text>
								</Box>
								<Box
									width={"33%"}
									m={2}
									display={"flex"}
									flexDirection={"column"}
									justifyContent={"center"}
									alignItems={"center"}
								>
									<Text fontSize={"24px"} fontWeight={"bold"}>
										Mobile Number
									</Text>
									<Text fontSize={"20px"}>{ownerData.mobileNumber}</Text>
								</Box>
							</Box>

							{/* Pets Table */}
							<Box
								height={"60%"}
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
							>
								<Text fontSize={"24px"} fontWeight={"bold"}>
									Pets
								</Text>
								<TableContainer
									width={"92%"}
									maxHeight={"30vh"}
									overflowY={"auto"}
								>
									<Table variant='simple' size='md'>
										<Thead>
											<Th textAlign={"left"}>Name</Th>
											<Th textAlign={"center"}>Type</Th>
											<Th textAlign={"center"}>Breed</Th>
											<Th textAlign={"center"}>Gender</Th>
											<Th textAlign={"center"}>Actions</Th>
										</Thead>
										<Tbody>
											{ownerData.pets.map((pet) => (
												<Tr key={pet._id}>
													<Td textAlign={"left"}>{pet.name}</Td>
													<Td textAlign={"center"}>{pet.type}</Td>
													<Td textAlign={"center"}>{pet.breed}</Td>
													<Td textAlign={"center"}>{pet.gender}</Td>
													<Td textAlign={"center"}>
														<Button
															onClick={() => {
																navigate(`/pet-details/${pet._id}`);
															}}
															_hover={{
																bg: "yellowgreen",
																color: "#000",
																transform: "scale(1.01)",
															}}
															_active={{
																transform: "scale(0.99)",
																opacity: "0.5",
															}}
															mr={1.5}
															leftIcon={<IoMdEye />}
														>
															View
														</Button>

														<Button
															variant={"outline"}
															borderColor={"#EF5350"}
															onClick={() => {
																handleDeletePet(pet._id);
															}}
															_hover={{
																bg: "#EF5350",
																color: "#000",
																transform: "scale(1.01)",
															}}
															_active={{
																transform: "scale(0.99)",
																opacity: "0.5",
															}}
															ml={1.5}
															leftIcon={<TbTrashXFilled />}
														>
															Delete
														</Button>
													</Td>
												</Tr>
											))}
										</Tbody>
									</Table>
								</TableContainer>
							</Box>

							{/* Back Button */}
							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								height={"10%"}
							>
								<Button
									width={"25%"}
									mr={2.5}
									onClick={() => {
										window.location.reload();
									}}
									_hover={{
										bg: "yellowgreen",
										color: "#000",
										transform: "scale(1.01)",
									}}
									_active={{
										transform: "scale(0.99)",
										opacity: "0.5",
									}}
									leftIcon={<IoMdArrowRoundBack />}
								>
									Back To Filter
								</Button>
								<Button
									width={"25%"}
									variant={"outline"}
									borderColor={"#EF5350"}
									ml={2.5}
									onClick={() => {
										handleDeleteOwner(ownerData._id);
									}}
									_hover={{
										bg: "#EF5350",
										color: "#000",
										transform: "scale(1.01)",
									}}
									_active={{
										transform: "scale(0.99)",
										opacity: "0.5",
									}}
									leftIcon={<TbTrashXFilled />}
								>
									Delete Owner Profile
								</Button>
							</Box>
						</CardBody>
					</Card>

					{/* Add a pet */}
					<Card width='35vw' height='80vh' mt={15} ml={2}>
						<CardBody
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
						>
							<Box height={"15%"} display={"flex"} justifyContent={"center"}>
								<Text
									fontSize={"30px"}
									fontWeight={"bold"}
									textDecor={"underline"}
								>
									Add A Pet
								</Text>
							</Box>
							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								height={"15%"}
							>
								<Text fontSize={"20px"} textAlign={"center"}>
									To register a{" "}
									<Text
										fontSize={"20px"}
										display={"inline"}
										textDecoration={"underline"}
										fontWeight={"bold"}
									>
										NEW
									</Text>
									{"* (not already registered) "}
									pet to this owner, please enter all details of the pet.
								</Text>
							</Box>
							<Box
								height={"60%"}
								p={2}
								mb={2}
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
							>
								<FormControl id='name' mb={5}>
									<Input
										type='text'
										name='name'
										placeholder='Pet Name'
										value={name}
										onChange={handleNameChange}
										mb={1.25}
									/>
								</FormControl>

								<FormControl
									id='type'
									display={"flex"}
									justifyContent={"space-evenly"}
									mb={5}
								>
									<Select
										name='type'
										cursor={"pointer"}
										placeholder='Type of Animal'
										value={type}
										onChange={handleTypeChange}
										mr={2}
									>
										<option value='Dog'>Dog</option>
										<option value='Cat'>Cat</option>
										<option value='Bird'>Bird</option>
										<option value='Turtle'>Turtle</option>
										<option value='Monkey'>Monkey</option>
										<option value='Hamster'>Hamster</option>
										<option value='Fish'>Fish</option>
									</Select>

									<Input
										type='text'
										name='breed'
										placeholder='Breed of Animal'
										value={breed}
										onChange={handleBreedChange}
										ml={2}
									/>
								</FormControl>
								<FormControl id='gender' mb={5}>
									<Select
										name='gender'
										cursor={"pointer"}
										placeholder='Select Gender'
										value={gender}
										onChange={handleGenderChange}
									>
										<option value='Male'>Male</option>
										<option value='Female'>Female</option>
									</Select>
								</FormControl>
								<FormControl id='dob'>
									<Input
										type='date'
										name='dob'
										placeholder='Date of Birth'
										value={dob}
										onChange={handleDobChange}
									/>
								</FormControl>
							</Box>

							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								height={"10%"}
							>
								<Button
									onClick={handleAddPet}
									_hover={{
										bg: "yellowgreen",
										color: "#000",
										transform: "scale(1.01)",
									}}
									_active={{
										transform: "scale(0.99)",
										opacity: "0.5",
									}}
									width={"25%"}
									leftIcon={<IoMdAdd />}
								>
									Add
								</Button>
							</Box>
						</CardBody>
					</Card>
				</Box>
			</>
		) : (
			<>
				<Box width={"100%"} height={"90vh"}>
					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						flexDirection={"column"}
						my={5}
						height={"15%"}
					>
						<Text
							fontSize={"35px"}
							color={"#121211"}
							fontWeight={500}
							textDecoration={"underline"}
						>
							Owners Found
						</Text>
					</Box>
					<Box
						display={"flex"}
						flexDirection={"column"}
						justifyContent={"center"}
						alignItems={"center"}
						width={"100%"}
						height={"70%"}
					>
						<TableContainer width={"80%"} maxHeight={"70vh"} overflowY={"auto"}>
							<Table variant='simple' size='md'>
								<Thead>
									<Tr>
										<Th textAlign={"left"}>Full Name</Th>
										<Th textAlign={"center"}>Email</Th>
										<Th textAlign={"center"}>Mobile Number</Th>
										<Th textAlign={"right"}>View Details</Th>
									</Tr>
								</Thead>
								<Tbody>
									{JSON.parse(data).map((row) => (
										<Tr key={data._id}>
											<Td textAlign={"left"}>{`${titleCase(
												row.firstName
											)} ${titleCase(row.lastName)}`}</Td>
											<Td textAlign={"center"}>{row.email}</Td>
											<Td textAlign={"center"}>{row.mobileNumber}</Td>
											<Td textAlign={"right"}>
												<Button
													onClick={() => {
														handleViewDetails(row._id);
													}}
													_hover={{
														bg: "yellowgreen",
														color: "#000",
														transform: "scale(1.01)",
													}}
													_active={{
														transform: "scale(0.99)",
														opacity: "0.5",
													}}
													leftIcon={<IoMdEye />}
												>
													View
												</Button>
											</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						</TableContainer>
					</Box>
					<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
						<Button
							onClick={() => {
								localStorage.removeItem("ownerFilterData");
								navigate("/search-owner");
							}}
							_hover={{
								bg: "yellowgreen",
								color: "#000",
								transform: "scale(1.01)",
							}}
							_active={{
								transform: "scale(0.99)",
								opacity: "0.5",
							}}
							my={10}
							width={"25vw"}
							leftIcon={<IoMdArrowRoundBack />}
						>
							Back To Search
						</Button>
					</Box>
				</Box>
				<Footer />
			</>
		);
	}
}
