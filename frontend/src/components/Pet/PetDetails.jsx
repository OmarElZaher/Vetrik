// React Imports
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Axios Import
import axios from "axios";

import { FaBookMedical } from "react-icons/fa";

// API URL Import
import { API_URL as api } from "../../utils/constants";

// Hook Import
import useIsMobile from "../../hooks/useIsMobile";

// Chakra-UI Imports
import {
	Box,
	Button,
	Card,
	CardBody,
	FormControl,
	Icon,
	Input,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Tag,
	Table,
	TableContainer,
	Thead,
	Tbody,
	Th,
	Td,
	Tr,
	Text,
	Textarea,
	Tooltip,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useToast,
	useDisclosure,
} from "@chakra-ui/react";

// React Icons Imports
import {
	IoMdPaw,
	IoMdPricetags,
	IoMdMale,
	IoMdCalendar,
	IoMdTime,
	IoMdEye,
	IoMdArrowRoundBack,
	IoMdMedical,
	IoMdDocument,
	IoMdAdd,
	IoMdRefresh,
	IoMdSearch,
} from "react-icons/io";

import { TbTrashXFilled } from "react-icons/tb";

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

export default function PetDetails() {
	const { petId } = useParams();
	const navigate = useNavigate();
	const toast = useToast();

	const isMobile = useIsMobile();

	// Pet useStates
	const [pet, setPet] = useState({});
	const [petAge, setPetAge] = useState("");
	const [petCases, setPetCases] = useState([]);

	// Owner useStates
	const [owner, setOwner] = useState(null);
	const [ownerMobileNumber, setownerMobileNumber] = useState(null);

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);
	const [gotData, setGotData] = useState(false);
	const [error, setIsError] = useState(null);

	const [actionsTaken, setActionsTaken] = useState("");
	const [caseToClose, setCaseToClose] = useState(null);

	const {
		isOpen: isModalOpen,
		onOpen: openModal,
		onClose: closeModal,
	} = useDisclosure();

	const {
		isOpen: isAlertOpen,
		onOpen: openAlert,
		onClose: closeAlert,
	} = useDisclosure();

	const cancelRef = React.useRef();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${api}/user/getPetInfo/${petId}`, {
					withCredentials: true,
				});
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
		fetchData();
	}, [petId, toast]);

	const handleRemovePetFromOwner = async (ownerId, petId) => {
		const confirmDelete = window.confirm(
			"هل أنت متأكد أنك تريد إزالة هذا المالك من هذا الحيوان؟"
		);
		if (confirmDelete) {
			try {
				setIsLoading(true);
				const response = await axios.delete(
					`${api}/user/removePetFromOwner/${ownerId}/${petId}`,
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
			"هل أنت متأكد أنك تريد حذف هذا الحيوان؟"
		);
		if (confirmDelete) {
			try {
				setIsLoading(true);
				const response = await axios.delete(`${api}/user/deletePet/${petId}`, {
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
				`${api}/user/addPetToOwner/${ownerId}/${petId}`,
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
				setownerMobileNumber(null);
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
		if (ownerMobileNumber === null || ownerMobileNumber === "") {
			toast({
				title: "من فضلك أدخل رقم المحمول الخاص بالمالك",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		} else {
			try {
				setIsLoading(true);
				const response = await axios.post(
					`${api}/user/getOwner`,
					{ mobileNumber: ownerMobileNumber },
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

	const handleAcceptCase = async (caseId) => {
		try {
			setIsLoading(true);
			const response = await axios.patch(
				`${api}/case/${caseId}/acceptCase`,
				{},
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
			}
		} catch (error) {
			if (error.response.status === 500) {
				toast({
					title: error?.response?.data?.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleCloseCase = async (caseId) => {
		try {
			setIsLoading(true);
			const response = await axios.patch(
				`${api}/case/${caseId}/completeCase`,
				{ actionsTaken },
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
			}
		} catch (error) {
			if (error.response.status === 500) {
				toast({
					title: error?.response?.data?.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleGetCases = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(`${api}/case/getPetCases/${petId}`, {
				withCredentials: true,
			});

			if (response.status === 200) {
				setPetCases(response.data.cases);
				closeModal();
				openModal();
			}
		} catch (error) {
			if (error.response.status === 500) {
				toast({
					title: error.response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	return isLoading ? (
		<Spinner />
	) : error ? (
		<Box
			dir='rtl'
			display='flex'
			flexDirection='column'
			justifyContent='center'
			alignItems='center'
			bg='#F3F3F3'
			minHeight='87vh'
		>
			<Text fontWeight='bold' fontSize='4xl' color='red'>
				خطأ
			</Text>
			<Text fontSize='2xl' textDecoration='underline'>
				{error}
			</Text>
			<Button
				mt={10}
				width={{ base: "80%", md: "25%" }}
				onClick={() => navigate("/search-pet")}
			>
				الرجوع للبحث
			</Button>
			<Footer />
		</Box>
	) : gotData ? (
		<>
			<Box
				dir='rtl'
				display='flex'
				flexDirection={{ base: "column", md: "row" }}
				justifyContent='center'
				alignItems='flex-start'
				bg='#F3F3F3'
				px={{ base: 2, md: 4 }}
				py={6}
			>
				{/* Main Pet Card */}
				<Card width={{ base: "100%", md: "70%" }} mb={{ base: 4, md: 0 }}>
					<CardBody>
						<Text
							fontSize={{ base: "2xl", md: "3xl" }}
							fontWeight='bold'
							textAlign='center'
							mb={4}
						>
							{titleCase(pet.name)}
						</Text>

						<Box
							display='flex'
							flexWrap='wrap'
							justifyContent='space-between'
							mb={4}
						>
							{[
								{
									label: "نوع الحيوان",
									value: titleCase(pet.type),
									icon: <IoMdPaw />,
								},
								{
									label: "السلالة",
									value: titleCase(pet.breed),
									icon: <IoMdPricetags />,
								},
								{
									label: "الجنس",
									value: titleCase(pet.gender),
									icon: <IoMdMale />,
								},
								{
									label: "تاريخ الميلاد",
									value: formatDate(pet.dob),
									icon: <IoMdCalendar />,
								},
								{
									label: "العُمر",
									value: petAge,
									icon: <IoMdTime />,
								},
							].map((item, i) => (
								<Box
									key={i}
									width={{
										base: "100%",
										md: "48%",
										lg: "30%",
									}}
									mb={3}
									display='flex'
									alignItems='center'
								>
									<Icon as={item.icon.type} boxSize={5} ml={2} />
									<Box>
										<Text fontWeight='bold'>{item.label}</Text>
										<Text>{item.value}</Text>
									</Box>
								</Box>
							))}
						</Box>

						<Text fontSize='xl' fontWeight='bold' mb={2}>
							المالكين
						</Text>
						<TableContainer overflowX='auto'>
							<Table size='sm' minWidth='600px'>
								<Thead>
									<Tr>
										<Th>الاسم الكامل</Th>
										<Th>البريد الإلكتروني</Th>
										<Th>رقم المحمول</Th>
										<Th>الإجراءات</Th>
									</Tr>
								</Thead>
								<Tbody>
									{pet.owners.map((owner) => (
										<Tr key={owner._id}>
											<Td>{owner.fullName}</Td>
											<Td>{owner.email}</Td>
											<Td>{owner.mobileNumber}</Td>
											<Td>
												<Button
													size='sm'
													onClick={() =>
														navigate(`/owner-details/${owner._id}`)
													}
													rightIcon={<IoMdEye />}
													mr={2}
												>
													عرض
												</Button>
												<Tooltip label='إزالة المالك' hasArrow>
													<Button
														size='sm'
														variant='outline'
														colorScheme='red'
														onClick={() =>
															handleRemovePetFromOwner(owner._id, pet._id)
														}
														rightIcon={<TbTrashXFilled />}
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

						<Box display={"flex"} justifyContent={"center"} mt={4}>
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
								transition='all 0.2s'
								rightIcon={<FaBookMedical />}
								onClick={() => {
									handleGetCases();
									openModal();
								}}
							>
								{pet.name
									? titleCase(pet.name) +
									  (pet.name.trim().toLowerCase().endsWith("s")
											? "' Cases"
											: "'s Cases")
									: "See All Cases"}
							</Button>
						</Box>

						<Box
							mt={6}
							display='flex'
							flexDirection={{ base: "column", md: "row" }}
							gap={4}
							justifyContent='center'
						>
							<Button
								onClick={() =>
									navigate(
										localStorage.getItem("petFilterData")
											? "/pet-table"
											: "/search-pet"
									)
								}
								rightIcon={<IoMdArrowRoundBack />}
							>
								رجوع
							</Button>
							<Button
								onClick={() => navigate(`/pet-vaccination/${pet._id}`)}
								rightIcon={<IoMdMedical />}
							>
								كارت التطعيمات
							</Button>
							<Button
								onClick={() => navigate(`/pet-records/${pet._id}`)}
								rightIcon={<IoMdDocument />}
							>
								السجلات الصحية
							</Button>
							<Tooltip label='حذف الحيوان' hasArrow>
								<Button
									variant='outline'
									colorScheme='red'
									onClick={() => handleDeletePet(pet._id)}
									rightIcon={<TbTrashXFilled />}
								>
									حذف
								</Button>
							</Tooltip>
						</Box>
					</CardBody>
				</Card>

				{/* Side Card: Add Owner */}
				<Card width={{ base: "100%", md: "30%" }}>
					<CardBody>
						<Text fontSize='2xl' fontWeight='bold' textAlign='center' mb={4}>
							إضافة مالك موجود
						</Text>
						<Text fontSize='md' textAlign='center' mb={4}>
							أدخل رقم المحمول للمالك ثم اضغط زر البحث.
						</Text>

						{owner !== null ? (
							<Box>
								<Text fontWeight='bold'>الاسم</Text>
								<Text>{owner[0].fullName}</Text>
								<Text fontWeight='bold' mt={2}>
									رقم المحمول
								</Text>
								<Text>{owner[0].mobileNumber}</Text>
								<Text fontWeight='bold' mt={2}>
									البريد الإلكتروني
								</Text>
								<Text>{owner[0].email}</Text>

								<Box
									mt={4}
									display='flex'
									flexDirection={{
										base: "column",
										md: "row",
									}}
									gap={3}
								>
									<Button
										onClick={() => handleAddOwnerToPet(owner[0]._id, pet._id)}
										rightIcon={<IoMdAdd />}
									>
										إضافة
									</Button>
									<Button
										onClick={() => {
											setOwner(null);
											setownerMobileNumber(null);
										}}
										rightIcon={<IoMdRefresh />}
									>
										بحث مرة أخرى
									</Button>
								</Box>
							</Box>
						) : (
							<Box>
								<FormControl mb={4}>
									<Input
										type='text'
										placeholder='رقم المحمول'
										value={ownerMobileNumber}
										onChange={(e) => setownerMobileNumber(e.target.value)}
									/>
								</FormControl>
								<Button
									onClick={handleSearchOwner}
									width='100%'
									rightIcon={<IoMdSearch />}
								>
									بحث
								</Button>
							</Box>
						)}
					</CardBody>
				</Card>
			</Box>

			<Modal isOpen={isModalOpen} onClose={closeModal} size='xxl'>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						{pet.name
							? titleCase(pet.name) +
							  (pet.name.trim().toLowerCase().endsWith("s")
									? "' Cases"
									: "'s Cases")
							: "Cases"}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<TableContainer>
							<Table size='sm' overflow={"auto"}>
								<Thead>
									<Tr>
										<Th>Reason For Visit</Th>
										<Th>Actions Taken</Th>
										<Th>Case Date</Th>
										<Th textAlign={"center"}>Case Status</Th>
									</Tr>
								</Thead>
								<Tbody>
									{petCases.map((caseItem) => (
										<Tr key={caseItem._id}>
											<Td>{caseItem.reasonForVisit}</Td>
											<Td>
												{caseItem.actionsTaken ? caseItem.actionsTaken : "–"}
											</Td>
											<Td>{formatDate(caseItem.updatedAt)}</Td>
											<Td
												justifyContent={"center"}
												display={"flex"}
												alignContent={"center"}
											>
												{caseItem.status === "waiting" &&
												localStorage.getItem("userRole") === "vet" ? (
													<>
														<Tag colorScheme='yellow' mr={2}>
															{titleCase(caseItem.status)}
														</Tag>
														<Button
															ml={2}
															size='sm'
															_hover={{
																backgroundColor: "green.400",
																color: "white",
																transition: "all 0.2s",
																transform: "scale(1.05)",
															}}
															onClick={() => {
																handleAcceptCase(caseItem._id);
																window.location.reload();
															}}
														>
															Accept Case
														</Button>
													</>
												) : caseItem.status === "waiting" &&
												  localStorage.getItem("userRole") === "secretary" ? (
													<Tag colorScheme='yellow' mr={2}>
														{titleCase(caseItem.status)}
													</Tag>
												) : caseItem.status === "in-progress" ? (
													caseItem.vetId._id ===
													localStorage.getItem("userId") ? (
														<>
															<Tag colorScheme='green' mr={2}>
																{titleCase(caseItem.status)}
															</Tag>
															<Button
																size='sm'
																onClick={() => {
																	setCaseToClose(caseItem._id);
																	openAlert();
																}}
															>
																Close Case
															</Button>
														</>
													) : (
														<Tag colorScheme='green'>
															{titleCase(caseItem.status)}
														</Tag>
													)
												) : (
													<Tag colorScheme='blue'>
														{titleCase(caseItem.status)}
													</Tag>
												)}
											</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						</TableContainer>
					</ModalBody>

					<ModalFooter>
						{localStorage.getItem("userRole") === "secretary" && (
							<>
								<Button
									_hover={{
										bg: "#D4F500",
										color: "#000",
										transition: "all 0.2s",
										transform: "scale(1.05)",
									}}
									_active={{
										transform: "scale(0.98)",
										opacity: "0.5",
									}}
									onClick={() => {
										navigate(`/open-case/${pet._id}`);
									}}
								>
									Open Case
								</Button>
							</>
						)}
						<Button colorScheme='blue' ml={3} onClick={closeModal}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<AlertDialog
				isOpen={isAlertOpen}
				leastDestructiveRef={cancelRef}
				onClose={closeAlert}
				size={"xl"}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
							Close Case
						</AlertDialogHeader>

						<AlertDialogBody>
							<Textarea
								placeholder='Actions Taken'
								resize={"none"}
								onChange={(e) => setActionsTaken(e.target.value)}
							/>
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={closeAlert}>
								Cancel
							</Button>
							<Button
								colorScheme='green'
								onClick={() => {
									handleCloseCase(caseToClose);
									window.location.reload();
								}}
								ml={3}
							>
								Submit
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	) : null;
}
