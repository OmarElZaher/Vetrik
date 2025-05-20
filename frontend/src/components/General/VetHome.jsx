import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
	Box,
	Text,
	Button,
	Tag,
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
	ModalBody,
	ModalFooter,
	Flex,
	Image,
	SimpleGrid,
	useDisclosure,
	useToast,
	useColorModeValue,
} from "@chakra-ui/react";

import Spinner from "./Spinner";

import { FaFolderOpen, FaUserMd, FaCheckCircle } from "react-icons/fa";

import { IoMdEye } from "react-icons/io";

import { API_URL as api } from "../../utils/constants";

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

export default function VetHome() {
	const toast = useToast();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);

	const [role, setRole] = useState("");

	const [openCases, setOpenCases] = useState([]);
	const [selectedCase, setSelectedCase] = useState(null);

	const { isOpen, onOpen, onClose } = useDisclosure();

	const cardBg = useColorModeValue("white", "gray.700");
	const iconColor = useColorModeValue("#2F80ED", "#56CCF2");
	const tableColor = useColorModeValue("gray.100", "gray.700");

	useEffect(() => {
		const fetchOpenCases = async () => {
			try {
				setLoading(true);
				const response = await axios.get(`${api}/case/getUnassignedCases`, {
					withCredentials: true,
				});

				if (response.status === 200) {
					setOpenCases(response.data.cases);
				}
			} catch (error) {
				if (error.response.status === 500) {
					toast({
						title: "Error",
						description: error.response.data.message,
						status: "error",
						duration: 3000,
						isClosable: true,
						position: "top",
					});
				}
			} finally {
				setLoading(false);
			}
		};

		const fetchUserRole = async () => {
			try {
				const response = await axios.get(`${api}/user/getUserInfo`, {
					withCredentials: true,
				});
				if (response.status === 200) {
					setRole(response.data.role);
				} else {
					toast({
						title: "Error",
						description: response.data.message,
						status: "error",
						duration: 3000,
						isClosable: true,
						position: "top",
					});
				}
			} catch (error) {
				toast({
					title: "Error",
					description: error.response.data.message,
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "top",
				});
			}
		};

		fetchUserRole();

		if (role === "secretary") {
			navigate("/secretary");
		}

		fetchOpenCases();
	}, [navigate, role, toast]);

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
			setOpenCases((prev) => prev.filter((c) => c._id !== caseId));
			onClose();
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

	const handleShowDetails = (caseItem) => {
		setSelectedCase(caseItem);
		onOpen();
	};

	return loading ? (
		<Spinner />
	) : (
		<Box dir='rtl'>
			{/* Greeting */}
			<Text fontSize='2xl' fontWeight='bold' mb={6} textAlign='center'>
				👋 مرحباً دكتور
			</Text>

			{/* Dashboard Quick Access Cards */}
			<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={10}>
				{/* الحالات المفتوحة */}
				<Box
					bg={cardBg}
					p={6}
					rounded='lg'
					boxShadow='md'
					display='flex'
					alignItems='center'
					justifyContent='space-between'
					cursor='pointer'
					onClick={() => navigate("/view-cases")}
					_hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
					transition={"all 0.2s ease"}
				>
					<Box>
						<Text fontSize='lg' fontWeight='bold' mb={1}>
							📂 الحالات المفتوحة
						</Text>
						<Text color='gray.500' fontSize='sm'>
							عرض جميع الحالات التي لم تُغلق بعد
						</Text>
					</Box>
					<FaFolderOpen size='32' color={iconColor} />
				</Box>

				{/* حالاتي المعينة */}
				<Box
					bg={cardBg}
					p={6}
					rounded='lg'
					boxShadow='md'
					display='flex'
					alignItems='center'
					justifyContent='space-between'
					cursor='pointer'
					onClick={() => navigate("/assigned-cases")}
					_hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
					transition={"all 0.2s ease"}
				>
					<Box>
						<Text fontSize='lg' fontWeight='bold' mb={1}>
							🩺 حالاتي المعينة
						</Text>
						<Text color='gray.500' fontSize='sm'>
							الحالات الجارية الخاصة بي
						</Text>
					</Box>
					<FaUserMd size='32' color={iconColor} />
				</Box>

				{/* الحالات المكتملة */}
				<Box
					bg={cardBg}
					p={6}
					rounded='lg'
					boxShadow='md'
					display='flex'
					alignItems='center'
					justifyContent='space-between'
					cursor='pointer'
					onClick={() => navigate("/completed-cases")}
					_hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
					transition={"all 0.2s ease"}
				>
					<Box>
						<Text fontSize='lg' fontWeight='bold' mb={1}>
							✅ الحالات المكتملة
						</Text>
						<Text color='gray.500' fontSize='sm'>
							عرض الحالات التي تم إنهاؤها
						</Text>
					</Box>
					<FaCheckCircle size='32' color={iconColor} />
				</Box>
			</SimpleGrid>

			<Text fontSize='xl' fontWeight='semibold' mb={4} textAlign='center'>
				🗂 الحالات المتاحة للتعيين
			</Text>

			{openCases.length === 0 ? (
				<>
					<Text textAlign='center' color='gray.500'>
						لا توجد حالات متاحة حالياً
					</Text>

					<Flex justify='center' mt={4}>
						<Image
							src='https://cdn-icons-png.flaticon.com/512/5787/5787030.png'
							alt='no cases'
							boxSize='100px'
							opacity={0.6}
						/>
					</Flex>
				</>
			) : (
				<>
					<TableContainer>
						<Table variant='simple'>
							<Thead>
								<Tr>
									<Th textAlign={"center"}>اسم الحيوان</Th>
									<Th textAlign={"center"}>النوع</Th>
									<Th textAlign={"center"}>المالك</Th>
									<Th textAlign={"center"} />
									<Th textAlign={"center"}>الإجراء</Th>
								</Tr>
							</Thead>
							<Tbody>
								{openCases.map((caseItem) => (
									<Tr key={caseItem._id} _hover={{ bg: tableColor }}>
										<Td textAlign={"center"}>
											{titleCase(caseItem.petId?.name)}
											<Text
												fontSize='sm'
												color='gray.500'
												noOfLines={2}
												whiteSpace='normal'
												wordBreak='break-word'
											>
												{caseItem.reasonForVisit}
											</Text>
										</Td>
										<Td textAlign={"center"}>
											<Tag
												colorScheme={
													caseItem.petId?.type === "dog" ? "blue" : "purple"
												}
												size='sm'
												borderRadius='full'
											>
												{titleCase(caseItem.petId?.type)}
											</Tag>
										</Td>
										<Td textAlign={"center"}>
											{caseItem.ownerId?.firstName || "—"}
										</Td>
										<Td textAlign={"center"}>
											<Tag
												colorScheme='blue'
												variant='subtle'
												borderRadius='md'
											>
												غير معين
											</Tag>
										</Td>
										<Td textAlign={"center"}>
											<Button
												size='sm'
												colorScheme='blue'
												onClick={() => handleShowDetails(caseItem)}
												leftIcon={<IoMdEye />}
											>
												عرض التفاصيل
											</Button>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</TableContainer>

					<Modal isOpen={isOpen} onClose={onClose} isCentered>
						<ModalOverlay />
						<ModalContent dir='rtl'>
							<ModalHeader>تفاصيل الحالة</ModalHeader>
							<ModalBody>
								{selectedCase ? (
									<>
										<Text mb={2}>
											<strong>اسم الحيوان:</strong>{" "}
											{titleCase(selectedCase.petId?.name)}
										</Text>
										<Text mb={2}>
											<strong>النوع:</strong>{" "}
											{titleCase(selectedCase.petId?.type)}
										</Text>
										<Text mb={2}>
											<strong>المالك:</strong>{" "}
											{selectedCase.ownerId?.firstName || "—"}
										</Text>
										<Text mb={2}>
											<strong>السبب:</strong> {selectedCase.reasonForVisit}
										</Text>
									</>
								) : (
									<Text>جاري التحميل...</Text>
								)}
							</ModalBody>
							<ModalFooter>
								<Button
									colorScheme='blue'
									ml={3}
									onClick={() => handleAcceptCase(selectedCase._id)}
									isLoading={loading}
									_hover={{ transform: "scale(1.02)" }}
									_active={{
										bg: "blue.500",
										color: "white",
										opacity: 0.8,
										transform: "scale(0.98)",
									}}
								>
									قبول الحالة
								</Button>
								<Button
									variant='ghost'
									onClick={onClose}
									_hover={{
										bg: "#EB5757",
										color: "white",
										transform: "scale(1.02)",
									}}
									_active={{
										bg: "#EB5757",
										color: "white",
										opacity: 0.8,
										transform: "scale(0.98)",
									}}
								>
									إغلاق
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				</>
			)}
		</Box>
	);
}
