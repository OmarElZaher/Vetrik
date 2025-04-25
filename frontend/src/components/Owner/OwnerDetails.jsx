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
	const [weight, setWeight] = useState("");

	const handleRemovePet = async (petId) => {
		const confirmDelete = window.confirm(
			"هل أنت متأكد أنك تريد حذف هذا الحيوان؟"
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
			"هل أنت متأكد أنك تريد حذف هذا المالك؟"
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
				weight === "" ||
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
					weight: weight,
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
					setWeight("");
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
					console.log(response.data);
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
				dir='rtl'
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
					الرجوع لصفحة البحث
				</Button>
			</Box>
			<Footer />
		</>
	) : gotData ? (
		<>
			<Box
				dir='rtl'
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				width={"100vw"}
				height={"87vh"}
			>
				{/* Owner Information */}
				<Card dir='rtl' width='60vw' height='80vh' mt={15} ml={2}>
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
									<Icon as={FaRegEdit} ml={1.5} />
									تعديل الملف الشخصي
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
									البريد الإلكتروني
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
									رقم الموبايل
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
									طريقة التواصل
								</Text>
								<Text fontSize={"20px"}>
									{owner.preferredContactMethod === "both"
										? "مكالمة وبريد"
										: owner.preferredContactMethod === "neither"
										? "لا يفضل التواصل"
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
							{owner.pets.length > 0 ? (
								<>
									<Text fontSize={"24px"} fontWeight={"bold"}>
										الحيوانات المسجلة
									</Text>
									<TableContainer
										width={"92%"}
										maxHeight={"30vh"}
										overflowY={"auto"}
									>
										<Table variant='simple' size='md'>
											<Thead>
												<Th textAlign={"left"}>الاسم</Th>
												<Th textAlign={"center"}>النوع</Th>
												<Th textAlign={"center"}>السلالة</Th>
												<Th textAlign={"center"}>الجنس</Th>
												<Th textAlign={"center"}>إجراءات</Th>
											</Thead>
											<Tbody>
												{owner.pets.map((pet) => (
													<Tr key={pet._id}>
														<Td textAlign={"left"}>{titleCase(pet.name)}</Td>
														<Td textAlign={"center"}>{titleCase(pet.type)}</Td>
														<Td textAlign={"center"}>{titleCase(pet.breed)}</Td>
														<Td textAlign={"center"}>
															{titleCase(pet.gender)}
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
																	navigate(`/pet-details/${pet._id}`);
																}}
																rightIcon={<IoMdEye />}
																ml={2.5}
															>
																عرض
															</Button>

															<Tooltip
																hasArrow
																label='حذف الحيوان من حساب المالك'
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
																	rightIcon={<TbTrashXFilled />}
																	mr={2.5}
																>
																	حذف
																</Button>
															</Tooltip>
														</Td>
													</Tr>
												))}
											</Tbody>
										</Table>
									</TableContainer>
								</>
							) : (
								<Text
									fontSize={"40px"}
									textDecoration={"underline"}
									color={"#EF5350"}
								>
									لا يوجد حيوانات مسجلة
								</Text>
							)}
						</Box>

						{/* Back, Delete Button */}
						<Box
							dir='rtl'
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
								rightIcon={<IoMdArrowRoundBack />}
								width={"40%"}
								ml={2.5}
							>
								جدول المالكين المصفى
							</Button>
							<Tooltip
								hasArrow
								label='حذف المالك من النظام'
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
									rightIcon={<TbTrashXFilled />}
									variant={"outline"}
									borderColor={"#EF5350"}
									width={"25%"}
									mr={2.5}
								>
									حذف
								</Button>
							</Tooltip>
						</Box>
					</CardBody>
				</Card>

				{/* Add a pet */}
				<Card dir='rtl' width='35vw' height='80vh' mt={15} mr={2}>
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
								إضافة حيوان أليف
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
								لتسجيل{" "}
								<Text
									fontSize={"20px"}
									display={"inline"}
									textDecoration={"underline"}
									fontWeight={"bold"}
								>
									حيوان جديد{" "}
								</Text>
								مش متسجل قبل كده، اكتب كل البيانات المطلوبة.
							</Text>
						</Box>
						<Box
							dir='rtl'
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
									placeholder='اسم الحيوان'
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
									placeholder='نوع الحيوان'
									cursor={"pointer"}
									value={type}
									iconColor='transparent'
									onChange={(e) => {
										setType(e.target.value);
									}}
									ml={2}
								>
									<option value='Dog'>كلب</option>
									<option value='Cat'>قطة</option>
									<option value='Bird'>طائر</option>
									<option value='Turtle'>سلحفاة</option>
									<option value='Monkey'>قرد</option>
									<option value='Hamster'>هامستر</option>
									<option value='Fish'>سمكة</option>
								</Select>

								<Input
									id='breed'
									type='text'
									name='breed'
									placeholder='سلالة الحيوان'
									value={breed}
									onChange={(e) => {
										setBreed(e.target.value);
									}}
									mr={2}
								/>
							</FormControl>
							<FormControl id='gender' mb={5}>
								<Select
									id='gender'
									name='gender'
									placeholder='اختيار الجنس'
									cursor={"pointer"}
									value={gender}
									iconColor='transparent'
									onChange={(e) => {
										setGender(e.target.value);
									}}
								>
									<option value='Male'>ذكر</option>
									<option value='Female'>أنثى</option>
								</Select>
							</FormControl>
							<FormControl id='weight' mb={5}>
								<Input
									id='weight'
									type='number'
									name='weight'
									placeholder='وزن الحيوان (كجم)'
									value={weight}
									onChange={(e) => {
										setWeight(e.target.value);
									}}
								/>
							</FormControl>
							<FormControl id='dob'>
								<Input
									id='dob'
									type='date'
									name='dob'
									placeholder='تاريخ الميلاد'
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
								rightIcon={<IoMdAdd />}
								width={"25%"}
							>
								إضافة
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
