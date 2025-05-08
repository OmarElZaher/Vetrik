import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
	Box,
	Text,
	Textarea,
	Button,
	FormControl,
	Input,
	Table,
	TableContainer,
	Th,
	Thead,
	Tr,
	Td,
	Tbody,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";

import Spinner from "./Spinner";

import { FaPerson } from "react-icons/fa6";
import { MdOutlinePets } from "react-icons/md";
import { IoMdEye } from "react-icons/io";

import { VET_NAME as vetName, API_URL as api } from "../../utils/constants";

function titleCase(str) {
	if (!str) return "";
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

export default function SecretaryHome() {
	const toast = useToast();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);

	const [role, setRole] = useState("");

	const [ownerMobileNumber, setOwnerMobileNumber] = useState(null);
	const [gotOwnerPets, setGotOwnerPets] = useState(false);
	const [ownerPets, setOwnerPets] = useState([]);

	const [reasonForVisit, setReasonForVisit] = useState(null);
	const [petId, setPetId] = useState(null);

	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const fetchUserRole = async () => {
			try {
				const response = await axios.get(`${api}/user/getUserInfo`, {
					withCredentials: true,
				});
				if (response.status === 200) {
					setRole(response.data.role);
				} else {
					toast({
						title: response.data.message,
						status: "error",
						duration: 2500,
						position: "top",
						isClosable: true,
					});
				}
			} catch (error) {
				toast({
					title: error.response.data.message,
					status: "error",
					duration: 2500,
					position: "top",
					isClosable: true,
				});
			}
		};

		fetchUserRole();

		if (role === "vet") {
			navigate("/vet");
		}

	}, [navigate, role, toast]);

	const handleGetOwnerPets = async () => {
		try {
			setLoading(true);

			const response = await axios.post(
				`${api}/user/getOwner`,
				{
					mobileNumber: ownerMobileNumber,
				},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				setOwnerPets(response.data[0].pets);
				setGotOwnerPets(true);
			} else {
				toast({
					title: response.data.message,
					status: "error",
					duration: 2500,
					position: "top",
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: error.response.data.message,
				status: "error",
				duration: 2500,
				position: "top",
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSubmitCase = async () => {
		try {
			setLoading(true);
			const response = await axios.post(
				`${api}/case/createCase`,
				{
					petId: petId,
					reasonForVisit: reasonForVisit,
				},
				{
					withCredentials: true,
				}
			);

			if (response.status === 201) {
				toast({
					title: "Case Created Successfully",
					status: "success",
					duration: 2500,
					position: "top",
					isClosable: true,
				});
				setOwnerMobileNumber(null);
				setGotOwnerPets(false);
				setOwnerPets([]);
				setReasonForVisit(null);
				onClose();
			} else {
				toast({
					title: response?.data?.message,
					status: "error",
					duration: 2500,
					position: "top",
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: error?.response?.data?.message,
				status: "error",
				duration: 2500,
				position: "top",
				isClosable: true,
			});
			setOwnerMobileNumber(null);
			setGotOwnerPets(false);
			setOwnerPets([]);
			setReasonForVisit(null);
			onClose();
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{loading ? (
				<Spinner />
			) : (
				<>
					{/* Welcome Box */}
					<Box
						height={"10vh"}
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						bg={"#F3F3F3"}
					>
						<Text fontSize={"30px"} fontWeight={"bold"}>
							{"Welcome to " + vetName + " Vet Clinic"}
						</Text>
					</Box>
					<hr />
					{/* Search Box */}
					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						bg={"#F3F3F3"}
						height={"33vh"}
					>
						{/* Search Owner Block */}
						<Box
							width={"50%"}
							height={"95%"}
							mx={5}
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
						>
							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								flexDirection={"column"}
								height={"80%"}
							>
								<Text fontSize={"28px"} fontWeight={"bold"} my={10}>
									Want to search for an owner?
								</Text>
								<Button
									_hover={{
										bg: "#D4F500",
										borderColor: "#D4F500",
										color: "#000",
										transform: "scale(1.05)",
									}}
									_active={{
										transform: "scale(0.98)",
										opacity: "0.5",
									}}
									onClick={() => {
										navigate("/search-owner");
									}}
									justifyContent={"flex-start"}
									alignItems={"center"}
									transition='all 0.15s ease'
									bg='#FFF'
									color='#000'
									fontSize='18px'
									my={5}
									rightIcon={<FaPerson />}
								>
									Go To Owner Search Page
								</Button>
							</Box>
						</Box>

						{/* Search Pet Block */}
						<Box
							width={"50%"}
							height={"95%"}
							mx={5}
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
						>
							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								flexDirection={"column"}
								height={"80%"}
							>
								<Text fontSize={"28px"} fontWeight={"bold"} my={10}>
									Want to search for a pet?
								</Text>
								<Button
									_hover={{
										bg: "#D4F500",
										borderColor: "#D4F500",
										color: "#000",
										transform: "scale(1.05)",
									}}
									_active={{
										transform: "scale(0.98)",
										opacity: "0.5",
									}}
									onClick={() => {
										navigate("/search-pet");
									}}
									justifyContent={"flex-start"}
									alignItems={"center"}
									transition='all 0.15s ease'
									bg='#FFF'
									color='#000'
									fontSize='18px'
									my={5}
									rightIcon={<MdOutlinePets />}
								>
									Go To Pet Search Page
								</Button>
							</Box>
						</Box>
					</Box>
					<hr />

					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						flexDirection={"column"}
						bg={"#F3F3F3"}
						height={"44vh"}
					>
						<Box
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							width={"95%"}
							height={"10%"}
						>
							<Text
								fontSize={"28px"}
								fontWeight={"bold"}
								decoration={"underline"}
							>
								Open A Case
							</Text>
						</Box>

						<Box
							dir='rtl'
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							width={"95%"}
							height={"85%"}
							mx={5}
						>
							{gotOwnerPets ? (
								<>
									<TableContainer
										width={"80%"}
										maxHeight={"70vh"}
										overflowY={"auto"}
									>
										<Table variant='simple' size='md'>
											<Thead>
												<Tr>
													<Th textAlign={"right"}>اسم الحيوان</Th>
													<Th textAlign={"center"}>السلالة</Th>
													<Th textAlign={"center"}>النوع</Th>
													<Th textAlign={"center"}>فئة الوزن</Th>
													<Th textAlign={"center"}>أفعال</Th>
												</Tr>
											</Thead>
											<Tbody>
												{ownerPets.map((row) => (
													<Tr key={row._id}>
														<Td textAlign={"right"}>{`${row.name}`}</Td>

														<Td textAlign={"center"}>
															{`${titleCase(row.breed)}`}
														</Td>

														<Td textAlign={"center"}>
															{`${titleCase(row.type)}`}
														</Td>

														<Td textAlign={"center"}>{`${row.weightClass}`}</Td>

														<Td textAlign={"center"}>
															<Button
																_hover={{
																	bg: "#D4F500",
																	borderColor: "#D4F500",
																	color: "#000",
																	transform: "scale(1.05)",
																}}
																_active={{
																	transform: "scale(0.98)",
																	opacity: "0.5",
																}}
																onClick={() => {
																	setPetId(row._id);
																	onOpen();
																}}
																justifyContent={"flex-start"}
																alignItems={"center"}
																transition='all 0.15s ease'
																bg='#FFF'
																color='#000'
																fontSize='18px'
																my={5}
																rightIcon={<IoMdEye />}
															>
																Open Case
															</Button>
														</Td>
													</Tr>
												))}
											</Tbody>
										</Table>
									</TableContainer>
								</>
							) : (
								<>
									<FormControl
										dir='ltr'
										id='ownerMobileNumber'
										display={"flex"}
										justifyContent={"center"}
										alignItems={"center"}
										flexDirection={"column"}
										width={"80%"}
										height={"80%"}
									>
										<Text fontSize={"20px"} fontWeight={"bold"} mb={5}>
											Enter Owner's Mobile Number
										</Text>
										<Input
											id='ownerMobileNumber'
											type='text'
											name='ownerMobileNumber'
											placeholder='Mobile Number'
											value={ownerMobileNumber}
											onChange={(e) => {
												setOwnerMobileNumber(e.target.value);
											}}
											width={"80%"}
											mb={5}
											ml={5}
											disabled={loading}
											bg={"#FFF"}
										/>

										<Button
											_hover={{
												bg: "#D4F500",
												borderColor: "#D4F500",
												color: "#000",
												transform: "scale(1.05)",
											}}
											_active={{
												transform: "scale(0.98)",
												opacity: "0.5",
											}}
											onClick={handleGetOwnerPets}
											justifyContent={"flex-start"}
											alignItems={"center"}
											transition='all 0.15s ease'
											bg='#FFF'
											color='#000'
											fontSize='18px'
											my={5}
											rightIcon={<FaPerson />}
										>
											Search
										</Button>
									</FormControl>
								</>
							)}
						</Box>
					</Box>
					{/* Modal for Case Details */}
					<Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader textAlign={"center"}>Reason For Visit</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Textarea
									id='reasonForVisit'
									type='text'
									name='reasonForVisit'
									placeholder='Reason For Visit'
									value={reasonForVisit}
									scrollBehavior={"smooth"}
									resize={"none"}
									bg={"#FFF"}
									width={"100%"}
									height={"20vh"}
									onChange={(e) => {
										setReasonForVisit(e.target.value);
									}}
								/>
							</ModalBody>
							<ModalFooter>
								<Button
									rightIcon={<IoMdEye />}
									variant='solid'
									mx={5}
									_hover={{
										bg: "#D4F500",
										borderColor: "#D4F500",
										color: "#000",
										transform: "scale(1.05)",
									}}
									onClick={() => {
										if (
											!reasonForVisit ||
											reasonForVisit.trim() === "" ||
											reasonForVisit.length < 5
										) {
											toast({
												title: "Please enter a reason for the visit",
												status: "error",
												duration: 2500,
												position: "top",
												isClosable: true,
											});
											return;
										}

										handleSubmitCase();
									}}
								>
									Submit
								</Button>
								<Button
									onClick={onClose}
									_hover={{
										bg: "red",
										color: "#000",
										transform: "scale(1.05)",
									}}
								>
									Cancel
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				</>
			)}
		</>
	);
}
