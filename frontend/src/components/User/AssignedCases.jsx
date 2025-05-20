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
	Badge,
	Button,
	Collapse,
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogBody,
	AlertDialogFooter,
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
	Text,
	Icon,
	Textarea,
	useDisclosure,
	useToast,
	useColorModeValue,
} from "@chakra-ui/react";

// React Icons Imports
import { FaTrash } from "react-icons/fa";
import { FaFile } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";

// Custom Component Imports
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
	const tableColor = useColorModeValue("gray.100", "gray.700");

	const [cases, setCases] = useState([]);
	const [existsCases, setExistsCases] = useState(false);

	const [activeRowId, setActiveRowId] = useState(null);
	const [actionsMap, setActionsMap] = useState({});

	const [fadingRowId, setFadingRowId] = useState(null);

	const [isLoading, setIsLoading] = useState(true);

	const {
		isOpen: isReasonOpen,
		onOpen: openReasonModal,
		onClose: closeReasonModal,
	} = useDisclosure();

	const [selectedReason, setSelectedReason] = useState("");

	const {
		isOpen: isAlertOpen,
		onOpen: openAlert,
		onClose: closeAlert,
	} = useDisclosure();

	const cancelRef = React.useRef();
	const [caseToUnassign, setCaseToUnassign] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${api}/case/getAssignedCases`, {
					withCredentials: true,
				});
				if (response.status === 200) {
					setCases(response.data.cases);
					setExistsCases(response.data.cases.length > 0);
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

		fetchData();

		if (activeRowId) {
			document
				.getElementById(`case-${activeRowId}`)
				?.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [toast, activeRowId]);

	const handleCompleteCase = async (caseItem, actionsTaken) => {
		if (!actionsTaken) {
			toast({
				title: "يجب إدخال الإجراءات",
				status: "warning",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
			return;
		}

		try {
			await axios.patch(
				`${api}/case/${caseItem._id}/completeCase`,
				{ actionsTaken },
				{ withCredentials: true }
			);
			toast({
				title: `تم إغلاق حالة ${titleCase(caseItem.petId?.name)}`,
				status: "success",
				duration: 2000,
				isClosable: true,
				position: "top",
			});

			setFadingRowId(caseItem._id);
			setTimeout(() => {
				setCases((prev) => prev.filter((c) => c._id !== caseItem._id));
				setFadingRowId(null);
			}, 400);

			setActiveRowId(null);
		} catch (error) {
			toast({
				title: "فشل في إغلاق الحالة",
				description: error?.response?.data?.message || "حدث خطأ ما",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
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
	) : (
		<Box dir='rtl'>
			<Text fontSize='2xl' fontWeight='bold' mb={6} textAlign='center'>
				🩺 الحالات المخصصة
			</Text>

			{!existsCases ? (
				<Text textAlign='center' color='gray.500'>
					لا توجد حالات معينة لك حالياً.
				</Text>
			) : (
				<>
					<TableContainer overflowX={"auto"}>
						<Table variant='simple'>
							<Thead>
								<Tr>
									<Th textAlign={"center"}>اسم الحيوان</Th>
									<Th textAlign={"center"}>السلالة</Th>
									<Th textAlign={"center"}>النوع</Th>
									<Th textAlign={"center"}>فئة الوزن</Th>
									<Th textAlign={"center"}>الإجراءات</Th>
									<Th textAlign={"center"}>الإجراءات</Th>
								</Tr>
							</Thead>
							<Tbody>
								{cases.map((caseItem) => (
									<React.Fragment key={caseItem._id}>
										<Tr
											id={`case-${caseItem._id}`}
											opacity={fadingRowId === caseItem._id ? 0.3 : 1}
											transition='opacity 0.4s'
											_hover={{ bg: tableColor }}
											bg={activeRowId === caseItem._id ? "blue.50" : ""}
										>
											<Td textAlign={"center"}>
												{titleCase(caseItem.petId?.name)}
											</Td>
											<Td textAlign={"center"}>
												{titleCase(caseItem.petId?.breed)}
											</Td>
											<Td textAlign={"center"}>
												{/* {titleCase(caseItem.petId?.type)} */}
												<Badge colorScheme='purple' borderRadius='5px'>
													{titleCase(caseItem.petId?.type)}
												</Badge>
											</Td>
											<Td textAlign={"center"}>
												{caseItem.petId?.weight || "غير معروف"}
											</Td>
											<Td textAlign={"center"}>
												<Button
													size='sm'
													variant='outline'
													colorScheme='purple'
													onClick={() => {
														setSelectedReason(caseItem.reasonForVisit);
														openReasonModal();
													}}
													ml={2}
												>
													عرض السبب
												</Button>

												<Button
													size='sm'
													colorScheme='gray'
													onClick={() =>
														navigate(`/pet-details/${caseItem.petId?._id}`)
													}
													leftIcon={<FaFile />}
													mr={2}
												>
													ملف الحيوان
												</Button>
											</Td>
											<Td textAlign={"center"}>
												<Button
													size='sm'
													colorScheme='blue'
													onClick={() =>
														setActiveRowId(
															activeRowId === caseItem._id ? null : caseItem._id
														)
													}
													ml={2}
												>
													<Icon
														as={FaChevronDown}
														transform={
															activeRowId === caseItem._id
																? "rotate(180deg)"
																: "rotate(0deg)"
														}
														transition='transform 0.2s'
														ml={2}
													/>
													إغلاق الحالة
												</Button>

												<Button
													size='sm'
													colorScheme='red'
													onClick={() => {
														setCaseToUnassign(caseItem);
														openAlert();
													}}
													leftIcon={<FaTrash />}
												>
													إلغاء الحالة
												</Button>
											</Td>
										</Tr>
									</React.Fragment>
								))}
							</Tbody>
						</Table>
					</TableContainer>

					<Collapse in={!!activeRowId} animateOpacity>
						{activeRowId && (
							<Box
								mt={4}
								p={5}
								mx='auto'
								w='100%'
								maxW='container.lg'
								bg='gray.50'
								_dark={{ bg: "gray.700" }}
								rounded='md'
								boxShadow='md'
								border='1px solid'
								borderColor='gray.200'
							>
								<Text fontWeight='bold' mb={3}>
									📝 الإجراءات التي قمت بها في هذه الحالة
								</Text>

								<Textarea
									placeholder='اكتب الإجراءات هنا...'
									value={actionsMap[activeRowId] || ""}
									onChange={(e) =>
										setActionsMap((prev) => ({
											...prev,
											[activeRowId]: e.target.value,
										}))
									}
									textAlign='right'
									mb={4}
									resize={"none"}
								/>

								<Button
									colorScheme='blue'
									ml={3}
									onClick={() =>
										handleCompleteCase(
											cases.find((c) => c._id === activeRowId),
											actionsMap[activeRowId]
										)
									}
									isDisabled={!actionsMap[activeRowId]}
								>
									تأكيد الإغلاق
								</Button>
								<Button
									variant='ghost'
									onClick={() => setActiveRowId(null)}
									mr={2}
								>
									إلغاء
								</Button>
							</Box>
						)}
					</Collapse>

					<Modal isOpen={isReasonOpen} onClose={closeReasonModal} isCentered>
						<ModalOverlay />
						<ModalContent dir='rtl'>
							<ModalHeader>📋 سبب الزيارة</ModalHeader>
							<ModalBody>
								<Text textAlign='right' fontSize='md' color='gray.700'>
									{selectedReason || "لا يوجد سبب مسجل لهذه الحالة."}
								</Text>
							</ModalBody>
							<ModalFooter>
								<Button onClick={closeReasonModal}>إغلاق</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>

					<AlertDialog
						isOpen={isAlertOpen}
						leastDestructiveRef={cancelRef}
						onClose={closeAlert}
						isCentered
					>
						<AlertDialogOverlay>
							<AlertDialogContent dir='rtl'>
								<AlertDialogHeader fontSize='lg' fontWeight='bold'>
									تأكيد الإلغاء
								</AlertDialogHeader>

								<AlertDialogBody>
									هل أنت متأكد أنك تريد إلغاء هذه الحالة؟ هذا الإجراء لا يمكن
									التراجع عنه.
								</AlertDialogBody>

								<AlertDialogFooter>
									<Button ref={cancelRef} onClick={closeAlert} ml={2}>
										إلغاء
									</Button>
									<Button
										colorScheme='red'
										onClick={() => {
											handleUnassignCase(caseToUnassign);
											closeAlert();
										}}
										mr={3}
									>
										تأكيد الإلغاء
									</Button>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialogOverlay>
					</AlertDialog>
				</>
			)}
		</Box>
	);
}
