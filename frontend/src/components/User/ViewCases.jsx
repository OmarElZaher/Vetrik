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
	Icon,
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
	useColorModeValue,
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

	const bg = useColorModeValue("gray.50", "gray.900");
	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const tableHeadBg = useColorModeValue("gray.100", "gray.700");
	const tableRowHover = useColorModeValue("gray.50", "gray.900");
	const titleColor = useColorModeValue("gray.900", "gray.100");
	const btnBackBg = useColorModeValue("gray.100", "gray.700");

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
	) : (
		<>
			<Box dir='rtl' bg={bg} minH='100vh' py={8} px={{ base: 2, md: 0 }}>
				<Box
					bg={cardBg}
					rounded='2xl'
					shadow='md'
					maxW='1500px'
					w='96vw'
					mx='auto'
					p={{ base: 4, md: 10 }}
					border='1px solid'
					borderColor={borderColor}
				>
					{/* Header */}
					<Box textAlign='center' mb={7}>
						{/* Use an eye icon, e.g., from react-icons */}
						<Icon as={IoMdEye} boxSize={14} color='blue.500' mb={2} />
						<Text
							as='h1'
							fontWeight='bold'
							fontSize='3xl'
							textDecoration='underline'
							color={titleColor}
							mb={1}
						>
							الحالات المنتظرة
						</Text>
					</Box>

					{/* Table */}
					<TableContainer>
						<Table variant='simple' size='md'>
							<Thead bg={tableHeadBg}>
								<Tr>
									<Th textAlign='center'>اسم الحيوان</Th>
									<Th textAlign='center'>النوع</Th>
									<Th textAlign='center'>السلالة</Th>
									<Th textAlign='center'>فئة الوزن</Th>
									<Th textAlign='center'>تفاصيل</Th>
								</Tr>
							</Thead>
							<Tbody>
								{cases.length === 0 ? (
									<Tr>
										<Td colSpan={5} textAlign='center' py={10}>
											<Text color='gray.400' fontWeight='bold'>
												لا توجد حالات متاحة
											</Text>
										</Td>
									</Tr>
								) : (
									cases.map((row) => (
										<Tr key={row._id} _hover={{ bg: tableRowHover }}>
											<Td textAlign='center'>{row.petId?.name || ""}</Td>
											<Td textAlign='center'>{row.petId?.type || ""}</Td>
											<Td textAlign='center'>{row.petId?.breed || ""}</Td>
											<Td textAlign='center'>{row.petId?.weightClass || ""}</Td>
											<Td textAlign='center'>
												<Button
													size='sm'
													colorScheme='blue'
													rightIcon={<IoMdEye />}
													onClick={() => handleShowDetails(row)}
													mx={1}
												>
													عرض
												</Button>
												<Button
													size='sm'
													colorScheme='gray'
													variant='outline'
													onClick={() => {
														setEditMode(true);
														setSelectedCase(row);
														openModal();
													}}
													mx={1}
												>
													تحرير
												</Button>
												<Button
													size='sm'
													colorScheme='red'
													variant='outline'
													onClick={() => {
														openAlert();
														setSelectedCase(row);
													}}
													mx={1}
												>
													حذف
												</Button>
											</Td>
										</Tr>
									))
								)}
							</Tbody>
						</Table>
					</TableContainer>

					{/* Back Button */}
					<Box mt={10} display='flex' justifyContent='center'>
						<Button
							bg={btnBackBg}
							width={["90%", "60%", "40%", "25vw"]}
							rightIcon={<IoMdArrowRoundBack />}
							onClick={() => {
								localStorage.removeItem("ownerFilterData");
								const role = localStorage.getItem("userRole");
								if (role === "vet") navigate("/vet");
								else if (role === "secretary") navigate("/secretary");
								else navigate("/admin");
							}}
							fontWeight='bold'
							fontSize='lg'
							rounded='lg'
							_active={{ transform: "scale(0.97)", opacity: 0.8 }}
							_hover={{
								bg: "yellowgreen",
								color: "#000",
								transform: "scale(1.01)",
							}}
						>
							رجوع
						</Button>
					</Box>
				</Box>

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
			</Box>
		</>
	);
}
