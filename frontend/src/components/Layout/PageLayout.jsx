import { useState, useEffect } from "react";

import {
	Box,
	Flex,
	IconButton,
	Text,
	useColorMode,
	useColorModeValue,
	useDisclosure,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerCloseButton,
	VStack,
	Button,
	HStack,
	useToast,
} from "@chakra-ui/react";

import axios from "axios";

import { API_URL as api, VET_NAME as vet } from "../../utils/constants";

import {
	FaBars,
	FaSun,
	FaMoon,
	FaHome,
	FaUser,
	FaSignOutAlt,
	FaSearch,
	FaUsersCog,
	FaUserPlus,
	FaPaw,
	FaCheckCircle,
	FaFolderOpen,
	FaClipboardCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Spinner from "../General/Spinner";

const PageLayout = ({ children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { colorMode, toggleColorMode } = useColorMode();
	const boxColor = useColorModeValue("gray.50", "gray.900");
	const userRole = localStorage.getItem("userRole");
	const navigate = useNavigate();
	const toast = useToast();

	const [isLoading, setIsLoading] = useState(false);

	const bg = useColorModeValue("white", "gray.800");

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${api}/user/getUserInfo`, {
					withCredentials: true,
				});

				if (response.status !== 200) {
					toast({
						title: response?.data?.message,
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
			} catch (error) {
				if (error.response.status === 500) {
					toast({
						title: error?.response?.data?.message,
						description: "حدث خطأ ما",
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				} else {
					navigate("/login");
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [navigate, toast]);

	return isLoading ? (
		<Spinner />
	) : (
		<Box
			minH='100vh'
			display='flex'
			flexDirection='column'
			dir='rtl'
			bg={boxColor}
		>
			{/* Header */}
			<Flex
				as='header'
				align='center'
				justify='space-between'
				p={4}
				bg={bg}
				boxShadow='sm'
				position='sticky'
				top={0}
				zIndex={10}
			>
				<IconButton
					icon={<FaBars />}
					onClick={onOpen}
					aria-label='فتح القائمة'
				/>

				<Text
					fontWeight='bold'
					fontSize='xl'
					onClick={() => navigate("/")}
					cursor={"pointer"}
				>
					{vet}
				</Text>

				<HStack spacing={3}>
					<IconButton
						icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
						onClick={toggleColorMode}
						aria-label='تبديل الثيم'
						size='sm'
					/>
					<IconButton
						icon={<FaSignOutAlt />}
						colorScheme='red'
						isLoading={isLoading}
						isDisabled={isLoading}
						loadingText='جاري تسجيل الخروج...'
						onClick={async () => {
							setIsLoading(true);
							await axios
								.post(`${api}/user/logout`, {}, { withCredentials: true })
								.then(() => {
									localStorage.clear();
									sessionStorage.clear();
									navigate("/login");
								})
								.catch((err) => {
									console.error(err);
								})
								.finally(() => {
									setIsLoading(false);
								});
						}}
						aria-label='تسجيل الخروج'
						size='sm'
					/>
				</HStack>
			</Flex>

			{/* Drawer */}
			<Drawer isOpen={isOpen} placement='right' onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent dir='rtl'>
					<DrawerHeader>القائمة</DrawerHeader>
					<DrawerBody>
						<VStack spacing={4} align='stretch'>
							<Button
								leftIcon={<FaHome />}
								justifyContent='flex-start'
								onClick={() => {
									navigate("/secretary");
									onClose();
								}}
							>
								الصفحة الرئيسية
							</Button>
							<Button
								leftIcon={<FaSearch />}
								justifyContent='flex-start'
								onClick={() => {
									navigate("/search-owner");
									onClose();
								}}
							>
								البحث عن مالك
							</Button>
							<Button
								leftIcon={<FaSearch />}
								justifyContent='flex-start'
								onClick={() => {
									navigate("/search-pet");
									onClose();
								}}
							>
								البحث عن حيوان
							</Button>

							{userRole === "admin" ? (
								<>
									<Button
										leftIcon={<FaUsersCog />}
										justifyContent='flex-start'
										onClick={() => {
											navigate("/admin/search-users");
											onClose();
										}}
									>
										إدارة المستخدمين
									</Button>
									<Button
										leftIcon={<FaUserPlus />}
										justifyContent='flex-start'
										onClick={() => {
											navigate("/admin/create-user");
											onClose();
										}}
									>
										إنشاء مستخدم جديد
									</Button>
								</>
							) : userRole === "secretary" ? (
								<>
									<Button
										leftIcon={<FaUserPlus />}
										justifyContent='flex-start'
										onClick={() => {
											navigate("/add-owner");
											onClose();
										}}
									>
										إضافة مالك
									</Button>
									<Button
										leftIcon={<FaPaw />}
										justifyContent='flex-start'
										onClick={() => {
											navigate("/add-pet");
											onClose();
										}}
									>
										إضافة حيوان
									</Button>
									<Button
										leftIcon={<FaCheckCircle />}
										justifyContent='flex-start'
										onClick={() => {
											navigate("/completed-cases");
											onClose();
										}}
									>
										الحالات المكتملة
									</Button>
									<Button
										leftIcon={<FaFolderOpen />}
										justifyContent='flex-start'
										onClick={() => {
											navigate("/view-cases");
											onClose();
										}}
									>
										عرض الحالات
									</Button>
								</>
							) : userRole === "vet" ? (
								<>
									<Button
										leftIcon={<FaFolderOpen />}
										justifyContent='flex-start'
										onClick={() => {
											navigate("/view-cases");
											onClose();
										}}
									>
										عرض الحالات
									</Button>
									<Button
										leftIcon={<FaClipboardCheck />}
										justifyContent='flex-start'
										onClick={() => {
											navigate("/assigned-cases");
											onClose();
										}}
									>
										الحالات المسندة
									</Button>
								</>
							) : (
								<></>
							)}
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>

			{/* Main content */}
			<Box p={{ base: 4, md: 8 }} flexGrow={1}>
				{children}
			</Box>

			<Flex
				as='footer'
				direction='column'
				align='center'
				justify='center'
				bg={bg}
				py={4}
				mt={8}
				fontSize='sm'
				color='gray.500'
				boxShadow='inner'
			>
				<Text>جميع الحقوق محفوظة © {new Date().getFullYear()}</Text>
				<Text>منصة Vetrik لإدارة العيادات البيطرية</Text>
			</Flex>
		</Box>
	);
};

export default PageLayout;
