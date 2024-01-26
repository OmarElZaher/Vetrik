/* eslint-disable react-hooks/exhaustive-deps */
// React Imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// Chakra UI Imports
import {
	Badge,
	Box,
	Button,
	Card,
	FormControl,
	Input,
	Icon,
	Text,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import { IoMdHome } from "react-icons/io";
import { FaRegEdit, FaSave } from "react-icons/fa";

// Custom Component Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

export default function EditProfile() {
	const navigate = useNavigate();
	const toast = useToast();

	// Form useStates
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);
	const [gotData, setGotData] = useState(false);
	const [error, setError] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);

	const fetchData = async () => {
		try {
			setIsLoading(true);

			const response = await axios.get(
				"http://localhost:1234/user/getUserInfo",
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				setEmail(response.data.email);
				setUsername(response.data.username);
				setIsAdmin(response.data.isAdmin);
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

	const handleSubmit = async () => {
		try {
			setIsLoading(true);
			const response = await axios.patch(
				"http://localhost:1234/user/updateProfile",
				{
					username: username,
					email: email,
				},
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
				navigate("/");
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

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : error ? (
				<>
					<Box
						display={"flex"}
						flexDirection={"column"}
						justifyContent={"center"}
						alignItems={"center"}
						bg={"#F3F3F3"}
						height={"87vh"}
					>
						<Card
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							height={"80%"}
							width={"80%"}
						>
							<Text fontWeight={"bold"} fontSize={"60px"} color={"red"}>
								ERROR
							</Text>
							<Text fontSize={"40px"} textDecoration={"underline"}>
								{error}
							</Text>
							<Button
								_hover={{
									bg: "yellowgreen",
									color: "#000",
									transform: "scale(1.01)",
								}}
								_active={{
									transform: "scale(0.99)",
									opacity: "0.5",
								}}
								onClick={() => {
									navigate("/");
								}}
								leftIcon={<Icon as={IoMdHome} />}
								bg={"#FFF"}
								width={"25vw"}
								mt={10}
							>
								Home
							</Button>
						</Card>
					</Box>
					<Footer />
				</>
			) : gotData ? (
				<>
					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						bg={"#F3F3F3"}
						height={"87vh"}
					>
						<Card
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							height={"80%"}
							width={"80%"}
						>
							{/* Header */}
							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"15%"}
								mt={5}
							>
								<Icon as={FaRegEdit} fontSize={"40px"} mr={5} />
								<Text
									fontWeight={"bold"}
									fontSize={"40px"}
									textDecoration={"underline"}
									mt={2}
								>
									Edit Profile
								</Text>
							</Box>

							{/* Body */}
							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"70%"}
							>
								<FormControl
									display={"flex"}
									flexDirection={"column"}
									justifyContent={"center"}
									alignItems={"flex-start"}
									mb={5}
								>
									<Text fontSize={"16px"} color={"#7F7F7F"} ml={1.5} mb={1}>
										Username
									</Text>
									<Input
										id='username'
										type='text'
										name='username'
										value={username}
										placeholder='Username'
										onChange={(e) => {
											setUsername(e.target.value);
										}}
									/>
								</FormControl>

								<FormControl
									display={"flex"}
									flexDirection={"column"}
									justifyContent={"center"}
									alignItems={"flex-start"}
									mb={5}
								>
									<Text fontSize={"16px"} color={"#7F7F7F"} ml={1.5} mb={1}>
										Email
									</Text>
									<Input
										id='email'
										type='email'
										name='email'
										value={email}
										placeholder='Email'
										onChange={(e) => {
											setEmail(e.target.value);
										}}
									/>
								</FormControl>

								<Box
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									mt={2.5}
								>
									{isAdmin ? (
										<>
											<Text fontWeight={"bold"} fontSize={"12px"}>
												Is Admin:{" "}
											</Text>
											<Badge colorScheme='green' fontSize={"12px"} ml={3}>
												True
											</Badge>
										</>
									) : (
										<>
											<Text fontWeight={"bold"}>Is Admin: </Text>
											<Badge
												variant='outline'
												colorScheme='red'
												fontSize={"12px"}
												ml={3}
												mt={0.5}
											>
												False
											</Badge>
										</>
									)}
								</Box>
							</Box>

							{/* Save Changes Button */}
							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"15%"}
							>
								<Button
									_hover={{
										bg: "yellowgreen",
										color: "#000",
										transform: "scale(1.01)",
									}}
									_active={{
										transform: "scale(0.99)",
										opacity: "0.5",
									}}
									onClick={handleSubmit}
									leftIcon={<Icon as={FaSave} />}
									width={"50%"}
								>
									Save Changes
								</Button>
							</Box>
						</Card>
					</Box>
					<Footer />
				</>
			) : (
				<Spinner />
			)}
		</>
	);
}
