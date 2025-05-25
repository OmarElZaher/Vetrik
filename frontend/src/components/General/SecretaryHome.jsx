import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
	Box,
	Text,
	Textarea,
	Button,
	FormControl,
	Input,
	Select,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	Flex,
	Image,
	SimpleGrid,
	ModalBody,
	ModalFooter,
	useDisclosure,
	useToast,
	useColorModeValue,
} from "@chakra-ui/react";

import { MdOutlinePets } from "react-icons/md";
import {
	FaFolderOpen,
	FaUserPlus,
	FaCheckCircle,
	FaSearch,
} from "react-icons/fa";
import { HiOutlineBeaker } from "react-icons/hi";

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

export default function SecretaryHome() {
	const toast = useToast();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);

	const cardBg = useColorModeValue("white", "gray.700");
	const flexBg = useColorModeValue("gray.50", "gray.900");
	const iconColor = useColorModeValue("#2F80ED", "#56CCF2");

	const [role, setRole] = useState("");

	const [ownerMobileNumber, setOwnerMobileNumber] = useState(null);
	const [gotOwnerPets, setGotOwnerPets] = useState(false);
	const [ownerPets, setOwnerPets] = useState([]);

	const [reasonForVisit, setReasonForVisit] = useState(null);
	const [petId, setPetId] = useState(null);

	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const fetchUserRole = async () => {
			try {
				setLoading(true);

				const response = await axios.get(`${api}/user/getUserInfo`, {
					withCredentials: true,
				});

				if (response.status === 200) {
					setRole(response.data.role);
				} else {
					toast({
						title: response.data.message,
						status: "error",
						duration: 2500,
						position: "top",
						isClosable: true,
					});
				}
			} catch (error) {
				toast({
					title: error.response.data.message,
					status: "error",
					duration: 2500,
					position: "top",
					isClosable: true,
				});
			} finally {
				setLoading(false);
			}
		};

		fetchUserRole();

		if (role === "vet") {
			navigate("/vet");
		}
	}, [navigate, role, toast]);

	const handleGetOwnerPets = async () => {
		try {
			setLoading(true);

			if (!ownerMobileNumber || ownerMobileNumber.trim() === "") {
				toast({
					title: "برجاء إدخال رقم هاتف المالك",
					status: "error",
					duration: 2500,
					position: "top",
					isClosable: true,
				});
				return;
			}
			if (ownerMobileNumber.length < 10) {
				toast({
					title: "برجاء إدخال رقم هاتف صالح",
					status: "error",
					duration: 2500,
					position: "top",
					isClosable: true,
				});
				return;
			}

			const response = await axios.post(
				`${api}/user/getOwner`,
				{
					mobileNumber: ownerMobileNumber,
				},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				setOwnerPets(response.data[0].pets);
				setGotOwnerPets(true);
			} else {
				toast({
					title: response.data.message,
					status: "error",
					duration: 2500,
					position: "top",
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: error.response.data.message,
				status: "error",
				duration: 2500,
				position: "top",
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSubmitCase = async () => {
		try {
			setLoading(true);
			const response = await axios.post(
				`${api}/case/createCase`,
				{
					petId: petId,
					reasonForVisit: reasonForVisit,
				},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				toast({
					title: "Case Created Successfully",
					status: "success",
					duration: 2500,
					position: "top",
					isClosable: true,
				});
				setOwnerMobileNumber(null);
				setGotOwnerPets(false);
				setOwnerPets([]);
				setReasonForVisit(null);
				onClose();
			} else {
				toast({
					title: response?.data?.message,
					status: "error",
					duration: 2500,
					position: "top",
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: error?.response?.data?.message,
				status: "error",
				duration: 2500,
				position: "top",
				isClosable: true,
			});
			setOwnerMobileNumber(null);
			setGotOwnerPets(false);
			setOwnerPets([]);
			setReasonForVisit(null);
			onClose();
		} finally {
			setLoading(false);
		}
	};

	return loading ? (
		<Spinner />
	) : (
		<>
			<Flex
				direction='column'
				minH='100vh'
				justify='space-between'
				bg={flexBg}
				dir='rtl'
			>
				<Box p={{ base: 4, md: 8 }} dir='rtl'>
					{/* Header */}
					<Flex justify='space-between' align='center' mb={6}>
						<Text fontSize='2xl' fontWeight='bold'>
							👋 مرحباً بك
						</Text>
					</Flex>

					<Text
						fontSize='xl'
						fontWeight='bold'
						mt={8}
						mb={4}
						textAlign={"center"}
						justifyContent={"center"}
					>
						👤 إدارة المالكين والحيوانات
					</Text>
					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
						<Box
							bg={cardBg}
							p={6}
							rounded='lg'
							boxShadow='md'
							display='flex'
							alignItems='center'
							justifyContent='space-between'
							cursor='pointer'
							_hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
							_active={{ boxShadow: "xl", transform: "scale(0.98)" }}
							transition='all 0.2s'
							onClick={() => navigate("/search-owner")}
						>
							<Box>
								<Text fontSize='lg' fontWeight='bold' mb={1}>
									👤 البحث عن مالك
								</Text>
								<Text color='gray.500' fontSize='sm'>
									الوصول إلى معلومات بسرعة
								</Text>
							</Box>
							<FaSearch size='32' color={iconColor} />
						</Box>

						{/* عدد الحيوانات */}
						<Box
							bg={cardBg}
							p={6}
							rounded='lg'
							boxShadow='md'
							display='flex'
							alignItems='center'
							justifyContent='space-between'
							cursor={"pointer"}
							onClick={() => navigate("/search-pet")}
							_hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
							_active={{ boxShadow: "xl", transform: "scale(0.98)" }}
							transition='all 0.2s'
						>
							<Box>
								<Text fontSize='lg' fontWeight='bold' mb={1}>
									🐾 بحث عن حيوان
								</Text>
								<Text color='gray.500' fontSize='sm'>
									عرض جميع الحيوانات المسجلة
								</Text>
							</Box>
							<FaSearch size='32' color={iconColor} />
						</Box>

						{/* إضافة مالك جديد */}
						<Box
							bg={cardBg}
							p={6}
							rounded='lg'
							boxShadow='md'
							display='flex'
							alignItems='center'
							justifyContent='space-between'
							cursor='pointer'
							_hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
							_active={{ boxShadow: "xl", transform: "scale(0.98)" }}
							transition='all 0.2s'
							onClick={() => navigate("/add-owner")}
						>
							<Box>
								<Text fontSize='lg' fontWeight='bold' mb={1}>
									➕ إضافة مالك جديد
								</Text>
								<Text color='gray.500' fontSize='sm'>
									تسجيل مالك جديد للنظام
								</Text>
							</Box>
							<FaUserPlus size='32' color={iconColor} />
						</Box>

						{/* إضافة مالك جديد */}
						<Box
							bg={cardBg}
							p={6}
							rounded='lg'
							boxShadow='md'
							display='flex'
							alignItems='center'
							justifyContent='space-between'
							cursor='pointer'
							_hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
							_active={{ boxShadow: "xl", transform: "scale(0.98)" }}
							transition='all 0.2s'
							onClick={() => navigate("/add-pet")}
						>
							<Box>
								<Text fontSize='lg' fontWeight='bold' mb={1}>
									➕ إضافة حيوان جديد
								</Text>
								<Text color='gray.500' fontSize='sm'>
									تسجيل حيوان جديد للنظام
								</Text>
							</Box>
							<MdOutlinePets size='32' color={iconColor} />
						</Box>
					</SimpleGrid>

					{/* Grid of Dashboard Cards */}
					<Text
						fontSize='xl'
						fontWeight='semibold'
						mt={10}
						mb={4}
						textAlign={"center"}
						justifyContent={"center"}
					>
						🗂 إدارة الحالات الطبية
					</Text>

					<SimpleGrid columns={{ base: 1, md: 1 }} spacing={6}>
						<Box
							bg={cardBg}
							p={6}
							rounded='lg'
							boxShadow='md'
							display='flex'
							alignItems='center'
							justifyContent='space-between'
							cursor='pointer'
							_hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
							_active={{ boxShadow: "xl", transform: "scale(0.98)" }}
							transition='all 0.2s'
							onClick={onOpen}
						>
							<Box>
								<Text fontSize='lg' fontWeight='bold' mb={1}>
									🧪 فتح حالة جديدة
								</Text>
								<Text color='gray.500' fontSize='sm'>
									إنشاء حالة لحيوان مسجل
								</Text>
							</Box>
							<HiOutlineBeaker size='32' color={iconColor} />
						</Box>
					</SimpleGrid>
					
					<Box h={6} />

					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
						<Box
							bg={cardBg}
							p={6}
							rounded='lg'
							boxShadow='md'
							display='flex'
							alignItems='center'
							justifyContent='space-between'
							cursor='pointer'
							_hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
							_active={{ boxShadow: "xl", transform: "scale(0.98)" }}
							transition='all 0.2s'
							onClick={() => navigate("/completed-cases")}
						>
							<Box>
								<Text fontSize='lg' fontWeight='bold' mb={1}>
									✅ الحالات المكتملة
								</Text>
								<Text color='gray.500' fontSize='sm'>
									عرض جميع الحالات المنتهية
								</Text>
							</Box>
							<FaCheckCircle size='32' color={iconColor} />
						</Box>

						{/* عدد الحالات المفتوحة */}
						<Box
							bg={cardBg}
							p={6}
							rounded='lg'
							boxShadow='md'
							display='flex'
							alignItems='center'
							justifyContent='space-between'
							cursor={"pointer"}
							onClick={() => navigate("/view-cases")}
							_hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
							_active={{ boxShadow: "xl", transform: "scale(0.98)" }}
							transition='all 0.2s'
						>
							<Box>
								<Text fontSize='lg' fontWeight='bold' mb={1}>
									📂 الحالات المفتوحة
								</Text>
								<Text color='gray.500' fontSize='sm'>
									متابعة الحالات الجارية
								</Text>
							</Box>
							<FaFolderOpen size='32' color={iconColor} />
						</Box>
					</SimpleGrid>

					<Flex
						direction='column'
						align='center'
						justify='center'
						mt={12}
						opacity={0.75}
					>
						<Image
							src='https://cdn-icons-png.flaticon.com/512/616/616408.png'
							alt='dog icon'
							boxSize='100px'
							mb={4}
						/>
						<Text fontSize='lg' color='gray.500' textAlign='center'>
							ابدأ باختيار إجراء من الأعلى ⬆️
						</Text>
					</Flex>

					<Modal isOpen={isOpen} onClose={onClose} isCentered>
						<ModalOverlay />
						<ModalContent dir='rtl'>
							<ModalHeader>🧪 فتح حالة جديدة</ModalHeader>
							{/* <ModalCloseButton /> */}
							<ModalBody>
								{/* Owner Phone Input */}
								<FormControl isRequired mb={4}>
									<Text mb={1}>رقم موبايل المالك</Text>
									<Input
										placeholder='مثال: 01012345678'
										value={ownerMobileNumber || ""}
										onChange={(e) => setOwnerMobileNumber(e.target.value)}
										textAlign='right'
									/>
								</FormControl>

								<Button
									colorScheme='blue'
									mb={4}
									width='100%'
									onClick={handleGetOwnerPets}
									isLoading={loading}
								>
									🔍 بحث عن الحيوانات
								</Button>

								{/* Pet Dropdown (only if pets were found) */}
								{gotOwnerPets && ownerPets.length > 0 && (
									<FormControl isRequired mb={4}>
										<Text mb={1}>اختر الحيوان</Text>
										<Select
											placeholder='اختر حيواناً'
											onChange={(e) => setPetId(e.target.value)}
											textAlign='right'
											iconColor='transparent'
											cursor={"pointer"}
										>
											{ownerPets.map((pet) => (
												<option key={pet._id} value={pet._id}>
													{titleCase(pet.name)} ({titleCase(pet.type)})
												</option>
											))}
										</Select>
									</FormControl>
								)}

								{/* Reason For Visit */}
								<FormControl isRequired>
									<Text mb={1}>سبب الزيارة</Text>
									<Textarea
										placeholder='مثال: تطعيم، إسهال، استشارة عامة...'
										value={reasonForVisit || ""}
										onChange={(e) => setReasonForVisit(e.target.value)}
										textAlign='right'
										resize={"none"}
										scrollBehavior={"smooth"}
										height={"250px"}
										overflow={"auto"}
									/>
								</FormControl>
							</ModalBody>

							<ModalFooter>
								<Button
									colorScheme='blue'
									ml={3}
									onClick={handleSubmitCase}
									isLoading={loading}
									isDisabled={!petId || !reasonForVisit}
									_hover={{ transform: "scale(1.02)" }}
									_active={{
										bg: "blue.500",
										color: "white",
										opacity: 0.8,
										transform: "scale(0.98)",
									}}
								>
									إنشاء الحالة
								</Button>
								<Button
									variant='subtle'
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
									إلغاء
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				</Box>
				<Box
					as='footer'
					py={4}
					textAlign='center'
					fontSize='xs'
					color='gray.500'
				>
					.Vetrik. All rights reserved 2025 ©
				</Box>
			</Flex>
		</>
	);
}
