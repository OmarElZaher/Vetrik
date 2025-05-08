// React Imports
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Text,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";

// Custom Component Imports
import Footer from "./Footer";
import Spinner from "./Spinner";

export default function LoginCard() {
	const navigate = useNavigate();
	const toast = useToast();

	// Form useState
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	// Show Password useState
	const [showPassword, setShowPassword] = useState(false);

	// Misc useState
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		try {
			setIsLoading(true);

			if (formData.username === "" || formData.password === "") {
				toast({
					title: "يرجى إدخال جميع الحقول",
					status: "error",
					duration: 2500,
					position: "top",
					isClosable: true,
				});
				return;
			}

			const response = await axios.post(`${api}/user/login`, formData, {
				withCredentials: true,
			});

			if (response.status === 200) {
				toast({
					title: response.data.message,
					status: "success",
					duration: 2000,
					position: "top",
					isClosable: true,
				});

				if (response.data.role === "admin") {
					navigate("/admin");
				} else if (response.data.role === "vet") {
					navigate("/vet");
				} else if (response.data.role === "secretary") {
					navigate("/secretary");
				}
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
			setIsLoading(false);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		handleLogin();
	};

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<Flex minH={"93vh"} align={"center"} justify={"center"} bg='#F6F9FB'>
						<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
							<Stack align={"center"}>
								<Icon as={FiLogIn} fontSize='100px' />
								<Heading dir='rtl' fontSize={"4xl"}>
									مرحباً بعودتك يا دكتور! 👋🏽
								</Heading>
								<Text
									dir='rtl'
									fontSize={"lg"}
									color={"gray.600"}
									align={"center"}
								>
									قم بتسجيل الدخول باستخدام بياناتك للوصول إلى لوحة التحكم
									الخاصة بك
								</Text>
							</Stack>

							<Box rounded={"lg"} bg='#F6F9FB' boxShadow={"lg"} p={8}>
								<Stack spacing={4}>
									<FormControl id='username'>
										<FormLabel dir='rtl'>
											اسم المستخدم{" "}
											<Text display={"inline"} color='red'>
												*
											</Text>
										</FormLabel>
										<Input
											type='text'
											name='username'
											value={formData.username}
											onChange={handleInputChange}
										/>
									</FormControl>

									<FormControl id='password'>
										<FormLabel dir='rtl'>
											كلمة السر{" "}
											<Text display={"inline"} color='red'>
												*
											</Text>
										</FormLabel>
										<InputGroup>
											{showPassword ? (
												<InputRightElement
													children={
														<IconButton
															_hover={{}}
															_active={{}}
															onClick={() => {
																setShowPassword(!showPassword);
															}}
															as={FaEye}
															cursor={"pointer"}
															bg={"#FFF"}
															size={"xs"}
														/>
													}
												/>
											) : (
												<InputRightElement
													children={
														<IconButton
															_hover={{}}
															_active={{}}
															onClick={() => {
																setShowPassword(!showPassword);
															}}
															as={FaEyeSlash}
															cursor={"pointer"}
															bg={"#FFF"}
															size={"xs"}
														/>
													}
												/>
											)}
											<Input
												id='password'
												type={showPassword ? "text" : "password"}
												name='password'
												value={formData.password}
												onChange={handleInputChange}
											/>
										</InputGroup>
									</FormControl>

									<Stack spacing={10}>
										<Stack
											direction={{ base: "column", sm: "row" }}
											align={"start"}
											justify={"space-between"}
										>
											<Link to={"/forgot-username"}>
												<Text
													dir='rtl'
													color={"blue.400"}
													_hover={{ textDecoration: "underline" }}
												>
													نسيت اسم المستخدم؟
												</Text>
											</Link>
											<Link to={"/forgot-password"}>
												<Text
													dir='rtl'
													color={"blue.400"}
													_hover={{ textDecoration: "underline" }}
												>
													نسيت كلمة السر؟
												</Text>
											</Link>
										</Stack>
										<Button
											dir='rtl'
											_hover={{
												bg: "blue.500",
											}}
											onClick={handleSubmit}
											bg={"blue.400"}
											color={"white"}
										>
											تسجيل الدخول
										</Button>
									</Stack>
								</Stack>
							</Box>
						</Stack>
					</Flex>
					<Footer />
				</>
			)}
		</>
	);
}
