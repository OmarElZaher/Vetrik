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
	Card,
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
import { IoMdArrowRoundBack, IoMdClose, IoMdEye } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { FaCheck, FaFile } from "react-icons/fa6";

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

export default function AssignedCases() {
	const toast = useToast();
	const navigate = useNavigate();

	const [cases, setCases] = useState([]);
	const [selectedCase, setSelectedCase] = useState(null);
	const [existsCases, setExistsCases] = useState(false);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [gotData, setGotData] = useState(false);

	const [actionsTaken, setActionsTaken] = useState("");

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
				const response = await axios.get(`${api}/case/getAssignedCases`, {
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

	const handleOpenModal = (caseItem) => {
		setSelectedCase(caseItem);
		openModal();
	};

	const handleCompleteCase = async (caseItem) => {
		if (!actionsTaken) {
			toast({
				title: "Actions Taken Required",
				description: "Please provide actions taken before closing the case.",
				status: "warning",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
			return;
		}
		try {
			setIsLoading(true);
			await axios.patch(
				`${api}/case/${caseItem._id}/completeCase`,
				{ actionsTaken: actionsTaken },
				{ withCredentials: true }
			);
			toast({
				title: "Case Closed!",
				status: "success",
				duration: 2000,
				isClosable: true,
				position: "top",
			});
			// Remove accepted case from UI
			setCases((prev) => prev.filter((c) => c._id !== caseItem._id));
		} catch (error) {
			toast({
				title: "Failed to complete case.",
				description: error?.response?.data?.message || "Something went wrong.",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		} finally {
			setIsLoading(false);
			setActionsTaken("");
			closeModal();
		}
	};

	const handleUnassignCase = async (caseItem) => {
		try {
			await axios.patch(
				`${api}/case/${caseItem._id}/unassignCase`,
				{},
				{ withCredentials: true }
			);
			toast({
				title: "Case Unassigned!",
				status: "success",
				duration: 2000,
				isClosable: true,
				position: "top",
			});
			// Remove accepted case from UI
			setCases((prev) => prev.filter((c) => c._id !== caseItem._id));
		} catch (error) {
			toast({
				title: "Failed to unassign case.",
				description: error?.response?.data?.message || "Something went wrong.",
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
						if (localStorage.getItem("userRole") === "vet") {
							navigate("/vet");
						}
						if (localStorage.getItem("userRole") === "secretary") {
							navigate("/secretary");
						}
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
						الحالات المخصصة
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
											<Th textAlign={"center"}>الأفعال المطلوبة</Th>
											<Th textAlign={"center"}>أفعال</Th>
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
													<Button
														rightIcon={<IoMdEye />}
														onClick={() => {
															openAlert();
															setSelectedCase(row);
															console.log(row);
														}}
													>
														عرض تفاصيل
													</Button>

													<Button
														mr={2}
														rightIcon={<FaFile />}
														variant='outline'
														onClick={() => {
															navigate(`/pet-details/${row.petId._id}`);
														}}
													>
														ملف الحيوان
													</Button>
												</Td>

												<Td textAlign={"center"}>
													<Button
														ml={2}
														rightIcon={<FaCheck />}
														onClick={() => handleOpenModal(row)}
														variant='solid'
														_hover={{
															bg: "green.600",
															color: "#fff",
														}}
													>
														إغلاق الحالة
													</Button>
													<Button
														mr={2}
														rightIcon={<FaTrash />}
														onClick={() => {
															if (
																!window.confirm(
																	"هل أنت متأكد أنك تريد إلغاء هذه الحالة؟"
																)
															)
																return;
															handleUnassignCase(row);
														}}
														variant='solid'
														_hover={{
															bg: "red.600",
															color: "#fff",
														}}
													>
														إلغاء الحالة
													</Button>
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
							if (localStorage.getItem("userRole") === "vet") {
								navigate("/vet");
							}
							if (localStorage.getItem("userRole") === "secretary") {
								navigate("/secretary");
							}
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
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				motionPreset='slideInBottom'
				size={"xl"}
			>
				<ModalOverlay
					bg='blackAlpha.300'
					backdropFilter='blur(10px) hue-rotate(90deg)'
				/>
				<ModalContent dir='rtl'>
					<ModalHeader textAlign={"center"}>تفاصيل الحالة</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Textarea
							resize={"none"}
							autoresize
							placeholder='الأفعال التي تم اتأخذها'
							value={actionsTaken}
							onChange={(e) => setActionsTaken(e.target.value)}
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							ml={3}
							_hover={{
								bg: "green.600",
								color: "#fff",
							}}
							rightIcon={<FaCheck />}
							onClick={() => handleCompleteCase(selectedCase)}
						>
							إغلاق الحالة
						</Button>
						<Button
							onClick={closeModal}
							_hover={{
								bg: "red.600",
								color: "#fff",
							}}
							rightIcon={<IoMdClose />}
						>
							إلغاء
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
							Case Details
						</AlertDialogHeader>

						<hr />

						<AlertDialogBody
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
						>
							<Card
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"80%"}
								height={"100%"}
								mt={5}
							>
								<Text
									fontSize={"16px"}
									color={"#121211"}
									overflowY={"auto"}
									scrollBehavior={"smooth"}
								>
									{selectedCase?.reasonForVisit}
								</Text>
							</Card>
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={closeAlert}>
								Close
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
