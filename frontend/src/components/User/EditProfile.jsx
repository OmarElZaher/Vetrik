import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

import { IoMdHome } from "react-icons/io";
import { FaSave } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";

import Spinner from "../General/Spinner";
import Footer from "../General/Footer";
import axios from "axios";

export default function EditProfile() {
	const navigate = useNavigate();
	const toast = useToast();

	const [isLoading, setIsLoading] = useState(false);
	const [gotData, setGotData] = useState(false);
	const [error, setError] = useState("");

	const [user, setUser] = useState({});

	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
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
				setUser(response.data);
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

	useEffect(() => {
		fetchData();
	}, []);

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

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : error ? (
				<>
					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						flexDirection={"column"}
						height={"87vh"}
						bg={"#F3F3F3"}
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
								onClick={() => {
									navigate("/");
								}}
								_hover={{
									bg: "yellowgreen",
									color: "#000",
									transform: "scale(1.01)",
								}}
								_active={{
									transform: "scale(0.99)",
									opacity: "0.5",
								}}
								bg={"#FFF"}
								mt={10}
								width={"25vw"}
								leftIcon={<Icon as={IoMdHome} />}
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
						height={"87vh"}
						bg={"#F3F3F3"}
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
								justifyContent={"center"}
								alignItems={"center"}
								flexDirection={"column"}
								height={"15%"}
								width={"90%"}
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
								justifyContent={"center"}
								alignItems={"center"}
								flexDirection={"column"}
								height={"70%"}
								width={"90%"}
							>
								<FormControl
									display={"flex"}
									justifyContent={"center"}
									alignItems={"flex-start"}
									flexDirection={"column"}
									mb={5}
								>
									<Text ml={1.5} mb={1} fontSize={"16px"} color={"#7F7F7F"}>
										Username
									</Text>
									<Input
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
									<Text ml={1.5} mb={1} fontSize={"16px"} color={"#7F7F7F"}>
										Email
									</Text>
									<Input
										width={"100%"}
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
											<Badge colorScheme='green' ml={3} fontSize={"12px"}>
												True
											</Badge>
										</>
									) : (
										<>
											<Text fontWeight={"bold"}>Is Admin: </Text>
											<Badge
												variant='outline'
												colorScheme='red'
												ml={3}
												mt={0.5}
												fontSize={"12px"}
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
								height={"15%"}
								width={"90%"}
							>
								<Button
									onClick={handleSubmit}
									_hover={{
										bg: "yellowgreen",
										color: "#000",
										transform: "scale(1.01)",
									}}
									_active={{
										transform: "scale(0.99)",
										opacity: "0.5",
									}}
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
