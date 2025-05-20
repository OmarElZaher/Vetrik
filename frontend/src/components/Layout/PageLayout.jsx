import { useState } from "react";

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
	Spacer,
	HStack,
} from "@chakra-ui/react";

import axios from "axios";

import { API_URL as api } from "../../utils/constants";

import {
	FaBars,
	FaSun,
	FaMoon,
	FaHome,
	FaUser,
	FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PageLayout = ({ children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { colorMode, toggleColorMode } = useColorMode();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);

	const bg = useColorModeValue("white", "gray.800");

	return (
		<Box minH='100vh' dir='rtl' bg={useColorModeValue("gray.50", "gray.900")}>
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
					Vetrik
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
						onClick={async () => {
							setIsLoading(true);
							await axios
								.post(`${api}/user/logout`, {}, { withCredentials: true })
								.then(() => {
									localStorage.clear();
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
					<DrawerCloseButton />
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
								leftIcon={<FaUser />}
								justifyContent='flex-start'
								onClick={() => {
									navigate("/search-owner");
									onClose();
								}}
							>
								البحث عن مالك
							</Button>
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>

			{/* Main content */}
			<Box p={{ base: 4, md: 8 }}>{children}</Box>
		</Box>
	);
};

export default PageLayout;
