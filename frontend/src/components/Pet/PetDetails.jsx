import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import {
	Box,
	Button,
	Card,
	CardBody,
	Tooltip,
	Table,
	TableContainer,
	Thead,
	Tbody,
	Th,
	Td,
	Tr,
	Text,
	FormControl,
	Input,
	useToast,
} from "@chakra-ui/react";

import { IoMdEye, IoMdArrowRoundBack, IoMdAdd } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import { MdDelete } from "react-icons/md";

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

function formatDate(date) {
	const d = new Date(date);
	let month = "" + (d.getMonth() + 1);
	let day = "" + d.getDate();
	let year = d.getFullYear();

	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;

	return [day, month, year].join("-");
}

function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export default function PetDetails() {
	const { petId } = useParams();
	const navigate = useNavigate();
	const toast = useToast();
	const [pet, setPet] = useState({});
	const [petAge, setPetAge] = useState("");
	const [owner, setOwner] = useState(null);
	const [ownerEmail, setOwnerEmail] = useState(null);

	const [isLoading, setIsLoading] = useState(false);
	const [gotData, setGotData] = useState(false);
	const [error, setIsError] = useState(null);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(
				`http://localhost:1234/user/getPetInfo/${petId}`,
				{
					withCredentials: true,
				}
			);
			if (response.status === 200) {
				setPetAge(response.data.petAge);
				setPet(response.data.pet);
				setGotData(true);
			} else {
				setIsError(response.data.message);
				toast({
					title: response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			}
		} catch (error) {
			setIsError(error.response.data.message);
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
		fetchData();
	}, []);

	const handleRemovePetFromOwner = async (ownerId, petId) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to remove this owner from this pet?"
		);
		if (confirmDelete) {
			try {
				setIsLoading(true);
				const response = await axios.delete(
					`http://localhost:1234/user/removePetFromOwner/${ownerId}/${petId}`,
					{ withCredentials: true }
				);

				if (response.status === 200) {
					toast({
						title: response.data.message,
						status: "success",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
					setPet((prev) => ({
						...prev,
						owners: prev.owners.filter(
							(owner) => owner._id !== response.data.ownerId
						),
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

	const handleDeletePet = async (petId) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this pet?"
		);
		if (confirmDelete) {
			try {
				setIsLoading(true);
				const response = await axios.delete(
					`http://localhost:1234/user/deletePet/${petId}`,
					{ withCredentials: true }
				);

				if (response.status === 200) {
					toast({
						title: response.data.message,
						status: "success",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
					navigate("/search-pet");
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

	const handleAddOwnerToPet = async (ownerId, petId) => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				`http://localhost:1234/user/addPetToOwner/${ownerId}/${petId}`,
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
				setPet((prev) => ({
					...prev,
					owners: prev.owners.concat(response.data.owner),
				}));
				setOwner(null);
				setOwnerEmail(null);
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
	};

	return isLoading ? (
		<Spinner />
	) : error ? (
		<>
			<Box
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				flexDirection={"column"}
				height={"87vh"}
				bg={"#F3F3F3"}
			>
				<Text fontWeight={"bold"} fontSize={"60px"} color={"red"}>
					ERROR
				</Text>
				<Text fontSize={"40px"} textDecoration={"underline"}>
					{error}
				</Text>
				<Button
					onClick={() => {
						navigate("/search-pet");
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
					bg={"#FFF"}
					mt={10}
					width={"25vw"}
				>
					Go Back To Search
				</Button>
			</Box>
			<Footer />
		</>
	) : gotData ? (
		<>
			<>
				<Box
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
					width={"100vw"}
					height={"100vh"}
				>
					{/* Pet Information */}
					<Card width='70vw' height='80vh' mt={15} mr={1}>
						<CardBody
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
						>
							<Box
								height={"15%"}
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
							>
								<Text
									fontSize={"30px"}
									fontWeight={"bold"}
									textDecoration={"underline"}
								>
									{pet.name}
								</Text>
							</Box>
							<hr />
							<Box
								height={"15%"}
								marginTop={"5%"}
								mb={2}
								display={"flex"}
								justifyContent={"space-evenly"}
							>
								<Box
									width={"25%"}
									m={2}
									p={2}
									display={"flex"}
									flexDirection={"column"}
									justifyContent={"center"}
									alignItems={"center"}
								>
									<Text fontSize={"24px"} fontWeight={"bold"}>
										Type of Animal
									</Text>
									<Text fontSize={"20px"}>{pet.type}</Text>
								</Box>

								<Box
									width={"25%"}
									m={2}
									display={"flex"}
									flexDirection={"column"}
									justifyContent={"center"}
									alignItems={"center"}
								>
									<Text fontSize={"24px"} fontWeight={"bold"}>
										Breed
									</Text>
									<Text fontSize={"20px"}>{pet.breed}</Text>
								</Box>

								<Box
									width={"25%"}
									m={2}
									display={"flex"}
									flexDirection={"column"}
									justifyContent={"center"}
									alignItems={"center"}
								>
									<Text fontSize={"24px"} fontWeight={"bold"}>
										Date of Birth
									</Text>
									<Text fontSize={"20px"}>{formatDate(pet.dob)}</Text>
								</Box>

								<Box
									width={"25%"}
									m={2}
									display={"flex"}
									flexDirection={"column"}
									justifyContent={"center"}
									alignItems={"center"}
								>
									<Text fontSize={"24px"} fontWeight={"bold"}>
										Age
									</Text>
									<Text fontSize={"20px"}>{petAge}</Text>
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
									Owners
								</Text>
								<TableContainer
									width={"92%"}
									maxHeight={"30vh"}
									overflowY={"auto"}
								>
									<Table variant='simple' size='md'>
										<Thead>
											<Th textAlign={"left"}>Full Name</Th>
											<Th textAlign={"center"}>Email</Th>
											<Th textAlign={"center"}>Mobile Number</Th>
											<Th textAlign={"center"}>View Details</Th>
										</Thead>
										<Tbody>
											{pet.owners.map((owner) => (
												<Tr key={owner._id}>
													<Td textAlign={"left"}>{`${titleCase(
														owner.firstName
													)} ${titleCase(owner.lastName)}`}</Td>
													<Td textAlign={"center"}>{owner.email}</Td>
													<Td textAlign={"center"}>{owner.mobileNumber}</Td>
													<Td textAlign={"center"}>
														<Button
															onClick={() => {
																navigate(`/owner-details/${owner._id}`);
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
															mr={2.5}
															leftIcon={<IoMdEye />}
														>
															View
														</Button>
														<Tooltip
															hasArrow
															label='Removes Owner from Pet Profile'
															bg={"#EF5350"}
															placement='top'
															openDelay={75}
														>
															<Button
																variant={"outline"}
																borderColor={"#EF5350"}
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
																	handleRemovePetFromOwner(owner._id, pet._id);
																}}
																mr={2.5}
																leftIcon={<MdDelete />}
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

							{/* Back Button */}
							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								height={"10%"}
							>
								<Button
									width={"40%"}
									onClick={() => {
										if (localStorage.getItem("petFilterData")) {
											navigate("/pet-table");
										} else {
											navigate("/search-pet");
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
									mr={2.5}
								>
									Filtered Pets Table
								</Button>

								<Tooltip
									hasArrow
									label='Deletes Pet From System'
									bg={"#EF5350"}
									placement='top'
									openDelay={75}
								>
									<Button
										width={"25%"}
										variant={"outline"}
										borderColor={"#EF5350"}
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
											handleDeletePet(pet._id);
										}}
										leftIcon={<MdDelete />}
										ml={1.5}
									>
										Delete
									</Button>
								</Tooltip>
							</Box>
						</CardBody>
					</Card>
					<Card width={"25vw"} height={"80vh"} mt={15} ml={1}>
						<CardBody
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
						>
							<Box
								height={"15%"}
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
							>
								<Text
									fontSize={"30px"}
									fontWeight={"bold"}
									textDecor={"underline"}
								>
									Add Existing Owner
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
									To add existing owner to this pet, please filter by owner
									email and click on the add button.
								</Text>
							</Box>

							{owner !== null ? (
								<>
									<Box
										height={"60%"}
										p={2}
										mb={2}
										display={"flex"}
										flexDirection={"column"}
										justifyContent={"center"}
										alignItems={"center"}
									>
										<Text fontSize={"20px"} fontWeight={"bold"}>
											Owner Name
										</Text>
										<Text fontSize={"18px"}>{`${titleCase(
											owner[0].firstName
										)} ${titleCase(owner[0].lastName)}`}</Text>

										<Text fontSize={"20px"} fontWeight={"bold"} mt={2}>
											Mobile Number
										</Text>
										<Text fontSize={"18px"}>{owner[0].mobileNumber}</Text>

										<Text fontSize={"20px"} fontWeight={"bold"} mt={2}>
											Email
										</Text>
										<Text fontSize={"18px"}>{owner[0].email}</Text>
									</Box>
									<Box
										display={"flex"}
										justifyContent={"center"}
										alignItems={"center"}
										height={"10%"}
									>
										<Button
											leftIcon={<IoMdAdd />}
											mr={2.5}
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
												handleAddOwnerToPet(owner[0]._id, pet._id);
											}}
										>
											Add
										</Button>

										<Button
											leftIcon={<IoMdSearch />}
											ml={2.5}
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
												setOwner(null);
												setOwnerEmail(null);
											}}
										>
											Search Again
										</Button>
									</Box>
								</>
							) : (
								// No owner
								<>
									<Box
										height={"60%"}
										p={2}
										mb={2}
										display={"flex"}
										flexDirection={"column"}
										justifyContent={"center"}
										alignItems={"center"}
									>
										<FormControl id='email'>
											<Input
												type='email'
												name='email'
												placeholder='Owner Email'
												value={ownerEmail}
												onChange={(event) => {
													setOwnerEmail(event.target.value);
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
											leftIcon={<IoMdSearch />}
											_hover={{
												bg: "yellowgreen",
												color: "#000",
												transform: "scale(1.01)",
											}}
											_active={{
												transform: "scale(0.99)",
												opacity: "0.5",
											}}
											onClick={async () => {
												if (ownerEmail === null || ownerEmail === "") {
													toast({
														title: "Please Enter an Email",
														status: "error",
														duration: 2500,
														isClosable: true,
														position: "top",
													});
												} else if (!isValidEmail(ownerEmail)) {
													toast({
														title: "Please Enter an Email",
														status: "error",
														duration: 2500,
														isClosable: true,
														position: "top",
													});
												} else {
													try {
														setIsLoading(true);
														const response = await axios.post(
															"http://localhost:1234/user/getOwner",
															{ email: ownerEmail },
															{ withCredentials: true }
														);

														if (response.status === 200) {
															console.log("RESPONSE ==> ", response.data);
															console.log("OWNER ==> ", response.data);
															setOwner(response.data);
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
											}}
										>
											Search
										</Button>
									</Box>
								</>
							)}
						</CardBody>
					</Card>
				</Box>
				<Footer />
			</>
		</>
	) : (
		<></>
	);
}
