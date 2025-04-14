/* eslint-disable react-hooks/exhaustive-deps */
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
	FormControl,
	Icon,
	Input,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Table,
	TableContainer,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Text,
	Tooltip,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";

// React Icon Imports
import { FaCheckCircle } from "react-icons/fa";
import { IoIosRemoveCircle, IoMdAdd, IoMdArrowRoundBack } from "react-icons/io";
import { MdAutorenew, MdDelete } from "react-icons/md";
import { RiHealthBookFill } from "react-icons/ri";
import { TbVaccine } from "react-icons/tb";

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

function formatDate(inputDate) {
	const date = new Date(inputDate);
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
}

function capitalizeEveryLetter(str) {
	return str
		.split("")
		.map((letter) => letter.toUpperCase())
		.join("");
}

export default function PetVaccination() {
	const { petId } = useParams();
	const navigate = useNavigate();
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const today = new Date();
	const formattedDate = today.toISOString().split("T")[0];

	// Pet useStates
	const [pet, setPet] = useState(null);

	// Vaccination Card useStates
	const [vaccinationCardExists, setVaccinationCardExists] = useState(false);
	const [vaccinationCard, setVaccinationCard] = useState(null);

	const [vaccineName, setVaccineName] = useState("");
	const [vaccineBatch, setVaccineBatch] = useState("");
	const [vaccineGivenDate, setVaccineGivenDate] = useState(formattedDate);
	const [vaccineRenewalDate, setVaccineRenewalDate] = useState(null);

	const [vaccineRenewalId, setVaccineRenewalId] = useState(null);

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const handleCreateVaccinationCard = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/user/createVaccinationCard/${petId}`,
				{
					vaccineName: vaccineName,
					vaccineBatch: vaccineBatch,
					vaccineGivenDate: vaccineGivenDate,
					vaccineRenewalDate: vaccineRenewalDate,
				},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				setVaccinationCardExists(true);
				toast({
					title: response.data.message,
					status: "success",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
				setVaccineName("");
				setVaccineBatch("");
				setVaccineGivenDate(formattedDate);
				setVaccineRenewalDate(null);
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

	const handleAddVaccine = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/user/addVaccination/${petId}`,
				{
					vaccineName: vaccineName,
					vaccineBatch: vaccineBatch,
					vaccineGivenDate: vaccineGivenDate,
					vaccineRenewalDate: vaccineRenewalDate,
				},
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
				fetchData();
				setVaccineName("");
				setVaccineBatch("");
				setVaccineGivenDate(formattedDate);
				setVaccineRenewalDate(null);
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

	const handleDelete = async () => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this vaccination card?"
		);
		if (confirmDelete) {
			try {
				setIsLoading(true);
				const response = await axios.delete(
					`${api}/user/deleteVaccinationCard/${petId}`,
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
					setVaccinationCardExists(false);
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

	const handleRemoveVaccine = async (vaccineId) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to remove this vaccine from the vaccination card?"
		);

		if (confirmDelete) {
			try {
				setIsLoading(true);
				const response = await axios.delete(
					`${api}/user/deleteVaccination/${petId}/${vaccineId}`,
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
					fetchData();
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

	const handleRenewVaccine = async (vaccineId) => {
		try {
			setIsLoading(true);
			const response = await axios.put(
				`${api}/user/renewVaccination/${petId}/${vaccineId}`,
				{
					vaccineRenewalDate: vaccineRenewalDate,
				},
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
				fetchData();
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

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(
				`${api}/user/getVaccinationCard/${petId}`,
				{
					withCredentials: true,
				}
			);
			if (response.status === 200) {
				setVaccinationCardExists(true);
				setVaccinationCard(response.data.vaccinationCard);
				setPet(response.data.pet);
			} else {
				setVaccinationCardExists(false);
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
		fetchData();
	}, [vaccinationCardExists]);

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : vaccinationCardExists ? (
				<>
					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						bg={"#F3F3F3"}
						height={"87vh"}
					>
						<Card
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							width={"65%"}
							height={"90%"}
							mr={1.5}
						>
							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"10%"}
							>
								<Text
									fontSize={"40px"}
									fontWeight={"bold"}
									textDecoration={"underline"}
								>
									{titleCase(pet.name)}
								</Text>
							</Box>

							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"60%"}
							>
								<TableContainer
									width={"100%"}
									maxHeight={"80%"}
									overflowY={"auto"}
								>
									<Table variant='simple' size='md'>
										<Thead>
											<Tr>
												<Th textAlign={"left"}>Name</Th>
												<Th textAlign={"center"}>Batch</Th>
												<Th textAlign={"center"}>Given Date</Th>
												<Th textAlign={"center"}>Renewal Date</Th>
												<Th textAlign={"center"}>Actions</Th>
											</Tr>
										</Thead>
										<Tbody>
											{vaccinationCard.vaccine.map((row) => (
												<Tr key={vaccinationCard._id}>
													<Td textAlign={"left"}>
														{titleCase(row.vaccineName)}
													</Td>
													<Td textAlign={"center"}>
														{capitalizeEveryLetter(row.vaccineBatch)}
													</Td>
													<Td textAlign={"center"}>
														{formatDate(row.vaccineGivenDate)}
													</Td>
													<Td textAlign={"center"}>
														{row.vaccineRenewalDate === null
															? "-"
															: formatDate(row.vaccineRenewalDate)}
													</Td>
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
																setVaccineRenewalId(row._id);
																onOpen();
															}}
															leftIcon={<MdAutorenew />}
															mr={2.5}
														>
															Renew
														</Button>
														<Tooltip
															hasArrow
															label='Remove Vaccine From Vaccination Card'
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
																	handleRemoveVaccine(row._id);
																}}
																leftIcon={<IoIosRemoveCircle />}
																variant={"outline"}
																borderColor={"#EF5350"}
																ml={2.5}
															>
																Remove
															</Button>
														</Tooltip>
													</Td>
													<>
														<Modal
															isOpen={isOpen}
															onClose={onClose}
															isCentered
															size={"lg"}
														>
															<ModalOverlay />

															<ModalContent>
																<ModalHeader textDecoration={"underline"}>
																	Vaccine Renewal Date
																</ModalHeader>
																<ModalCloseButton />

																<ModalBody>
																	<Text
																		fontSize={"18px"}
																		textAlign={"center"}
																		mb={3}
																	>
																		Leave empty if vaccine is not renewable
																	</Text>
																	<FormControl id='renewalDate'>
																		<Input
																			id='renewalDate'
																			type='date'
																			name='renewalDate'
																			placeholder='Vaccine Renewal Date'
																			value={vaccineRenewalDate}
																			onChange={(e) => {
																				setVaccineRenewalDate(e.target.value);
																			}}
																		/>
																	</FormControl>
																</ModalBody>

																<ModalFooter>
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
																		onClick={onClose}
																		leftIcon={<MdDelete />}
																		variant={"outline"}
																		borderColor={"#EF5350"}
																		mr={2.5}
																	>
																		Cancel
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
																			handleRenewVaccine(vaccineRenewalId);
																			setVaccineRenewalDate(null);
																			onClose();
																		}}
																		leftIcon={<FaCheckCircle />}
																		ml={2.5}
																	>
																		Renew
																	</Button>
																</ModalFooter>
															</ModalContent>
														</Modal>
													</>
												</Tr>
											))}
										</Tbody>
									</Table>
								</TableContainer>
							</Box>

							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"15%"}
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
										navigate(`/pet-details/${petId}`);
									}}
									leftIcon={<IoMdArrowRoundBack />}
									mr={2.5}
								>
									Pet Details
								</Button>

								<Tooltip
									hasArrow
									label='Deletes Pet Vaccination Card'
									placement='top'
									bg={"#EF5350"}
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
										onClick={handleDelete}
										leftIcon={<MdDelete />}
										variant={"outline"}
										borderColor={"#EF5350"}
										ml={2.5}
									>
										Delete
									</Button>
								</Tooltip>
							</Box>
						</Card>

						<Card
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
							alignItems={"center"}
							width={"30%"}
							height={"90%"}
							ml={1.5}
						>
							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"15%"}
							>
								<Text
									fontSize={"40px"}
									fontWeight={"bold"}
									textDecoration={"underline"}
								>
									Add A Vaccine
								</Text>
								<Text fontSize={"18px"} textAlign={"center"} mt={2}>
									Enter all details of the vaccine to save to pet vaccination
									card.
								</Text>
							</Box>

							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"60%"}
							>
								<FormControl id='vaccineName' mb={5}>
									<Input
										id='vaccineName'
										type='text'
										name='vaccineName'
										placeholder='Vaccine Name (As Written on Vaccine)'
										value={vaccineName}
										onChange={(e) => {
											setVaccineName(e.target.value);
										}}
									/>
								</FormControl>

								<FormControl id='vaccineBatch' mb={3}>
									<Input
										id='vaccineBatch'
										type='text'
										name='vaccineBatch'
										placeholder='Vaccine Batch Number'
										value={vaccineBatch}
										onChange={(e) => {
											setVaccineBatch(e.target.value);
										}}
									/>
								</FormControl>

								<FormControl
									id='givenDate'
									display={"flex"}
									flexDirection={"column"}
									justifyContent={"center"}
									mb={3}
								>
									<Text fontSize={"16px"} color={"#798296"} ml={1.5} mb={1}>
										Vaccine Given Date (Today By Default)
									</Text>
									<Input
										id='givenDate'
										type='date'
										name='givenDate'
										placeholder='Given Date'
										value={vaccineGivenDate}
										onChange={(e) => {
											setVaccineGivenDate(e.target.value);
										}}
									/>
								</FormControl>
								<Tooltip
									hasArrow
									placement='bottom'
									label='Leave Empty if Vaccine is Not Renewable'
								>
									<FormControl
										id='renewalDate'
										display={"flex"}
										flexDirection={"column"}
										justifyContent={"center"}
									>
										<Text fontSize={"16px"} color={"#798296"} ml={1.5} mb={1}>
											Vaccine Renewal Date
										</Text>
										<Input
											id='renewalDate'
											type='date'
											name='renewalDate'
											placeholder='Renewal Date'
											value={vaccineRenewalDate}
											onChange={(e) => {
												setVaccineRenewalDate(e.target.value);
											}}
										/>
									</FormControl>
								</Tooltip>
							</Box>

							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"15%"}
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
									onClick={handleAddVaccine}
									leftIcon={<IoMdAdd />}
									width={"50%"}
								>
									Add
								</Button>
							</Box>
						</Card>
					</Box>
					<Footer />
				</>
			) : (
				<>
					{" "}
					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						bg={"#F3F3F3"}
						height={"87vh"}
					>
						<Card
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
							alignItems={"center"}
							width={"90%"}
							height={"90%"}
						>
							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"15%"}
							>
								<Icon as={RiHealthBookFill} fontSize={"60px"} />
								<Text
									fontSize={"40px"}
									fontWeight={"bold"}
									textDecoration={"underline"}
								>
									Vaccination Card
								</Text>
							</Box>
							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								borderBottom={"1px solid #000"}
								width={"90%"}
								height={"10%"}
							>
								<Text fontSize={"25px"} textAlign={"center"} color={"#F39C11"}>
									Pet does not have an existing vaccination card, input vaccine
									details to create one.
								</Text>
							</Box>

							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"50%"}
							>
								<FormControl id='vaccineName' mb={5}>
									<Input
										id='vaccineName'
										type='text'
										name='vaccineName'
										placeholder='Vaccine Name (As Written on Vaccine)'
										value={vaccineName}
										onChange={(e) => {
											setVaccineName(e.target.value);
										}}
									/>
								</FormControl>

								<FormControl id='vaccineBatch' mb={3}>
									<Input
										id='vaccineBatch'
										type='text'
										name='vaccineBatch'
										placeholder='Vaccine Batch Number'
										value={vaccineBatch}
										onChange={(e) => {
											setVaccineBatch(e.target.value);
										}}
									/>
								</FormControl>

								<FormControl
									id='date'
									display={"flex"}
									justifyContent={"space-evenly"}
								>
									<Box
										display={"flex"}
										flexDirection={"column"}
										justifyContent={"center"}
										width={"50%"}
									>
										<Text fontSize={"16px"} color={"#798296"} ml={1.5} mb={1}>
											Vaccine Given Date (Today By Default)
										</Text>
										<Input
											id='givenDate'
											type='date'
											name='givenDate'
											placeholder='Vaccine Given Date'
											value={vaccineGivenDate}
											onChange={(e) => {
												setVaccineGivenDate(e.target.value);
											}}
											mr={2.5}
										/>
									</Box>
									<Tooltip
										hasArrow
										placement='bottom'
										label='Leave Empty if Vaccine is Not Renewable'
									>
										<Box
											display={"flex"}
											flexDirection={"column"}
											justifyContent={"center"}
											width={"50%"}
										>
											<Text fontSize={"16px"} color={"#798296"} ml={3} mb={1}>
												Vaccine Renewal Date
											</Text>
											<Input
												id='renewalDate'
												type='date'
												name='renewalDate'
												placeholder='Vaccine Renewal Date'
												value={vaccineRenewalDate}
												onChange={(e) => {
													setVaccineRenewalDate(e.target.value);
												}}
												ml={2.5}
											/>
										</Box>
									</Tooltip>
								</FormControl>
							</Box>

							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
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
									onClick={handleCreateVaccinationCard}
									leftIcon={<TbVaccine />}
								>
									Create Vaccination Card
								</Button>
							</Box>
						</Card>
					</Box>
					<Footer />
				</>
			)}
		</>
	);
}
