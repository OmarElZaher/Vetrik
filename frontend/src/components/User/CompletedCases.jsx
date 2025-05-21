import React, { useEffect, useState } from "react";
import axios from "axios";

import { formatDistanceToNow } from "date-fns";

import {
	Box,
	Button,
	Divider,
	Table,
	TableContainer,
	Th,
	Thead,
	Tr,
	Td,
	Tbody,
	Image,
	Flex,
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
	ModalBody,
	ModalFooter,
	Icon,
	Input,
	Text,
	SimpleGrid,
	useDisclosure,
	useToast,
	useColorModeValue,
} from "@chakra-ui/react";

import { IoMdCheckmark } from "react-icons/io";
import { FaHeart } from "react-icons/fa";

import { FaEye } from "react-icons/fa";

import Spinner from "../General/Spinner";

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

export default function CompletedCases() {
	const [completedCases, setCompletedCases] = useState([]);
	const [loading, setLoading] = useState(true);

	const [selectedCase, setSelectedCase] = useState(null);

	const {
		isOpen: isModalOpen,
		onOpen: openModal,
		onClose: closeModal,
	} = useDisclosure();

	const {
		isOpen: isConfirmCloseOpen,
		onOpen: openConfirmClose,
		onClose: closeConfirmClose,
	} = useDisclosure();

	const confirmCancelRef = React.useRef();
	const [caseToClose, setCaseToClose] = useState(null);

	const [fadingCaseId, setFadingCaseId] = useState(null);

	const [searchTerm, setSearchTerm] = useState("");
	const [filteredCases, setFilteredCases] = useState([]);

	const tableBg = useColorModeValue("gray.100", "gray.700");

	const StatCard = ({ icon, label, value, color = "blue.500" }) => (
		<Box
			p={5}
			bg={useColorModeValue("white", "gray.800")}
			borderRadius='lg'
			boxShadow='md'
			textAlign='center'
		>
			<Icon as={icon} boxSize={6} color={color} mb={2} />
			<Text fontSize='lg' fontWeight='bold' color={color}>
				{value}
			</Text>
			<Text fontSize='sm' color='gray.500'>
				{label}
			</Text>
		</Box>
	);

	const handleCloseModal = () => {
		setSelectedCase(null);
		closeModal();
	};

	const toast = useToast();

	useEffect(() => {
		const fetchCompletedCases = async () => {
			try {
				const response = await axios.get(`${api}/case/getCompletedCases`, {
					withCredentials: true,
				});

				if (response.status === 200) {
					setCompletedCases(response.data.cases);
				} else {
					toast({
						title: "Error fetching completed cases",
						description: response.data.message,
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
			} catch (error) {
				toast({
					title: "Error fetching completed cases",
					description: error.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchCompletedCases();
	}, [toast]);

	useEffect(() => {
		const lower = searchTerm.toLowerCase();
		const results = completedCases.filter((c) =>
			c.petId?.name?.toLowerCase().includes(lower)
		);
		setFilteredCases(results);
	}, [searchTerm, completedCases]);

	const highlightMatch = (text, query) => {
		if (!query) return titleCase(text);
		const regex = new RegExp(`(${query})`, "gi");
		const parts = text.split(regex);

		return parts.map((part, i) =>
			part.toLowerCase() === query.toLowerCase() ? (
				<Text as='mark' key={i} color='blue.400' bg='transparent'>
					{part}
				</Text>
			) : (
				<React.Fragment key={i}>{part}</React.Fragment>
			)
		);
	};

	const handleCloseCase = async (caseId) => {
		try {
			const response = await axios.patch(
				`${api}/case/${caseId}/closeCase`,
				{},
				{ withCredentials: true }
			);

			if (response.status === 200) {
				setFadingCaseId(caseId); // Start fade
				toast({
					title: " تم إغلاق الحالة بنجاح",
					status: "success",
					duration: 2500,
					isClosable: true,
					position: "top",
				});

				// Wait for fade to complete, then remove
				setTimeout(() => {
					setCompletedCases((prev) =>
						prev.filter((completedCase) => completedCase._id !== caseId)
					);
					setFadingCaseId(null);
				}, 400); // fade duration
			} else {
				toast({
					title: "خطأ في الإغلاق",
					description: response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			}
		} catch (error) {
			toast({
				title: "خطأ في الإغلاق",
				description: error.message,
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		}
	};

	return loading ? (
		<Spinner />
	) : (
		<Box dir='rtl'>
			<Text fontSize='2xl' fontWeight='bold' mb={6} textAlign='center'>
				✅ الحالات المكتملة
			</Text>

			<Box h={6} />

			<Input
				placeholder='🔍 ابحث باسم الحيوان...'
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				mb={6}
				w={{ base: "100%", md: "300px" }}
				textAlign='right'
				borderColor='gray.300'
				_dark={{ borderColor: "gray.600" }}
			/>

			{completedCases.length === 0 ? (
				<Flex
					direction='column'
					align='center'
					justify='center'
					mt={12}
					opacity={0.7}
				>
					<Image
						src='https://cdn-icons-png.flaticon.com/512/616/616408.png'
						alt='dog icon'
						boxSize='90px'
						mb={4}
					/>
					<Text fontSize='lg' color='gray.500' textAlign='center'>
						تم إغلاق جميع الحالات. استرح قليلاً ☕️
					</Text>
				</Flex>
			) : (
				<>
					<TableContainer overflowX='auto' width={"80%"} m='auto'>
						<Table variant='simple'>
							<Thead>
								<Tr>
									<Th textAlign={"center"}>اسم الحيوان</Th>
									<Th textAlign={"center"}>النوع</Th>
									<Th textAlign={"center"}>الإجراء</Th>
									<Th textAlign={"center"}>الإجراءات المتخذة</Th>
									<Th textAlign={"center"}>تاريخ الإغلاق</Th>
								</Tr>
							</Thead>
							<Tbody>
								{filteredCases.map((caseItem) => (
									<Tr
										key={caseItem._id}
										opacity={fadingCaseId === caseItem._id ? 0 : 1}
										_hover={{
											background: tableBg,
										}}
										transition='opacity background 0.4s'
									>
										<Td textAlign={"center"}>
											{highlightMatch(caseItem.petId?.name, searchTerm)}
										</Td>
										<Td textAlign={"center"}>
											{titleCase(caseItem.petId?.type)}
										</Td>
										<Td textAlign={"center"}>
											<Button
												size='sm'
												colorScheme='gray'
												leftIcon={<FaEye />}
												onClick={() => {
													setSelectedCase(caseItem);
													openModal();
												}}
											>
												عرض التفاصيل
											</Button>
										</Td>
										<Td textAlign={"center"}>
											<Text fontSize='sm' color='gray.600' noOfLines={2}>
												{caseItem.actionsTaken}
											</Text>
										</Td>
										<Td
											fontSize='sm'
											color='gray.500'
											dir='ltr'
											textAlign={"center"}
										>
											{formatDistanceToNow(new Date(caseItem.updatedAt), {
												addSuffix: true,
											})}
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</TableContainer>

					<Box h={6} />

					<SimpleGrid
						columns={{ base: 1, md: 2 }}
						spacing={6}
						mt={10}
						width={"80%"}
						m='auto'
					>
						<StatCard
							label='عدد الحالات المكتملة'
							value={completedCases.length}
							icon={IoMdCheckmark}
						/>
						<StatCard
							label='نصيحة اليوم'
							value='تابع التطعيمات الدورية'
							icon={FaHeart}
							color='red.400'
						/>
					</SimpleGrid>
				</>
			)}

			{/* Case Detail Modal */}
			<Modal isOpen={isModalOpen} onClose={handleCloseModal} isCentered>
				<ModalOverlay />
				<ModalContent dir='rtl'>
					<ModalHeader>تفاصيل الحالة</ModalHeader>
					<ModalBody>
						{selectedCase && (
							<>
								<Text mb={2}>
									<strong>اسم الحيوان:</strong>{" "}
									{titleCase(selectedCase.petId?.name)}
								</Text>
								<Text mb={2}>
									<strong>النوع:</strong> {titleCase(selectedCase.petId?.type)}
								</Text>
								<Divider my={3} />
								<Text mb={2}>
									<strong>سبب الزيارة:</strong> {selectedCase.reasonForVisit}
								</Text>
								<Text mb={2}>
									<strong>الإجراءات المتخذة:</strong>{" "}
									{selectedCase.actionsTaken}
								</Text>
							</>
						)}
					</ModalBody>
					<ModalFooter>
						<Button variant='ghost' onClick={handleCloseModal}>
							إلغاء
						</Button>
						<Button
							colorScheme='red'
							mr={3}
							leftIcon={<IoMdCheckmark />}
							onClick={() => {
								setCaseToClose(selectedCase);
								openConfirmClose();
							}}
						>
							إغلاق الحالة نهائياً
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<AlertDialog
				isOpen={isConfirmCloseOpen}
				leastDestructiveRef={confirmCancelRef}
				onClose={closeConfirmClose}
				isCentered
			>
				<AlertDialogOverlay />
				<AlertDialogContent dir='rtl'>
					<AlertDialogHeader fontSize='lg' fontWeight='bold'>
						تأكيد إغلاق الحالة
					</AlertDialogHeader>

					<AlertDialogBody>
						هل أنت متأكد أنك تريد إغلاق هذه الحالة نهائياً؟ هذا الإجراء لا يمكن
						التراجع عنه.
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button ref={confirmCancelRef} onClick={closeConfirmClose} ml={2}>
							إلغاء
						</Button>
						<Button
							colorScheme='red'
							onClick={() => {
								handleCloseCase(caseToClose._id);
								closeConfirmClose();
								handleCloseModal();
							}}
							mr={3}
						>
							تأكيد الإغلاق
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Box>
	);
}
