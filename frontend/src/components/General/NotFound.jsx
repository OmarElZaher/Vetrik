// React Imports
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import {
	Box,
	Button,
	Icon,
	Text,
	useToast,
	VStack,
	Container,
	Heading,
	useColorModeValue,
} from "@chakra-ui/react";

// React Icons Imports
import { IoMdHome } from "react-icons/io";
import { FaExclamationTriangle } from "react-icons/fa";

// Custom Component Imports
import AdminHeader from "../Admin/General/AdminHeader";
import Footer from "./Footer";
import Header from "./Header";
import Spinner from "./Spinner";

export default function NotFound() {
	const navigate = useNavigate();
	const toast = useToast();

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [userRole, setUserRole] = useState(null);

	// Color mode values
	const bgColor = useColorModeValue("gray.50", "gray.800");
	const textColor = useColorModeValue("gray.600", "gray.400");
	const errorColor = useColorModeValue("red.500", "red.300");
	const buttonBg = useColorModeValue("blue.500", "blue.300");
	const buttonHoverBg = useColorModeValue("blue.600", "blue.400");

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${api}/user/getUserInfo`, {
					withCredentials: true,
				});

				if (response.status === 200) {
					const role = response.data.role;
					setUserRole(role);
					setIsAdmin(role === "admin");
				}
			} catch (error) {
				// Handle unauthorized access silently
				if (error.response?.status === 401) {
					setUserRole(null);
				} else {
					toast({
						title: "Error",
						description: "حدث خطأ ما",
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
	}, [toast]);

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<Box display='flex' flexDirection='column'>
			<Container maxW='container.xl' flex='1' py={10}>
				<VStack
					spacing={8}
					justify='center'
					align='center'
					minH='70vh'
					bg={bgColor}
					borderRadius='xl'
					p={8}
					boxShadow='lg'
				>
					<Icon as={FaExclamationTriangle} w={20} h={20} color={errorColor} />

					<Heading as='h1' size='2xl' color={errorColor} textAlign='center'>
						404
					</Heading>

					<Heading as='h2' size='xl' color={textColor} textAlign='center'>
						الصفحة غير موجودة
					</Heading>

					<Text fontSize='lg' color={textColor} textAlign='center' maxW='600px'>
						عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
					</Text>

					<Button
						size='lg'
						leftIcon={<Icon as={IoMdHome} />}
						colorScheme='blue'
						bg={buttonBg}
						_hover={{
							bg: buttonHoverBg,
							transform: "translateY(-2px)",
							boxShadow: "lg",
						}}
						_active={{
							transform: "translateY(0)",
						}}
						onClick={() => navigate("/")}
						px={8}
						py={6}
						borderRadius='full'
					>
						العودة للصفحة الرئيسية
					</Button>
				</VStack>
			</Container>
		</Box>
	);
}
