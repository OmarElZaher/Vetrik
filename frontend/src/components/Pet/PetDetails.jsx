// React Imports
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Axios Import
import axios from "axios";

// Chakra-UI Imports
import {
	Box,
	Button,
	Card,
	CardBody,
	FormControl,
	Input,
	Table,
	TableContainer,
	Thead,
	Tbody,
	Th,
	Td,
	Tr,
	Text,
	Tooltip,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import {
	IoMdEye,
	IoMdArrowRoundBack,
	IoMdAdd,
	IoMdSearch,
} from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { RiHealthBookFill } from "react-icons/ri";

// Custom Component Imports
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

	// Pet useStates
	const [pet, setPet] = useState({});
	const [petAge, setPetAge] = useState("");

	// Owner useStates
	const [owner, setOwner] = useState(null);
	const [ownerEmail, setOwnerEmail] = useState(null);

	// Misc useStates
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

	const handleSearchOwner = async () => {
		if (ownerEmail === null || ownerEmail === "") {
			toast({
				title: "Please Enter an Email Address",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		} else if (!isValidEmail(ownerEmail)) {
			toast({
				title: "Please Enter a Valid Email Address",
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
	};

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
						navigate("/search-pet");
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
			<>
				<Box
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
					bg={"#F3F3F3"}
					width={"100vw"}
					height={"87vh"}
				>
					{/* Pet Information */}
					<Card width='70%' height='90%' mr={1.5}>
						<Box
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							height={"15%"}
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
							display={"flex"}
							justifyContent={"space-evenly"}
							height={"15%"}
							mt={5}
							mb={2}
						>
							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"25%"}
								m={2}
								p={2}
							>
								<Text fontSize={"24px"} fontWeight={"bold"}>
									Type of Animal
								</Text>
								<Text fontSize={"20px"}>{pet.type}</Text>
							</Box>

							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"25%"}
								m={2}
							>
								<Text fontSize={"24px"} fontWeight={"bold"}>
									Breed
								</Text>
								<Text fontSize={"20px"}>{pet.breed}</Text>
							</Box>

							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"25%"}
								m={2}
							>
								<Text fontSize={"24px"} fontWeight={"bold"}>
									Date of Birth
								</Text>
								<Text fontSize={"20px"}>{formatDate(pet.dob)}</Text>
							</Box>

							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"25%"}
								m={2}
							>
								<Text fontSize={"24px"} fontWeight={"bold"}>
									Age
								</Text>
								<Text fontSize={"20px"}>{petAge}</Text>
							</Box>
						</Box>
						<hr />

						{/* Pets Table */}
						<Box
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
							alignItems={"center"}
							height={"50%"}
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
															navigate(`/owner-details/${owner._id}`);
														}}
														leftIcon={<IoMdEye />}
														mr={2.5}
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
															variant={"outline"}
															borderColor={"#EF5350"}
															leftIcon={<MdDelete />}
															mr={2.5}
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
								width={"15%"}
								mr={2.5}
							>
								Back
							</Button>

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
									navigate(`/pet-vaccination/${pet._id}`);
								}}
								leftIcon={<RiHealthBookFill />}
								width={"30%"}
								mx={2.5}
							>
								Vaccination Card
							</Button>

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
									navigate(`/pet-records/${pet._id}`);
								}}
								leftIcon={<RiHealthBookFill />}
								width={"30%"}
								mx={2.5}
							>
								Health Records
							</Button>

							<Tooltip
								hasArrow
								label='Deletes Pet From System'
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
										handleDeletePet(pet._id);
									}}
									variant={"outline"}
									leftIcon={<MdDelete />}
									borderColor={"#EF5350"}
									width={"15%"}
									ml={2.5}
								>
									Delete
								</Button>
							</Tooltip>
						</Box>
					</Card>
					<Card width={"25vw"} height={"90%"} ml={1.5}>
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
										display={"flex"}
										flexDirection={"column"}
										justifyContent={"center"}
										alignItems={"center"}
										height={"60%"}
										p={2}
										mb={2}
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
											leftIcon={<IoMdAdd />}
											mr={2.5}
										>
											Add
										</Button>

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
												setOwner(null);
												setOwnerEmail(null);
											}}
											leftIcon={<IoMdSearch />}
											ml={2.5}
										>
											Search Again
										</Button>
									</Box>
								</>
							) : (
								// No owner
								<>
									<Box
										display={"flex"}
										flexDirection={"column"}
										justifyContent={"center"}
										alignItems={"center"}
										height={"60%"}
										p={2}
										mb={2}
									>
										<FormControl id='email'>
											<Input
												id='email'
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
											_hover={{
												bg: "yellowgreen",
												color: "#000",
												transform: "scale(1.01)",
											}}
											_active={{
												transform: "scale(0.99)",
												opacity: "0.5",
											}}
											onClick={handleSearchOwner}
											leftIcon={<IoMdSearch />}
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
