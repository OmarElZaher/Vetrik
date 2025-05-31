/* eslint-disable react-hooks/exhaustive-deps */
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
	Container,
	FormControl,
	FormLabel,
	Grid,
	GridItem,
	Icon,
	Input,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Table,
	TableContainer,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Text,
	Tooltip,
	useDisclosure,
	useToast,
	useColorModeValue,
	VStack,
	Heading,
	Divider,
} from "@chakra-ui/react";

// React Icon Imports
import { FaCheckCircle } from "react-icons/fa";
import { IoIosRemoveCircle, IoMdAdd, IoMdArrowRoundBack } from "react-icons/io";
import { MdAutorenew, MdDelete } from "react-icons/md";
import { RiHealthBookFill } from "react-icons/ri";
import { TbVaccine } from "react-icons/tb";

// Custom Component Imports
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

function formatDate(inputDate) {
	const date = new Date(inputDate);
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
}

function capitalizeEveryLetter(str) {
	return str
		.split("")
		.map((letter) => letter.toUpperCase())
		.join("");
}

export default function PetVaccination() {
	const { petId } = useParams();
	const navigate = useNavigate();
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const today = new Date();
	const formattedDate = today.toISOString().split("T")[0];

	// Color mode values
	const bgColor = useColorModeValue("gray.50", "gray.800");
	const cardBg = useColorModeValue("white", "gray.700");
	const textColor = useColorModeValue("gray.600", "gray.400");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const buttonBg = useColorModeValue("blue.500", "blue.300");
	const buttonHoverBg = useColorModeValue("blue.600", "blue.400");
	const dangerButtonBg = useColorModeValue("red.500", "red.300");
	const dangerButtonHoverBg = useColorModeValue("red.600", "red.400");
	const successButtonBg = useColorModeValue("green.500", "green.300");
	const successButtonHoverBg = useColorModeValue("green.600", "green.400");

	// Pet useStates
	const [pet, setPet] = useState(null);

	// Vaccination Card useStates
	const [vaccinationCardExists, setVaccinationCardExists] = useState(false);
	const [vaccinationCard, setVaccinationCard] = useState(null);

	const [vaccineName, setVaccineName] = useState("");
	const [vaccineBatch, setVaccineBatch] = useState("");
	const [vaccineGivenDate, setVaccineGivenDate] = useState(formattedDate);
	const [vaccineRenewalDate, setVaccineRenewalDate] = useState(null);

	const [vaccineRenewalId, setVaccineRenewalId] = useState(null);

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const handleCreateVaccinationCard = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/user/createVaccinationCard/${petId}`,
				{
					vaccineName: vaccineName,
					vaccineBatch: vaccineBatch,
					vaccineGivenDate: vaccineGivenDate,
					vaccineRenewalDate: vaccineRenewalDate,
				},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				setVaccinationCardExists(true);
				toast({
					title: response.data.message,
					status: "success",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
				setVaccineName("");
				setVaccineBatch("");
				setVaccineGivenDate(formattedDate);
				setVaccineRenewalDate(null);
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

	const handleAddVaccine = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/user/addVaccination/${petId}`,
				{
					vaccineName: vaccineName,
					vaccineBatch: vaccineBatch,
					vaccineGivenDate: vaccineGivenDate,
					vaccineRenewalDate: vaccineRenewalDate,
				},
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
				fetchData();
				setVaccineName("");
				setVaccineBatch("");
				setVaccineGivenDate(formattedDate);
				setVaccineRenewalDate(null);
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

	const handleDelete = async () => {
		const confirmDelete = window.confirm(
			"هل أنت متأكد أنك تريد حذف كارت التطعيمات هذا؟"
		);
		if (confirmDelete) {
			try {
				setIsLoading(true);
				const response = await axios.delete(
					`${api}/user/deleteVaccinationCard/${petId}`,
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
					setVaccinationCardExists(false);
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

	const handleRemoveVaccine = async (vaccineId) => {
		const confirmDelete = window.confirm(
			"هل أنت متأكد أنك تريد إزالة هذا اللقاح من كارت التطعيمات؟"
		);

		if (confirmDelete) {
			try {
				setIsLoading(true);
				const response = await axios.delete(
					`${api}/user/deleteVaccination/${petId}/${vaccineId}`,
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
					fetchData();
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

	const handleRenewVaccine = async (vaccineId) => {
		try {
			setIsLoading(true);
			const response = await axios.put(
				`${api}/user/renewVaccination/${petId}/${vaccineId}`,
				{
					vaccineRenewalDate: vaccineRenewalDate,
				},
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
				fetchData();
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

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(
				`${api}/user/getVaccinationCard/${petId}`,
				{
					withCredentials: true,
				}
			);
			if (response.status === 200) {
				setVaccinationCardExists(true);
				setVaccinationCard(response.data.vaccinationCard);
				setPet(response.data.pet);
			} else {
				setVaccinationCardExists(false);
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

	useEffect(() => {
		fetchData();
	}, [vaccinationCardExists]);

	if (isLoading) {
		return <Spinner />;
	}

	const renderVaccinationCard = () => (
		<Container maxW='container.xl' py={8}>
			<Grid templateColumns='repeat(12, 1fr)' gap={6}>
				{/* Vaccination Card Table */}
				<GridItem colSpan={8}>
					<Card
						bg={cardBg}
						p={6}
						borderRadius='xl'
						boxShadow='lg'
						height='full'
					>
						<VStack spacing={6} align='stretch'>
							<Heading
								size='lg'
								textAlign='center'
								color={textColor}
								borderBottom='2px'
								borderColor={borderColor}
								pb={4}
							>
								{titleCase(pet.name)} - كارت التطعيمات
							</Heading>

							<TableContainer>
								<Table variant='simple' size='md'>
									<Thead>
										<Tr>
											<Th>اسم اللقاح</Th>
											<Th textAlign='center'>الدفعة</Th>
											<Th textAlign='center'>تاريخ الإعطاء</Th>
											<Th textAlign='center'>تاريخ التجديد</Th>
											<Th textAlign='center'>الإجراءات</Th>
										</Tr>
									</Thead>
									<Tbody>
										{vaccinationCard.vaccine.map((row) => (
											<Tr key={row._id}>
												<Td>{titleCase(row.vaccineName)}</Td>
												<Td textAlign='center'>
													{capitalizeEveryLetter(row.vaccineBatch)}
												</Td>
												<Td textAlign='center'>
													{formatDate(row.vaccineGivenDate)}
												</Td>
												<Td textAlign='center'>
													{row.vaccineRenewalDate
														? formatDate(row.vaccineRenewalDate)
														: "-"}
												</Td>
												<Td textAlign='center'>
													<Button
														size='sm'
														colorScheme='blue'
														leftIcon={<MdAutorenew />}
														onClick={() => {
															setVaccineRenewalId(row._id);
															onOpen();
														}}
														ml={2}
														_hover={{
															bg: buttonHoverBg,
															transform: "translateY(-1px)",
														}}
													>
														تجديد
													</Button>
													<Button
														size='sm'
														colorScheme='red'
														variant='outline'
														leftIcon={<IoIosRemoveCircle />}
														onClick={() => handleRemoveVaccine(row._id)}
														_hover={{
															bg: dangerButtonHoverBg,
															transform: "translateY(-1px)",
														}}
													>
														إزالة
													</Button>
												</Td>
											</Tr>
										))}
									</Tbody>
								</Table>
							</TableContainer>

							<Box display='flex' justifyContent='space-between' pt={4}>
								<Button
									leftIcon={<IoMdArrowRoundBack />}
									onClick={() => navigate(`/pet-details/${petId}`)}
									colorScheme='blue'
									variant='outline'
								>
									تفاصيل الحيوان
								</Button>
								<Button
									colorScheme='red'
									variant='outline'
									leftIcon={<MdDelete />}
									onClick={handleDelete}
								>
									حذف الكارت
								</Button>
							</Box>
						</VStack>
					</Card>
				</GridItem>

				{/* Add Vaccine Form */}
				<GridItem colSpan={4}>
					<Card
						bg={cardBg}
						p={6}
						borderRadius='xl'
						boxShadow='lg'
						height='full'
					>
						<VStack spacing={6} align='stretch'>
							<Heading
								size='md'
								textAlign='center'
								color={textColor}
								borderBottom='2px'
								borderColor={borderColor}
								pb={4}
							>
								إضافة لقاح جديد
							</Heading>

							<FormControl>
								<FormLabel>اسم اللقاح</FormLabel>
								<Input
									value={vaccineName}
									onChange={(e) => setVaccineName(e.target.value)}
									placeholder='اسم اللقاح'
								/>
							</FormControl>

							<FormControl>
								<FormLabel>رقم الدفعة</FormLabel>
								<Input
									value={vaccineBatch}
									onChange={(e) => setVaccineBatch(e.target.value)}
									placeholder='رقم دفعة اللقاح'
								/>
							</FormControl>

							<FormControl>
								<FormLabel>تاريخ الإعطاء</FormLabel>
								<Input
									type='date'
									value={vaccineGivenDate}
									onChange={(e) => setVaccineGivenDate(e.target.value)}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>
									تاريخ التجديد
									<Tooltip
										label='اتركه فارغاً إذا كان اللقاح غير قابل للتجديد'
										placement='top'
									>
										<Text as='span' color='gray.500' ml={2}>
											(اختياري)
										</Text>
									</Tooltip>
								</FormLabel>
								<Input
									type='date'
									value={vaccineRenewalDate || ""}
									onChange={(e) => setVaccineRenewalDate(e.target.value)}
								/>
							</FormControl>

							<Button
								colorScheme='green'
								leftIcon={<IoMdAdd />}
								onClick={handleAddVaccine}
								mt={4}
								_hover={{
									bg: successButtonHoverBg,
									transform: "translateY(-1px)",
								}}
							>
								إضافة اللقاح
							</Button>
						</VStack>
					</Card>
				</GridItem>
			</Grid>
		</Container>
	);

	const renderCreateVaccinationCard = () => (
		<Container maxW='container.md' py={8}>
			<Card bg={cardBg} p={8} borderRadius='xl' boxShadow='lg'>
				<VStack spacing={8} align='stretch'>
					<Box textAlign='center'>
						<Icon
							as={RiHealthBookFill}
							w={16}
							h={16}
							color={textColor}
							mb={4}
						/>
						<Heading size='lg' color={textColor}>
							إنشاء كارت التطعيمات
						</Heading>
						<Text color={textColor} mt={2}>
							الحيوان ليس لديه كارت تطعيم. قم بإدخال بيانات اللقاح الأول لإنشاء
							كارت جديد.
						</Text>
					</Box>

					<Divider />

					<VStack spacing={6} align='stretch'>
						<FormControl>
							<FormLabel>اسم اللقاح</FormLabel>
							<Input
								value={vaccineName}
								onChange={(e) => setVaccineName(e.target.value)}
								placeholder='اسم اللقاح'
							/>
						</FormControl>

						<FormControl>
							<FormLabel>رقم الدفعة</FormLabel>
							<Input
								value={vaccineBatch}
								onChange={(e) => setVaccineBatch(e.target.value)}
								placeholder='رقم دفعة اللقاح'
							/>
						</FormControl>

						<Grid templateColumns='repeat(2, 1fr)' gap={4}>
							<FormControl>
								<FormLabel>تاريخ الإعطاء</FormLabel>
								<Input
									type='date'
									value={vaccineGivenDate}
									onChange={(e) => setVaccineGivenDate(e.target.value)}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>
									تاريخ التجديد{" "}
									<Tooltip
										label='اتركه فارغاً إذا كان اللقاح غير قابل للتجديد'
										placement='top'
									>
										<Text as='span' color='gray.500' ml={2}>
											{" "}
											(اختياري)
										</Text>
									</Tooltip>
								</FormLabel>
								<Input
									type='date'
									value={vaccineRenewalDate || ""}
									onChange={(e) => setVaccineRenewalDate(e.target.value)}
								/>
							</FormControl>
						</Grid>

						<Button
							colorScheme='green'
							leftIcon={<TbVaccine />}
							onClick={handleCreateVaccinationCard}
							size='lg'
							_hover={{
								bg: successButtonHoverBg,
								transform: "translateY(-1px)",
							}}
						>
							إنشاء كارت التطعيمات
						</Button>
					</VStack>
				</VStack>
			</Card>
		</Container>
	);

	return (
		<Box display='flex' flexDirection='column' bg={bgColor}>
			{vaccinationCardExists
				? renderVaccinationCard()
				: renderCreateVaccinationCard()}

			{/* Renewal Modal */}
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay backdropFilter='blur(2px)' />
				<ModalContent>
					<ModalHeader>تجديد اللقاح</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl>
							<FormLabel>
								تاريخ التجديد
								<Tooltip
									label='اتركه فارغاً إذا كان اللقاح غير قابل للتجديد'
									placement='top'
								>
									<Text as='span' color='gray.500' ml={2}>
										(اختياري)
									</Text>
								</Tooltip>
							</FormLabel>
							<Input
								type='date'
								value={vaccineRenewalDate || ""}
								onChange={(e) => setVaccineRenewalDate(e.target.value)}
							/>
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme='red'
							variant='outline'
							mr={3}
							onClick={onClose}
							leftIcon={<MdDelete />}
						>
							إلغاء
						</Button>
						<Button
							colorScheme='green'
							onClick={() => {
								handleRenewVaccine(vaccineRenewalId);
								setVaccineRenewalDate(null);
								onClose();
							}}
							leftIcon={<FaCheckCircle />}
						>
							تجديد
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
}
