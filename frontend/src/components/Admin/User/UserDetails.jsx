// React Imports
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../../utils/constants";

// ChakraUI Imports
import {
	Box,
	Button,
	Card,
	Tooltip,
	Text,
	useToast,
	Badge,
	useColorModeValue,
} from "@chakra-ui/react";

// React Icons Imports
import { TbTrashXFilled } from "react-icons/tb";

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

export default function UserDetails() {
	const { userId } = useParams();
	const navigate = useNavigate();
	const toast = useToast();

	// User useStates
	const [user, setUser] = useState(null);

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);
	const [gotData, setGotData] = useState(false);
	const [error, setError] = useState(null);

	// Color mode values
	const cardBg = useColorModeValue(
		"rgba(255,255,255,0.85)",
		"rgba(45,55,72,0.85)"
	);
	const pageBg = useColorModeValue("gray.50", "gray.900");
	const headingColor = useColorModeValue("#121211", "white");
	const sectionBg = useColorModeValue("gray.100", "gray.700");

	const handleDeleteUser = async () => {
		const confirmDelete = window.confirm(
			"هل أنت متأكد أنك تريد حذف هذا المستخدم؟"
		);
		if (confirmDelete) {
			try {
				setIsLoading(true);
				const response = await axios.delete(
					`${api}/user/deleteUser/${userId}`,
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
					navigate("/admin/search-users");
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

	const handleSetAdmin = async () => {
		const confirmSetAdmin = window.confirm(
			`هل أنت متأكد أنك تريد تعيين ${titleCase(user.firstName)} ${titleCase(
				user.lastName
			)} كمشرف؟`
		);
		if (confirmSetAdmin) {
			try {
				setIsLoading(true);
				const response = await axios.patch(
					`${api}/user/setAdmin/${userId}`,
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

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${api}/user/getUserInfo/${userId}`, {
					withCredentials: true,
				});

				if (response.status === 200) {
					setUser(response.data.user);
					setGotData(true);
				} else {
					setError(response.data.message);
					toast({
						title: response.data.message,
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
			} catch (error) {
				setError(error.response.data.message);
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
	}, [toast, userId]);

	return isLoading ? (
		<Spinner />
	) : error ? (
		<Box
			display={"flex"}
			flexDirection={"column"}
			justifyContent={"center"}
			alignItems={"center"}
			bg={pageBg}
			minH='100vh'
		>
			<Text dir='rtl' fontWeight={"bold"} fontSize={"60px"} color={"red"}>
				خطأ
			</Text>
			<Text fontSize={"40px"} textDecoration={"underline"} mb={8}>
				{error}
			</Text>
			<Button
				dir='rtl'
				colorScheme='blue'
				variant='solid'
				boxShadow='md'
				fontWeight='bold'
				fontSize='lg'
				px={8}
				py={6}
				borderRadius='lg'
				onClick={() => {
					navigate("/admin/search-users");
				}}
				mt={4}
			>
				الرجوع لصفحة البحث
			</Button>
		</Box>
	) : gotData ? (
		<Box bg={pageBg} p={6}>
			<Box
				dir='rtl'
				bg={cardBg}
				boxShadow='md'
				rounded='xl'
				p={10}
				maxW='60vw'
				mx='auto'
				mt={8}
			>
				<Text
					fontSize={{ base: "2xl", md: "2.5xl", lg: "3xl" }}
					color={headingColor}
					fontWeight={700}
					textDecoration={"underline"}
					mb={6}
					textAlign='center'
				>
					بيانات المستخدم
				</Text>
				<Text fontSize={"xl"} fontWeight='bold' textAlign='center' mb={4}>
					{`${titleCase(user.firstName)} ${titleCase(user.lastName)}`}
				</Text>
				<Box
					bg={sectionBg}
					p={6}
					rounded='lg'
					mb={6}
					display='flex'
					flexDirection={{ base: "column", md: "row" }}
					gap={6}
					alignItems='center'
					justifyContent='space-between'
				>
					<Box flex='1' textAlign='center'>
						<Text fontWeight='bold' mb={1}>
							اسم المستخدم
						</Text>
						<Text>{user.username}</Text>
					</Box>
					<Box flex='1' textAlign='center'>
						<Text fontWeight='bold' mb={1}>
							البريد الإلكتروني
						</Text>
						<Text>{user.email}</Text>
					</Box>
					<Box flex='1' textAlign='center'>
						<Text fontWeight='bold' mb={1}>
							تاريخ التسجيل
						</Text>
						<Text>
							{new Date(user.createdAt).toLocaleDateString("ar-EG", {
								year: "numeric",
								month: "2-digit",
								day: "2-digit",
							})}
						</Text>
						<Text fontWeight='bold' mt={3} mb={1}>
							الوقت
						</Text>
						<Text>
							{new Date(user.createdAt).toLocaleTimeString("ar-EG", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Text>
						<Text fontWeight='bold' mt={3} mb={1}>
							الدور
						</Text>
						<Text fontSize='lg'>
							{user.role === "admin" ? (
								<Badge colorScheme='green' fontSize='1em'>
									أدمن
								</Badge>
							) : user.role === "vet" ? (
								<Badge colorScheme='blue' fontSize='1em'>
									طبيب بيطرى
								</Badge>
							) : (
								<Badge colorScheme='purple' fontSize='1em'>
									سكرتير
								</Badge>
							)}
						</Text>
					</Box>
				</Box>
				<Box display='flex' justifyContent='center' gap={4}>
					<Tooltip
						hasArrow
						label='تعيين المستخدم كمشرف'
						openDelay={75}
						placement='top'
						bg='gray.400'
					>
						<Button
							colorScheme='blue'
							variant='solid'
							fontWeight='bold'
							borderRadius='md'
							onClick={handleSetAdmin}
						>
							تعيين كمشرف
						</Button>
					</Tooltip>
					<Tooltip
						hasArrow
						label='حذف المستخدم من النظام'
						openDelay={75}
						placement='top'
						bg={"#EF5350"}
					>
						<Button
							colorScheme='red'
							variant='outline'
							fontWeight='bold'
							borderRadius='md'
							onClick={handleDeleteUser}
							leftIcon={<TbTrashXFilled />}
						>
							حذف المستخدم
						</Button>
					</Tooltip>
				</Box>
			</Box>
		</Box>
	) : (
		<></>
	);
}
