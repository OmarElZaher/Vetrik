// React Imports
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import {
	Box,
	Button,
	Card,
	CardBody,
	FormControl,
	Icon,
	Input,
	Table,
	TableContainer,
	Th,
	Thead,
	Tr,
	Td,
	Tbody,
	Text,
	Tooltip,
	Select,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import { FaRegEdit } from "react-icons/fa";
import { IoMdEye, IoMdAdd, IoMdArrowRoundBack } from "react-icons/io";
import { TbTrashXFilled } from "react-icons/tb";

// Custom Component Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

function titleCase(str) {
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

export default function OwnerDetails() {
	const { ownerId } = useParams();
	const toast = useToast();
	const navigate = useNavigate();

	// Owner useState
	const [owner, setOwner] = useState({});

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);
	const [gotData, setGotData] = useState(false);
	const [error, setError] = useState(null);

	// Add Pet Form useStates
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [breed, setBreed] = useState("");
	const [gender, setGender] = useState("");
	const [dob, setDob] = useState(null);

	const handleRemovePet = async (petId) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this pet?"
		);

		if (confirmDelete) {
			try {
				setIsLoading(true);

				const response = await axios.delete(
					`${api}/user/removePetFromOwner/${owner._id}/${petId}`,
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

					setOwner((prev) => ({
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

	const handleDeleteOwner = async () => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this owner?"
		);

		if (confirmDelete) {
			try {
				setIsLoading(true);
				const response = await axios.delete(
					`${api}/user/deleteOwner/${owner._id}`,
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
					owners: [owner._id],
					name: name,
					type: type,
					breed: breed,
					gender: gender,
					dob: dob,
				};

				const response = await axios.post(`${api}/user/createPet`, formData, {
					withCredentials: true,
				});

				if (response.status === 200) {
					toast({
						title: response.data.message,
						status: "success",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
					setOwner((prev) => ({
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

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(
					`${api}/user/getOwnerInfo/${ownerId}`,
					{
						withCredentials: true,
					}
				);
				if (response.status === 200) {
					setOwner(response.data);
					setGotData(true);
				} else {
					setError(response.data.message);
					toast({
						title: response.data.message,
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
			} catch (error) {
				setError(error.response.data.message);
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
		fetchData();
	}, [ownerId, toast]);

	return isLoading ? (
		<Spinner />
	) : error ? (
		<>
			<Box
				display={"flex"}
				flexDirection={"column"}
				justifyContent={"center"}
				alignItems={"center"}
				bg={"#F3F3F3"}
				height={"87vh"}
			>
				<Text fontWeight={"bold"} fontSize={"60px"} color={"red"}>
					ERROR
				</Text>
				<Text fontSize={"40px"} textDecoration={"underline"}>
					{error}
				</Text>
				<Button
					_hover={{
						bg: "yellowgreen",
						color: "#000",
						transform: "scale(1.01)",
					}}
					_active={{
						transform: "scale(0.99)",
						opacity: "0.5",
					}}
					onClick={() => {
						navigate("/search-owner");
					}}
					leftIcon={<IoMdArrowRoundBack />}
					bg={"#FFF"}
					width={"25vw"}
					mt={10}
				>
					Go Back To Search
				</Button>
			</Box>
			<Footer />
		</>
	) : gotData ? (
		<>
			<Box
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				width={"100vw"}
				height={"87vh"}
			>
				{/* Owner Information */}
				<Card width='60vw' height='80vh' mt={15} mr={2}>
					<CardBody
						display={"flex"}
						flexDirection={"column"}
						justifyContent={"center"}
					>
						<Box
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							height={"15%"}
							mb={2}
						>
							<Box width={"33%"} />

							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"33%"}
								height={"100%"}
							>
								<Text
									fontSize={"30px"}
									fontWeight={"bold"}
									textDecoration={"underline"}
								>{`${titleCase(owner.firstName)} ${titleCase(
									owner.lastName
								)}`}</Text>
							</Box>

							<Box
								display={"flex"}
								justifyContent={"flex-end"}
								alignItems={"center"}
								width={"33%"}
								height={"90%"}
								mr={5}
							>
								<Text
									onClick={() => {
										navigate(`/edit-owner/${owner._id}`);
									}}
									_hover={{
										color: "yellowgreen",
										textDecoration: "underline",
									}}
									_active={{
										transform: "scale(0.99)",
										opacity: "0.5",
									}}
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									cursor={"pointer"}
									fontSize={"20x"}
								>
									<Icon as={FaRegEdit} mr={1.5} />
									Edit Profile
								</Text>
							</Box>
						</Box>
						<hr />
						<Box
							display={"flex"}
							justifyContent={"space-evenly"}
							height={"15%"}
							my={2}
						>
							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"33%"}
								m={2}
								p={2}
							>
								<Text fontSize={"24px"} fontWeight={"bold"}>
									Email
								</Text>
								<Text fontSize={"20px"}>{owner.email}</Text>
							</Box>
							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"33%"}
								m={2}
							>
								<Text fontSize={"24px"} fontWeight={"bold"}>
									Mobile Number
								</Text>
								<Text fontSize={"20px"}>{owner.mobileNumber}</Text>
							</Box>

							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"33%"}
								m={2}
								p={2}
							>
								<Text fontSize={"24px"} fontWeight={"bold"}>
									Contact Method
								</Text>
								<Text fontSize={"20px"}>
									{owner.preferredContactMethod === "both"
										? "Phone & Email"
										: owner.preferredContactMethod === "neither"
										? "None"
										: titleCase(owner.preferredContactMethod)}
								</Text>
							</Box>
						</Box>

						{/* Pets Table */}
						<Box
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
							alignItems={"center"}
							height={"60%"}
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
										{owner.pets.map((pet) => (
											<Tr key={pet._id}>
												<Td textAlign={"left"}>{titleCase(pet.name)}</Td>
												<Td textAlign={"center"}>{titleCase(pet.type)}</Td>
												<Td textAlign={"center"}>{titleCase(pet.breed)}</Td>
												<Td textAlign={"center"}>{titleCase(pet.gender)}</Td>
												<Td textAlign={"center"}>
													<Button
														_hover={{
															bg: "yellowgreen",
															color: "#000",
															transform: "scale(1.01)",
														}}
														_active={{
															transform: "scale(0.99)",
															opacity: "0.5",
														}}
														onClick={() => {
															navigate(`/pet-details/${pet._id}`);
														}}
														leftIcon={<IoMdEye />}
														mr={2.5}
													>
														View
													</Button>

													<Tooltip
														hasArrow
														label='Removes Pet from Owner Profile'
														bg={"#EF5350"}
														placement='top'
														openDelay={75}
													>
														<Button
															_hover={{
																bg: "#EF5350",
																color: "#000",
																transform: "scale(1.01)",
															}}
															_active={{
																transform: "scale(0.99)",
																opacity: "0.5",
															}}
															onClick={() => {
																handleRemovePet(pet._id);
															}}
															variant={"outline"}
															borderColor={"#EF5350"}
															leftIcon={<TbTrashXFilled />}
															ml={2.5}
														>
															Remove
														</Button>
													</Tooltip>
												</Td>
											</Tr>
										))}
									</Tbody>
								</Table>
							</TableContainer>
						</Box>

						{/* Back, Delete Button */}
						<Box
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							height={"10%"}
						>
							<Button
								onClick={() => {
									if (localStorage.getItem("ownerFilterData")) {
										navigate("/owner-table");
									} else {
										navigate("/search-owner");
									}
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
								width={"40%"}
								mr={2.5}
							>
								Filtered Owners Table
							</Button>
							<Tooltip
								hasArrow
								label='Deletes Owner From System'
								bg={"#EF5350"}
								placement='top'
								openDelay={75}
							>
								<Button
									_hover={{
										bg: "#EF5350",
										color: "#000",
										transform: "scale(1.01)",
									}}
									_active={{
										transform: "scale(0.99)",
										opacity: "0.5",
									}}
									onClick={handleDeleteOwner}
									leftIcon={<TbTrashXFilled />}
									variant={"outline"}
									borderColor={"#EF5350"}
									width={"25%"}
									ml={2.5}
								>
									Delete
								</Button>
							</Tooltip>
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
						<Box display={"flex"} justifyContent={"center"} height={"15%"}>
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
								{" (not already registered) "}
								pet to this owner, please enter all details of the pet.
							</Text>
						</Box>
						<Box
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
							alignItems={"center"}
							height={"60%"}
							p={2}
							mb={2}
						>
							<FormControl id='name' mb={5}>
								<Input
									id='name'
									type='text'
									name='name'
									placeholder='Pet Name'
									value={name}
									onChange={(e) => {
										setName(e.target.value);
									}}
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
									id='type'
									name='type'
									placeholder='Type of Animal'
									cursor={"pointer"}
									value={type}
									onChange={(e) => {
										setType(e.target.value);
									}}
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
									id='breed'
									type='text'
									name='breed'
									placeholder='Breed of Animal'
									value={breed}
									onChange={(e) => {
										setBreed(e.target.value);
									}}
									ml={2}
								/>
							</FormControl>
							<FormControl id='gender' mb={5}>
								<Select
									id='gender'
									name='gender'
									placeholder='Select Gender'
									cursor={"pointer"}
									value={gender}
									onChange={(e) => {
										setGender(e.target.value);
									}}
								>
									<option value='Male'>Male</option>
									<option value='Female'>Female</option>
								</Select>
							</FormControl>
							<FormControl id='dob'>
								<Input
									id='dob'
									type='date'
									name='dob'
									placeholder='Date of Birth'
									value={dob}
									onChange={(e) => {
										setDob(e.target.value);
									}}
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
								_hover={{
									bg: "yellowgreen",
									color: "#000",
									transform: "scale(1.01)",
								}}
								_active={{
									transform: "scale(0.99)",
									opacity: "0.5",
								}}
								onClick={handleAddPet}
								leftIcon={<IoMdAdd />}
								width={"25%"}
							>
								Add
							</Button>
						</Box>
					</CardBody>
				</Card>
			</Box>
			<Footer />
		</>
	) : (
		<></>
	);
}
