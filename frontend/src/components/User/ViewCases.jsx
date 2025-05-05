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
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Text,
	Tooltip,
	useDisclosure,
	Select,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import { FaRegEdit } from "react-icons/fa";
import { IoMdEye, IoMdAdd, IoMdArrowRoundBack } from "react-icons/io";
import { TbSettingsDollar, TbTrashXFilled } from "react-icons/tb";

// Custom Component Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

export default function ViewCases() {
	const toast = useToast();
	const navigate = useNavigate();

	const [cases, setCases] = useState([]);
	const [selectedCase, setSelectedCase] = useState(null);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [gotData, setGotData] = useState(false);

	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${api}/case/getUnassignedCases`, {
					withCredentials: true,
				});
				if (response.status === 200) {
					setCases(response.data.cases);
					console.log(response.data.cases);
					setGotData(true);
				} else {
					setError(response.data.message);
					toast({
						title: "Error",
						description: "Failed to fetch cases.",
						status: "error",
						duration: 3000,
						isClosable: true,
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
	}, [toast]);

	const handleShowDetails = (caseItem) => {
		setSelectedCase(caseItem);
		onOpen();
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
			});
			// Remove accepted case from UI
			setCases((prev) => prev.filter((c) => c._id !== caseId));
			onClose();
		} catch (err) {
			toast({
				title: "Failed to accept case.",
				description: err?.response?.data?.message || "Something went wrong.",
				status: "error",
				duration: 2500,
				isClosable: true,
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
		// <>
		// 	<Box dir='rtl' width={"100%"} height={"87vh"}>
		// 		<Box
		// 			display={"flex"}
		// 			flexDirection={"column"}
		// 			justifyContent={"center"}
		// 			alignItems={"center"}
		// 			height={"15%"}
		// 			my={5}
		// 		>
		// 			<Text
		// 				fontSize={"35px"}
		// 				color={"#121211"}
		// 				fontWeight={500}
		// 				textDecoration={"underline"}
		// 			>
		// 				الحالات المستنية
		// 			</Text>
		// 		</Box>
		// 		<Box
		// 			display={"flex"}
		// 			flexDirection={"column"}
		// 			justifyContent={"center"}
		// 			alignItems={"center"}
		// 			width={"100%"}
		// 			height={"70%"}
		// 		>
		// 			<TableContainer width={"80%"} maxHeight={"70vh"} overflowY={"auto"}>
		// 				<Table variant='simple' size='md'>
		// 					<Thead>
		// 						<Tr>
		// 							<Th textAlign={"left"}>الاسم الكامل</Th>
		// 							<Th textAlign={"center"}>البريد الإلكتروني</Th>
		// 							<Th textAlign={"center"}>رقم الموبايل</Th>
		// 							<Th textAlign={"right"}>عرض التفاصيل</Th>
		// 						</Tr>
		// 					</Thead>
		// 					<Tbody>
		// 						{cases.map((row) => (
		// 							<Tr key={row._id}>
		// 								<Td textAlign={"left"}>{`${row.fullName}`}</Td>
		// 								<Td textAlign={"center"}>{row.email}</Td>
		// 								<Td textAlign={"center"}>{row.mobileNumber}</Td>
		// 								<Td textAlign={"right"}>
		// 									<Button
		// 										_hover={{
		// 											bg: "yellowgreen",
		// 											color: "#000",
		// 											transform: "scale(1.01)",
		// 										}}
		// 										_active={{
		// 											transform: "scale(0.99)",
		// 											opacity: "0.5",
		// 										}}
		// 										onClick={() => {
		// 											navigate(`/owner-details/${row._id}`);
		// 										}}
		// 										rightIcon={<IoMdEye />}
		// 									>
		// 										عرض
		// 									</Button>
		// 								</Td>
		// 							</Tr>
		// 						))}
		// 					</Tbody>
		// 				</Table>
		// 			</TableContainer>
		// 		</Box>
		// 		<Box
		// 			display={"flex"}
		// 			justifyContent={"center"}
		// 			alignItems={"center"}
		// 			height={"10%"}
		// 		>
		// 			<Button
		// 				_hover={{
		// 					bg: "yellowgreen",
		// 					color: "#000",
		// 					transform: "scale(1.01)",
		// 				}}
		// 				_active={{
		// 					transform: "scale(0.99)",
		// 					opacity: "0.5",
		// 				}}
		// 				onClick={() => {
		// 					localStorage.removeItem("ownerFilterData");
		// 					navigate("/search-owner");
		// 				}}
		// 				rightIcon={<IoMdArrowRoundBack />}
		// 				width={"25vw"}
		// 			>
		// 				الرجوع لصفحة البحث
		// 			</Button>
		// 		</Box>
		// 	</Box>
		// 	<Footer />
		// </>

		<>
			<Box dir='rtl' px={10} pt={10} minHeight='87vh'>
				<Text
					fontSize='3xl'
					fontWeight='bold'
					mb={6}
					textAlign='center'
					textDecoration='underline'
				>
					الحالات المستنية
				</Text>

				<TableContainer>
					<Table variant='striped' colorScheme='gray'>
						<Thead>
							<Tr>
								<Th>اسم الحيوان</Th>
								<Th>السلالة</Th>
								<Th>النوع</Th>
								<Th>فئة الوزن</Th>
								<Th>البريد الإلكتروني للمالك</Th>
								<Th>تفاصيل</Th>
							</Tr>
						</Thead>
						<Tbody>
							{cases.map((item) => (
								<Tr key={item._id}>
									<Td>{item.petId.name}</Td>
									<Td>{item.petId.breed}</Td>
									<Td>{item.petId.type}</Td>
									<Td>{item.petId.weightClass}</Td>
									<Td>{item.email}</Td>
									<Td>
										<Button
											rightIcon={<IoMdEye />}
											onClick={() => handleShowDetails(item)}
											colorScheme='green'
											variant='solid'
										>
											عرض
										</Button>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</TableContainer>
			</Box>

			<Footer />

			{/* Modal for Case Details */}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent dir='rtl'>
					<ModalHeader>تفاصيل الحالة</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text fontSize='lg'>
							<strong>السبب للزيارة:</strong>
							<br />
							{selectedCase?.reasonForVisit || "غير متوفر"}
						</Text>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme='green'
							mr={3}
							onClick={() => handleAcceptCase(selectedCase._id)}
						>
							قبول الحالة
						</Button>
						<Button onClick={onClose}>إلغاء</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	) : (
		<></>
	);
}
