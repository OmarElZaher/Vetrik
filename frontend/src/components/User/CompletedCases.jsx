import React, { useEffect, useState } from "react";
import axios from "axios";

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
	useDisclosure,
	useToast,
} from "@chakra-ui/react";

import { IoMdCheckmark } from "react-icons/io";
import { FaEye } from "react-icons/fa";

import Spinner from "../General/Spinner";
import Footer from "../General/Footer";

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
		isOpen: isAlertOpen,
		onOpen: openAlert,
		onClose: closeAlert,
	} = useDisclosure();

	const cancelRef = React.useRef();

	const handleCloseModal = () => {
		setSelectedCase(null);
		closeModal();
	};
	const handleCloseAlert = () => {
		setSelectedCase(null);
		closeAlert();
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
				if (error.response.status === 500) {
					toast({
						title: "Error fetching completed cases",
						description: error.message,
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
			} finally {
				setLoading(false);
			}
		};

		fetchCompletedCases();
	}, [toast]);

	const handleCloseCase = async (caseId) => {
		try {
			const response = await axios.patch(
				`${api}/case/${caseId}/closeCase`,
				{},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				toast({
					title: "Case closed successfully",
					status: "success",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
				setCompletedCases((prevCases) =>
					prevCases.filter((completedCase) => completedCase._id !== caseId)
				);
			} else {
				toast({
					title: "Error closing case",
					description: response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			}
		} catch (error) {
			toast({
				title: "Error closing case",
				description: error.message,
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		}
	};

	return (
		<>
			{loading ? (
				<Spinner />
			) : (
				<>
					<Box
						dir='rtl'
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						flexDirection={"column"}
						w={"100%"}
						h={"87vh"}
					>
						<Box
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							width={"100%"}
							height={"20%"}
						>
							<Text fontSize={"2xl"} fontWeight={"bold"}>
								Completed Cases
							</Text>
						</Box>

						<Divider width={"90vw"} />

						<Box
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							width={"100%"}
							height={"80%"}
						>
							{completedCases.length === 0 ? (
								<>
									<Text
										fontSize={"2xl"}
										fontWeight={"bold"}
										textAlign={"center"}
										mb={4}
										ml={2}
										mr={2}
										py={2}
										px={4}
										borderRadius={"10px"}
									>
										لا توجد حالات مكتملة في الوقت الحالي
									</Text>
								</>
							) : (
								<TableContainer
									width={"90%"}
									height={"100%"}
									overflowX={"auto"}
									overflowY={"auto"}
									borderColor={"#D4FF32"}
									borderRadius={"10px"}
								>
									<Table variant='simple' size='lg'>
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
											{completedCases.map((row) => (
												<Tr key={row._id}>
													<Td textAlign={"right"}>{`${row.petId.name}`}</Td>
													<Td textAlign={"center"}>
														{`${titleCase(row.petId.breed)}`}
													</Td>

													<Td textAlign={"center"}>
														{`${titleCase(row.petId.type)}`}
													</Td>

													<Td textAlign={"center"}>
														{`${row.petId.weightClass}`}
													</Td>

													<Td textAlign={"center"}>
														<Button
															ml={5}
															variant='solid'
															_hover={{
																bg: "blue.600",
																color: "#fff",
															}}
															onClick={() => {
																setSelectedCase(row);
																openModal();
															}}
															rightIcon={<FaEye />}
														>
															عرض الإجراءات المتخذة
														</Button>

														<Button
															mr={5}
															variant='solid'
															_hover={{
																bg: "green.600",
																color: "#fff",
															}}
															onClick={() => {
																setSelectedCase(row);
																openAlert();
															}}
															rightIcon={<IoMdCheckmark />}
														>
															إغلاق الحالة
														</Button>
													</Td>
												</Tr>
											))}
										</Tbody>
									</Table>
								</TableContainer>
							)}
						</Box>
					</Box>
					<Modal
						isOpen={isModalOpen}
						onClose={handleCloseModal}
						motionPreset='slideInBottom'
						size={"xl"}
					>
						<ModalOverlay
							bg='blackAlpha.300'
							backdropFilter='blur(10px) hue-rotate(90deg)'
						/>
						<ModalContent dir='rtl'>
							<ModalHeader textAlign={"center"}>الإجرائت المتخذة</ModalHeader>
							<ModalCloseButton />
							<Divider />
							<ModalBody>
								<Text>{selectedCase?.actionsTaken}</Text>
							</ModalBody>
							<Divider />
							<ModalFooter>
								<Button
									onClick={closeModal}
									_hover={{
										bg: "red.600",
										color: "#fff",
									}}
								>
									إغلاق
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>

					<AlertDialog
						isOpen={isAlertOpen}
						leastDestructiveRef={cancelRef}
						onClose={closeAlert}
					>
						<AlertDialogOverlay>
							<AlertDialogContent dir='rtl'>
								<AlertDialogHeader fontSize='lg' fontWeight='bold'>
									إغلاق الحالة
								</AlertDialogHeader>

								<AlertDialogBody>
									<Text
										fontSize={"l"}
										fontWeight={"italic"}
										display={"flex"}
										justifyContent={"center"}
										alignItems={"center"}
									>
										هل أنت متأكد أنك تريد إغلاق هذه الحالة؟
									</Text>

									<Text
										fontWeight={"bold"}
										color={"red.500"}
										display={"flex"}
										justifyContent={"center"}
										alignItems={"center"}
									>
										لن تتمكن من إعادة فتحها مرة أخرى.
									</Text>
								</AlertDialogBody>

								<AlertDialogFooter>
									<Button
										ref={cancelRef}
										onClick={() => handleCloseAlert()}
										_hover={{
											bg: "red.600",
											color: "#fff",
										}}
										ml={3}
									>
										إلغاء
									</Button>
									<Button
										colorScheme='green'
										onClick={() => {
											handleCloseCase(selectedCase._id);
											handleCloseAlert();
										}}
										mr={3}
									>
										إغلاق الحالة
									</Button>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialogOverlay>
					</AlertDialog>
					<Footer />
				</>
			)}
		</>
	);
}
