// React Imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import {
	Box,
	Button,
	Table,
	TableContainer,
	Th,
	Thead,
	Tr,
	Td,
	Tbody,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Text,
	Textarea,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import { IoMdEye, IoMdArrowRoundBack } from "react-icons/io";

// Custom Component Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

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

export default function ViewCases() {
	const toast = useToast();
	const navigate = useNavigate();

	const [cases, setCases] = useState([]);
	const [selectedCase, setSelectedCase] = useState(null);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [gotData, setGotData] = useState(false);
	const [existsCases, setExistsCases] = useState(false);

	const [editMode, setEditMode] = useState(false);
	const [updatedReason, setUpdatedReason] = useState("");

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

	const handleCloseModal = () => {
		setEditMode(false);
		setSelectedCase(null);
		setUpdatedReason("");
		closeModal();
	};
	const handleCloseAlert = () => {
		setSelectedCase(null);
		closeAlert();
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${api}/case/getUnassignedCases`, {
					withCredentials: true,
				});
				if (response.status === 200) {
					setCases(response.data.cases);
					setGotData(true);
					setExistsCases(response.data.cases.length > 0);
				}
			} catch (error) {
				if (error.response.status === 500) {
					setError(error.response.data.message);
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
		fetchData();
	}, [toast]);

	const handleShowDetails = (caseItem) => {
		setSelectedCase(caseItem);
		openModal();
	};

	const handleDeleteCase = async (caseItem) => {
		try {
			const response = await axios.delete(
				`${api}/case/deleteCase/${caseItem._id}`,
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				toast({
					title: "Case deleted.",
					status: "success",
					duration: 2000,
					isClosable: true,
					position: "top",
				});
			} else {
				toast({
					title: "Failed to delete case.",
					description: response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			}
			// Remove deleted case from UI
			setCases((prev) => prev.filter((c) => c._id !== caseItem._id));
		} catch (err) {
			toast({
				title: "Failed to delete case.",
				description: err?.response?.data?.message || "Something went wrong.",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		}
	};

	const handleAcceptCase = async (caseId) => {
		try {
			await axios.patch(
				`${api}/case/${caseId}/acceptCase`,
				{},
				{ withCredentials: true }
			);
			toast({
				title: "Case accepted.",
				status: "success",
				duration: 2000,
				isClosable: true,
				position: "top",
			});
			// Remove accepted case from UI
			setCases((prev) => prev.filter((c) => c._id !== caseId));
			closeModal();
			navigate("/assigned-cases");
		} catch (err) {
			toast({
				title: "Failed to accept case.",
				description: err?.response?.data?.message || "Something went wrong.",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		}
	};

	const handleUpdateCase = async (caseId) => {
		try {
			await axios.put(
				`${api}/case/updateCase/${caseId}`,
				{ reasonForVisit: updatedReason },
				{ withCredentials: true }
			);
			toast({
				title: "Case updated.",
				status: "success",
				duration: 2000,
				isClosable: true,
				position: "top",
			});
			handleCloseModal();
			setCases((prev) =>
				prev.map((c) =>
					c._id === caseId ? { ...c, reasonForVisit: updatedReason } : c
				)
			);
		} catch (err) {
			toast({
				title: "Failed to update case.",
				description: err?.response?.data?.message || "Something went wrong.",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		}
	};

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
						navigate("/");
					}}
					rightIcon={<IoMdArrowRoundBack />}
					bg={"#FFF"}
					width={"25vw"}
					mt={10}
				>
					الرجوع
				</Button>
			</Box>
			<Footer />
		</>
	) : !existsCases ? (
		<>
			<Box dir='rtl' width={"100%"} height={"87vh"}>
				<Box
					display={"flex"}
					flexDirection={"column"}
					justifyContent={"center"}
					alignItems={"center"}
					height={"15%"}
					my={5}
				>
					<Text
						fontSize={"35px"}
						color={"#121211"}
						fontWeight={500}
						textDecoration={"underline"}
					>
						الحالت المفتوحة
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
					<Text fontSize={"20px"} color={"#121211"}>
						لا توجد حالات متاحة
					</Text>
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
							localStorage.removeItem("ownerFilterData");
							localStorage.getItem("userRole") === "vet"
								? navigate("/vet")
								: localStorage.getItem("userRole") === "secretary"
								? navigate("/secretary")
								: navigate("/admin");
						}}
						rightIcon={<IoMdArrowRoundBack />}
						width={"25vw"}
					>
						الرجوع
					</Button>
				</Box>
			</Box>
		</>
	) : gotData ? (
		<>
			<Box dir='rtl' width={"100%"} height={"87vh"}>
				<Box
					display={"flex"}
					flexDirection={"column"}
					justifyContent={"center"}
					alignItems={"center"}
					height={"15%"}
					my={5}
				>
					<Text
						fontSize={"35px"}
						color={"#121211"}
						fontWeight={500}
						textDecoration={"underline"}
					>
						الحالات المستنية
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
					{cases.length === 0 ? (
						<Text fontSize={"20px"} color={"#121211"}>
							لا توجد حالات متاحة
						</Text>
					) : (
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
											<Th textAlign={"center"}>تفاصيل</Th>
										</Tr>
									</Thead>
									<Tbody>
										{cases.map((row) => (
											<Tr key={row._id}>
												<Td textAlign={"right"}>{`${row.petId.name}`}</Td>
												<Td textAlign={"center"}>{`${titleCase(
													row.petId.breed
												)}`}</Td>
												<Td textAlign={"center"}>{`${titleCase(
													row.petId.type
												)}`}</Td>
												<Td
													textAlign={"center"}
												>{`${row.petId.weightClass}`}</Td>

												<Td textAlign={"center"}>
													{localStorage.getItem("userRole") === "vet" ? (
														<Button
															rightIcon={<IoMdEye />}
															onClick={() => handleShowDetails(row)}
															variant='solid'
														>
															عرض
														</Button>
													) : (
														<>
															<Button
																rightIcon={<IoMdEye />}
																onClick={() => {
																	setEditMode(true);
																	setSelectedCase(row);
																	openModal();
																}}
																_hover={{
																	bg: "blue.500",
																	color: "#FFF",
																	transform: "scale(1.01)",
																}}
																variant='solid'
																ml={2}
															>
																Edit
															</Button>

															<Button
																rightIcon={<IoMdEye />}
																onClick={() => {
																	openAlert();
																	setSelectedCase(row);
																}}
																_hover={{
																	bg: "red.500",
																	color: "#FFF",
																	transform: "scale(1.01)",
																}}
																variant='solid'
																mr={2}
															>
																Delete
															</Button>
														</>
													)}
												</Td>
											</Tr>
										))}
									</Tbody>
								</Table>
							</TableContainer>
						</>
					)}
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
							localStorage.removeItem("ownerFilterData");
							localStorage.getItem("userRole") === "vet"
								? navigate("/vet")
								: localStorage.getItem("userRole") === "secretary"
								? navigate("/secretary")
								: navigate("/admin");
						}}
						rightIcon={<IoMdArrowRoundBack />}
						width={"25vw"}
					>
						الرجوع
					</Button>
				</Box>
			</Box>
			<Footer />

			{/* Modal for Case Details */}
			<Modal isOpen={isModalOpen} onClose={closeModal}>
				<ModalOverlay />
				<ModalContent dir='rtl'>
					<ModalHeader textAlign={"center"}>تفاصيل الحالة</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{editMode ? (
							<>
								<Textarea
									placeholder={selectedCase?.reasonForVisit}
									onChange={(e) => {
										setUpdatedReason(e.target.value);
									}}
									resize={"none"}
									scrollBehavior={"smooth"}
								/>
							</>
						) : (
							<>
								<Text fontSize='lg'>
									<strong>السبب للزيارة:</strong>
									<br />
									{selectedCase?.reasonForVisit || "غير متوفر"}
								</Text>
							</>
						)}
					</ModalBody>
					<ModalFooter>
						{editMode ? (
							<Button
								colorScheme='green'
								ml={3}
								onClick={() => {
									handleUpdateCase(selectedCase._id);
									handleCloseModal();
								}}
							>
								تحديث
							</Button>
						) : (
							<Button
								colorScheme='green'
								ml={3}
								onClick={() => {
									handleAcceptCase(selectedCase._id);
									handleCloseModal();
								}}
							>
								قبول
							</Button>
						)}

						<Button onClick={closeModal}>إلغاء</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<AlertDialog
				isOpen={isAlertOpen}
				leastDestructiveRef={cancelRef}
				onClose={closeAlert}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
							Delete Case
						</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure? You can't undo this action afterwards.
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={() => handleCloseAlert()}>
								Cancel
							</Button>
							<Button
								colorScheme='red'
								onClick={() => {
									handleDeleteCase(selectedCase);
									handleCloseAlert();
								}}
								ml={3}
							>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	) : (
		<></>
	);
}
