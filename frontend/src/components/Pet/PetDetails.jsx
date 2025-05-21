// React Imports
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../utils/constants";

// Chakra-UI Imports
import {
	Box,
	Button,
	FormControl,
	Icon,
	Input,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	Center,
	SimpleGrid,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Text,
	Flex,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	useToast,
	useDisclosure,
	useColorModeValue,
} from "@chakra-ui/react";

// React Icons Imports
import {
	IoMdPaw,
	IoMdPricetags,
	IoMdMale,
	IoMdCalendar,
	IoMdTime,
	IoMdDocument,
} from "react-icons/io";

import { TbTrashXFilled } from "react-icons/tb";
import { FaWeightScale } from "react-icons/fa6";

// Custom Component Imports
import Spinner from "../General/Spinner";

function titleCase(str) {
	if (!str || typeof str !== "string") return "";
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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

	// Pet useStates
	const [pet, setPet] = useState({});
	const [petAge, setPetAge] = useState("");
	const [petCases, setPetCases] = useState([]);

	const [petVaccinations, setPetVaccinations] = useState([]);
	const [petHealthRecords, setPetHealthRecords] = useState([]);

	const [editPetName, setEditPetName] = useState("");
	const [editPetBreed, setEditPetBreed] = useState("");
	const [editPetWeight, setEditPetWeight] = useState("");

	const [newVaccine, setNewVaccine] = useState({
		vaccineName: "",
		vaccineBatch: "",
		vaccineGivenDate: "",
		// vaccineRenewalDate: "",
	});

	// Owner useStates
	const [owner, setOwner] = useState(null);
	const [ownerMobileNumber, setownerMobileNumber] = useState(null);

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);
	const [deletingPetId, setDeletingPetId] = useState(null);
	const [deletingOwnerId, setDeletingOwnerId] = useState(null);

	const [actionsTaken, setActionsTaken] = useState("");

	const [renewModalOpen, setRenewModalOpen] = useState(false);
	const [selectedVaccineId, setSelectedVaccineId] = useState(null);
	const [vaccineRenewalDate, setVaccineRenewalDate] = useState("");

	const openCases = petCases.filter(
		(c) => c.status === "waiting" || c.status === "in-progress"
	);

	const completedCases = petCases.filter((c) => c.status === "closed");

	const {
		isOpen: isDeletePetOpen,
		onOpen: openDeletePet,
		onClose: closeDeletePet,
	} = useDisclosure();

	const {
		isOpen: isDeleteOwnerOpen,
		onOpen: openDeleteOwner,
		onClose: closeDeleteOwner,
	} = useDisclosure();

	const {
		isOpen: isEditOpen,
		onOpen: openEditModal,
		onClose: closeEditModal,
	} = useDisclosure();

	const cancelRef = React.useRef();

	const cardBg = useColorModeValue("white", "gray.700");
	const iconColor = useColorModeValue("blue.500", "blue.300");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const boxColor = useColorModeValue("gray.50", "gray.800");

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${api}/user/getPetInfo/${petId}`, {
					withCredentials: true,
				});
				if (response.status === 200) {
					console.log(response.data);

					setPetAge(response.data.petAge);
					setPet(response.data.pet);
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
		fetchData();
	}, [petId, toast]);

	useEffect(() => {
		const handleGetCases = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${api}/case/getPetCases/${petId}`, {
					withCredentials: true,
				});

				if (response.status === 200) {
					setPetCases(response.data.cases);
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

		handleGetCases();
	}, [petId, toast]);

	useEffect(() => {
		const handleGetPetVaccinations = async () => {
			try {
				setIsLoading(true);

				const response = await axios.get(
					`${api}/user/getVaccinationCard/${petId}`,
					{ withCredentials: true }
				);

				if (response.status === 200) {
					console.log(response.data.vaccinationCard.vaccine);

					setPetVaccinations(response.data.vaccinationCard.vaccine);
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

		const handleGetPetHealthRecords = async () => {
			try {
				setIsLoading(true);

				const response = await axios.get(
					`${api}/user/getAllHealthRecords/${petId}`,
					{ withCredentials: true }
				);

				if (response.status === 200) {
					console.log(response.data.healthRecords);

					setPetHealthRecords(response.data.healthRecords);
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

		handleGetPetVaccinations();
		handleGetPetHealthRecords();
	}, [petId, toast]);

	const handleRemovePetFromOwner = async (ownerId, petId) => {
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
	};

	const handleDeletePet = async (petId) => {
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
					console.log(response.data);

					setOwner(response.data[0]);
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

	const handleEditPet = async (petId) => {
		try {
			setIsLoading(true);

			// Construct payload with only changed fields
			const updatedFields = {};

			if (editPetName && editPetName !== pet.name) {
				updatedFields.name = editPetName;
			}
			if (editPetBreed && editPetBreed !== pet.breed) {
				updatedFields.breed = editPetBreed;
			}
			if (
				editPetWeight &&
				editPetWeight !== pet.weight &&
				parseFloat(editPetWeight) !== parseFloat(pet.weight)
			) {
				updatedFields.weight = editPetWeight;
			}

			// No changes? Skip request
			if (Object.keys(updatedFields).length === 0) {
				toast({
					title: "لم يتم تعديل أي بيانات.",
					status: "info",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
				return;
			}

			const response = await axios.patch(
				`${api}/user/updatePet/${petId}`,
				updatedFields,
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
					...updatedFields,
				}));
				closeEditModal();
			}
		} catch (error) {
			if (error.response?.status === 500) {
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

	const handleDownload = async (record) => {
		try {
			setIsLoading(true);
			const response = await axios.get(
				`${api}/user/downloadHealthRecord/${record.pet}/${record._id}`,
				{
					responseType: "arraybuffer",
					withCredentials: true,
				}
			);

			const contentDisposition = response.headers["content-disposition"];
			const filenameMatch =
				contentDisposition && contentDisposition.match(/filename="(.+)"/);
			const filename = filenameMatch ? filenameMatch[1] : "HealthRecord.pdf";

			const blob = new Blob([response.data]);

			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			a.click();
			window.URL.revokeObjectURL(url);
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
		if (!newVaccine.name || !newVaccine.date) {
			toast({
				title: "الرجاء إدخال اسم التطعيم والتاريخ",
				status: "warning",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
			return;
		}

		try {
			setIsLoading(true);

			const response = await axios.post(
				`${api}/user/addVaccination/${pet._id}`,
				{
					vaccineName: newVaccine.vaccineName,
					vaccineBatch: newVaccine.vaccineBatch,
					notvaccineGivenDatees: newVaccine.vaccineGivenDate,
				},
				{ withCredentials: true }
			);

			if (response.status === 200) {
				toast({
					title: "تمت إضافة التطعيم بنجاح",
					status: "success",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
				setPet((prev) => ({
					...prev,
					vaccinations: [...(prev.vaccinations || []), response.data.vaccine],
				}));
				setNewVaccine({ name: "", date: "", notes: "" });
			}
		} catch (error) {
			toast({
				title: "حدث خطأ أثناء الإضافة",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleRenewVaccine = async (vaccineId) => {
		try {
			setIsLoading(true);
			const response = await axios.put(
				`${api}/user/renewVaccination/${petId}/${vaccineId}`,
				{
					vaccineRenewalDate,
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
				setVaccineRenewalDate("");
				setSelectedVaccineId(null);
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
				title: error?.response?.data?.message || "حدث خطأ",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return isLoading ? (
		<Spinner />
	) : (
		<Box dir='rtl' p={6}>
			{/* Page Title */}
			<Text fontSize='2xl' fontWeight='bold' textAlign='center' mb={2}>
				🐾 الملف الطبي
			</Text>
			<Text fontSize='xl' fontWeight='bold' textAlign='center' mb={4}>
				{titleCase(pet.name)}
			</Text>

			<Flex
				direction={{ base: "column", md: "row" }}
				gap={6}
				justify='center'
				mb={10}
			>
				{/* Pet Info Card */}
				<Box bg={boxColor} p={6} rounded='xl' boxShadow='md' flex='1'>
					<Center mb={4}>
						<Text fontSize='xl' fontWeight='semibold'>
							✏️ معلومات الحيوان
						</Text>
					</Center>

					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
						{[
							{ icon: IoMdPaw, label: "النوع", value: titleCase(pet.type) },
							{
								icon: IoMdPricetags,
								label: "السلالة",
								value: titleCase(pet.breed),
							},
							{
								icon: IoMdMale,
								label: "الجنس",
								value: pet.gender === "male" ? "ذكر" : "أنثى",
							},
							{ icon: IoMdTime, label: "العمر", value: `${petAge} سنة` },
							{
								icon: FaWeightScale,
								label: "الوزن",
								value: `${pet.weight || "غير محدد"} كجم`,
							},
							{
								icon: IoMdCalendar,
								label: "تاريخ الميلاد",
								value: formatDate(pet.dob),
							},
						].map((item, i) => (
							<Flex
								key={i}
								bg={cardBg}
								p={3}
								rounded='md'
								align='center'
								boxShadow='sm'
								border='1px solid'
								borderColor={borderColor}
								gap={3}
							>
								<Icon as={item.icon} boxSize={5} color={iconColor} />
								<Text>
									<strong>{item.label}:</strong> {item.value}
								</Text>
							</Flex>
						))}
					</SimpleGrid>

					<Box h={6} />

					<Center gap={3} mt={4}>
						<Button
							colorScheme='blue'
							size='sm'
							onClick={() => openEditModal()}
							leftIcon={<Icon as={IoMdPaw} />}
						>
							تعديل الحيوان
						</Button>
						<Button
							colorScheme='red'
							size='sm'
							onClick={() => {
								setDeletingPetId(pet._id);
								openDeletePet();
							}}
							leftIcon={<Icon as={TbTrashXFilled} />}
						>
							حذف الحيوان
						</Button>
					</Center>
				</Box>

				{/* Owners Card */}
				<Box bg={boxColor} p={6} rounded='xl' boxShadow='md' flex='1'>
					<Center mb={4}>
						<Text fontSize='xl' fontWeight='semibold'>
							👥 قائمة المالكين
						</Text>
					</Center>

					{pet.owners?.length > 0 ? (
						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
							{pet.owners.map((owner) => (
								<Flex
									key={owner._id}
									bg={cardBg}
									p={4}
									rounded='md'
									boxShadow='sm'
									border='1px solid'
									borderColor={borderColor}
									direction='column'
									align='center'
									textAlign='center'
									gap={1}
								>
									<Icon
										as={IoMdDocument}
										boxSize={6}
										color={iconColor}
										mb={2}
									/>
									<Text>
										<strong>الاسم:</strong> {owner.fullName}
									</Text>
									<Text>
										<strong>الهاتف:</strong> {owner.mobileNumber}
									</Text>
									<Text>
										<strong>الإيميل:</strong> {owner.email}
									</Text>

									<Button
										size='sm'
										colorScheme='red'
										mt={2}
										onClick={() => {
											setDeletingOwnerId(owner._id);
											openDeleteOwner();
										}}
										leftIcon={<Icon as={TbTrashXFilled} />}
									>
										إزالة هذا المالك
									</Button>
								</Flex>
							))}
						</SimpleGrid>
					) : (
						<Text color='gray.500' textAlign='center'>
							لا يوجد مالكين مرتبطين.
						</Text>
					)}

					<Box h={6} />

					<Text fontWeight='medium' mb={2} textAlign='center'>
						🔍 أضف مالكاً باستخدام رقم الهاتف
					</Text>
					<Flex
						gap={2}
						direction={{ base: "column", sm: "row" }}
						align='center'
					>
						<Input
							placeholder='أدخل رقم الهاتف'
							value={ownerMobileNumber || ""}
							onChange={(e) => setownerMobileNumber(e.target.value)}
							variant='filled'
							bg={cardBg}
							_focus={{ bg: cardBg }}
						/>
						<Button
							colorScheme='blue'
							onClick={handleSearchOwner}
							isDisabled={!ownerMobileNumber || isLoading}
							isLoading={isLoading}
							loadingText='جاري البحث...'
						>
							بحث
						</Button>
					</Flex>

					{owner && (
						<Box
							mt={4}
							p={3}
							border='1px solid'
							borderColor={borderColor}
							borderRadius='md'
							bg={cardBg}
							textAlign='center'
						>
							<Text>الاسم: {owner.fullName}</Text>
							<Text>رقم الهاتف: {owner.mobileNumber}</Text>
							<Text>الإيميل: {owner.email}</Text>
							<Button
								size='sm'
								colorScheme='green'
								mt={2}
								onClick={() => handleAddOwnerToPet(owner._id, pet._id)}
								isLoading={isLoading}
								isDisabled={isLoading}
								loadingText='جاري الربط...'
							>
								ربط المالك بالحيوان
							</Button>
						</Box>
					)}
				</Box>
			</Flex>

			{/* Vaccination Card */}
			<Box mb={12}>
				<Text fontSize='xl' fontWeight='semibold' mb={4} textAlign='center'>
					💉 بطاقة التطعيم
				</Text>

				<Box bg={boxColor} rounded='xl' boxShadow='md' p={4}>
					{petVaccinations?.length > 0 ? (
						<>
							<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
								{petVaccinations.map((vaccine, i) => (
									<Box
										key={i}
										p={4}
										display='flex'
										justifyContent='space-between'
										alignItems='flex-start'
										border='1px solid'
										borderColor={borderColor}
										borderRadius='md'
										bg={cardBg}
										boxShadow='sm'
									>
										<Box flex='1' pr={4}>
											<Text fontWeight='bold' mb={1}>
												🧪 {vaccine.vaccineName}
											</Text>
											<Text>
												<strong>📦 رقم الدفعة:</strong>{" "}
												{vaccine.vaccineBatch || "—"}
											</Text>
											<Text>
												<strong>📅 تاريخ الإعطاء:</strong>{" "}
												{formatDate(vaccine.vaccineGivenDate)}
											</Text>
											<Text>
												<strong>♻️ تاريخ التجديد:</strong>{" "}
												{formatDate(vaccine.vaccineRenewalDate) || "—"}
											</Text>
										</Box>

										<Flex direction='column' align='center' gap={2}>
											<Button
												colorScheme='blue'
												variant='outline'
												size='sm'
												onClick={() => {
													setSelectedVaccineId(vaccine._id);
													setRenewModalOpen(true);
												}}
											>
												🔁 تجديد
											</Button>

											<Button
												colorScheme='red'
												variant='ghost'
												size='sm'
												isLoading={isLoading}
												isDisabled={isLoading}
												// onClick={() => handleDeleteVaccine(vaccine._id)}
											>
												🗑 حذف
											</Button>
										</Flex>
									</Box>
								))}
							</SimpleGrid>

							<Box h={6} />

							{/* Add New Vaccine */}
							<Box mt={6}>
								<Text fontWeight='medium' mb={2} textAlign='center'>
									➕ إضافة تطعيم جديد
								</Text>
								<SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
									<Input
										placeholder='اسم التطعيم'
										value={newVaccine.vaccineName}
										onChange={(e) =>
											setNewVaccine((prev) => ({
												...prev,
												vaccineName: e.target.value,
											}))
										}
									/>
									<Input
										placeholder='رقم الدفعة'
										value={newVaccine.vaccineBatch}
										onChange={(e) =>
											setNewVaccine((prev) => ({
												...prev,
												vaccineBatch: e.target.value,
											}))
										}
									/>
									<Input
										type='date'
										value={newVaccine.vaccineGivenDate}
										onChange={(e) =>
											setNewVaccine((prev) => ({
												...prev,
												vaccineGivenDate: e.target.value,
											}))
										}
									/>
								</SimpleGrid>
								<Center mt={3}>
									<Button
										colorScheme='green'
										onClick={handleAddVaccine}
										isLoading={isLoading}
										isDisabled={isLoading}
										loadingText='جاري الإضافة...'
									>
										✅ إضافة التطعيم
									</Button>
								</Center>
							</Box>
						</>
					) : (
						<Text textAlign='center' color='gray.500'>
							لا توجد بيانات تطعيم مسجلة.
						</Text>
					)}
				</Box>
			</Box>

			{/* Medical Records Summary */}
			<Box mb={12}>
				<Text fontSize='xl' fontWeight='semibold' mb={4} textAlign='center'>
					📁 الملفات الطبية المرفقة
				</Text>

				<Box bg={boxColor} rounded='xl' boxShadow='md' p={4}>
					{petHealthRecords?.length > 0 ? (
						<SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
							{petHealthRecords.map((record) => (
								<Box
									key={record._id}
									p={3}
									border='1px solid'
									borderColor={borderColor}
									borderRadius='md'
									bg={cardBg}
									boxShadow='sm'
								>
									<Text mb={1}>
										<strong>📄 اسم الملف:</strong> {record.filename}
									</Text>
									<Text>
										<strong>📅 تاريخ الرفع:</strong>{" "}
										{formatDate(record.createdAt)}
									</Text>
									<Box h={3} />
									<Button
										isLoading={isLoading}
										isDisabled={isLoading}
										loadingText='جاري التحميل...'
										leftIcon={<IoMdDocument />}
										onClick={() => {
											handleDownload(record);
										}}
									>
										تحميل الملف
									</Button>
								</Box>
							))}
						</SimpleGrid>
					) : (
						<Text color='gray.500' textAlign='center'>
							لا توجد ملفات طبية مرفقة.
						</Text>
					)}

					<Center mt={6}>
						<Button
							colorScheme='blue'
							onClick={() => navigate(`/pet-records/${petId}`)}
						>
							📂 إدارة الملفات الطبية
						</Button>
					</Center>
				</Box>
			</Box>

			{/* Medical History */}
			<Box mb={12}>
				<Text fontSize='xl' fontWeight='semibold' mb={4} textAlign='center'>
					🗂 السجل الطبي للحالات
				</Text>

				{/* Ongoing Cases */}
				<Box bg={boxColor} rounded='xl' boxShadow='md' p={4} mb={6}>
					<Text fontWeight='bold' mb={3}>
						📌 الحالات الجارية
					</Text>
					{openCases.length > 0 ? (
						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
							{openCases.map((caseItem) => (
								<Box
									key={caseItem._id}
									p={4}
									border='1px solid'
									borderColor={borderColor}
									borderRadius='md'
									bg={cardBg}
									boxShadow='sm'
								>
									<Text fontWeight='bold' mb={1}>
										📅 {formatDate(caseItem.updatedAt)}
									</Text>
									<Text>
										<strong>🔍 السبب:</strong> {caseItem.reasonForVisit}
									</Text>
									<Text>
										<strong>🧪 الإجراءات:</strong>{" "}
										{caseItem.actionsTaken || "—"}
									</Text>
								</Box>
							))}
						</SimpleGrid>
					) : (
						<Text color='gray.500'>لا توجد حالات جارية حالياً.</Text>
					)}
				</Box>

				{/* Completed Cases */}
				<Box bg={boxColor} rounded='xl' boxShadow='md' p={4}>
					<Text fontWeight='bold' mb={3}>
						✅ الحالات المكتملة
					</Text>
					{completedCases.length > 0 ? (
						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
							{completedCases.map((caseItem) => (
								<Box
									key={caseItem._id}
									p={4}
									border='1px solid'
									borderColor={borderColor}
									borderRadius='md'
									bg={cardBg}
									boxShadow='sm'
								>
									<Text fontWeight='bold' mb={1}>
										📅 {formatDate(caseItem.updatedAt)}
									</Text>
									<Text>
										<strong>🔍 السبب:</strong> {caseItem.reasonForVisit}
									</Text>
									<Text>
										<strong>🧪 الإجراءات:</strong>{" "}
										{caseItem.actionsTaken || "—"}
									</Text>
								</Box>
							))}
						</SimpleGrid>
					) : (
						<Text color='gray.500'>لا توجد حالات مكتملة.</Text>
					)}
				</Box>
			</Box>

			{/* Delete Pet Confirmation */}
			<AlertDialog
				isOpen={isDeletePetOpen}
				leastDestructiveRef={cancelRef}
				onClose={closeDeletePet}
				isCentered
			>
				<AlertDialogOverlay />
				<AlertDialogContent dir='rtl'>
					<AlertDialogHeader fontSize='lg' fontWeight='bold'>
						تأكيد الحذف
					</AlertDialogHeader>
					<AlertDialogBody>
						هل أنت متأكد أنك تريد حذف هذا الحيوان؟ هذا الإجراء لا يمكن التراجع
						عنه.
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={closeDeletePet} ml={2}>
							إلغاء
						</Button>
						<Button
							colorScheme='red'
							isDisabled={isLoading}
							isLoading={isLoading}
							loadingText='جاري الحذف...'
							onClick={() => {
								handleDeletePet(deletingPetId);
								closeDeletePet();
							}}
							mr={3}
						>
							تأكيد الحذف
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Delete Owner Confirmation */}
			<AlertDialog
				isOpen={isDeleteOwnerOpen}
				leastDestructiveRef={cancelRef}
				onClose={closeDeleteOwner}
				isCentered
			>
				<AlertDialogOverlay />
				<AlertDialogContent dir='rtl'>
					<AlertDialogHeader fontSize='lg' fontWeight='bold'>
						تأكيد إزالة المالك
					</AlertDialogHeader>
					<AlertDialogBody>
						هل أنت متأكد أنك تريد إزالة هذا المالك من الحيوان؟
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={closeDeleteOwner} ml={2}>
							إلغاء
						</Button>
						<Button
							colorScheme='red'
							isDisabled={isLoading}
							isLoading={isLoading}
							loadingText='جاري الإزالة...'
							onClick={() => {
								handleRemovePetFromOwner(deletingOwnerId, pet._id);
								closeDeleteOwner();
							}}
							mr={3}
						>
							تأكيد الإزالة
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Edit Pet Modal */}
			<Modal isOpen={isEditOpen} onClose={closeEditModal} isCentered>
				<ModalOverlay />
				<ModalContent dir='rtl'>
					<ModalHeader>✏️ تعديل بيانات الحيوان</ModalHeader>
					<ModalBody>
						<FormControl mb={3}>
							<Text mb={1}>الاسم</Text>
							<Input
								defaultValue={pet.name}
								onChange={(e) => {
									setEditPetName(e.target.value);
								}}
							/>
						</FormControl>

						<FormControl mb={3}>
							<Text mb={1}>السلالة</Text>
							<Input
								defaultValue={pet.breed}
								onChange={(e) => {
									setEditPetBreed(e.target.value);
								}}
							/>
						</FormControl>

						<FormControl mb={3}>
							<Text mb={1}>الوزن (كجم)</Text>
							<Input
								type='number'
								defaultValue={pet.weight}
								onChange={(e) => {
									setEditPetWeight(e.target.value);
								}}
							/>
						</FormControl>
						{/* Add more fields as needed */}
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme='blue'
							ml={3}
							isDisabled={isLoading}
							isLoading={isLoading}
							loadingText='جاري الحفظ...'
							onClick={() => {
								handleEditPet(pet._id);
							}}
						>
							حفظ التعديلات
						</Button>
						<Button variant='ghost' onClick={closeEditModal} mr={2}>
							إلغاء
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<Modal
				isOpen={renewModalOpen}
				onClose={() => setRenewModalOpen(false)}
				isCentered
			>
				<ModalOverlay />
				<ModalContent dir='rtl'>
					<ModalHeader>🔁 تجديد التطعيم</ModalHeader>
					<ModalBody>
						<FormControl isRequired>
							<Text mb={1}>تاريخ التجديد الجديد</Text>
							<Input
								type='date'
								value={vaccineRenewalDate}
								onChange={(e) => setVaccineRenewalDate(e.target.value)}
							/>
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme='blue'
							mr={3}
							onClick={() => {
								handleRenewVaccine(selectedVaccineId);
								setRenewModalOpen(false);
							}}
							isDisabled={!vaccineRenewalDate}
						>
							تأكيد التجديد
						</Button>
						<Button variant='ghost' onClick={() => setRenewModalOpen(false)}>
							إلغاء
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
}
