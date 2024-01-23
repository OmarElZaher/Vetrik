// React Imports
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// Chakra UI Imports
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Icon,
	Input,
	Stack,
	Text,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
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

	// Misc useState
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		try {
			setIsLoading(true);

			if (formData.username === "" || formData.password === "") {
				toast({
					title: "Please Enter All Fields",
					status: "error",
					duration: 2500,
					position: "top",
					isClosable: true,
				});
				return;
			}

			const response = await axios.post(
				"http://localhost:1234/user/login",
				formData,
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				toast({
					title: response.data.message,
					status: "success",
					duration: 2000,
					position: "top",
					isClosable: true,
				});
				if (response.data.isAdmin) {
					navigate("/admin");
				} else {
					navigate("/");
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
								<Heading fontSize={"4xl"}>Welcome Back Doctor! 👋🏽</Heading>
								<Text fontSize={"lg"} color={"gray.600"} align={"center"}>
									Sign In Using Your Credentials to Access Your Dashboard
								</Text>
							</Stack>

							<Box rounded={"lg"} bg='#F6F9FB' boxShadow={"lg"} p={8}>
								<Stack spacing={4}>
									<FormControl id='username'>
										<FormLabel>
											Username{" "}
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
										<FormLabel>
											Password{" "}
											<Text display={"inline"} color='red'>
												*
											</Text>
										</FormLabel>
										<Input
											type='password'
											name='password'
											value={formData.password}
											onChange={handleInputChange}
										/>
									</FormControl>

									<Stack spacing={10}>
										<Stack
											direction={{ base: "column", sm: "row" }}
											align={"start"}
											justify={"space-between"}
										>
											<Link to={"/forgot-username"}>
												<Text
													color={"blue.400"}
													_hover={{ textDecoration: "underline" }}
												>
													Forgot username?
												</Text>
											</Link>
											<Link to={"/forgot-password"}>
												<Text
													color={"blue.400"}
													_hover={{ textDecoration: "underline" }}
												>
													Forgot password?
												</Text>
											</Link>
										</Stack>
										<Button
											bg={"blue.400"}
											color={"white"}
											_hover={{
												bg: "blue.500",
											}}
											onClick={handleSubmit}
										>
											Sign in
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
