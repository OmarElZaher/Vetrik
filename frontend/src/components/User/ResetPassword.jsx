// React Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// Variable Imports
import { api } from "../../variables";

// Chakra UI Imports
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Flex,
	Heading,
	Icon,
	Input,
	Stack,
	Text,
	useToast,
} from "@chakra-ui/react";

// React Icon Imports
import { MdLockReset } from "react-icons/md";

// Custom Component Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

export default function ResetPassword() {
	const navigate = useNavigate();
	const toast = useToast();

	// Form useStates
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = async () => {
		try {
			setIsLoading(true);
			console.log(newPassword, " ", confirmPassword);
			const response = await axios.post(`${api}/user/resetPassword`, {
				email: localStorage.getItem("email"),
				newPassword: newPassword,
				confirmPassword: confirmPassword,
			});

			if (response.status === 200) {
				toast({
					title: response.data.message,
					status: "success",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
				localStorage.removeItem("email");
				navigate("/login");
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
			) : (
				<>
					<Flex minH={"93vh"} align={"center"} justify={"center"} bg='#F6F9FB'>
						<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
							<Stack align={"center"}>
								<Icon as={MdLockReset} fontSize='100px' />
								<Heading fontSize={"4xl"}>Forgot Password</Heading>
								<Text fontSize={"lg"} color={"gray.600"} align={"center"}>
									Enter password and confirm password to reset your password.
								</Text>
							</Stack>

							<Box rounded={"lg"} bg='#F6F9FB' boxShadow={"lg"} p={8}>
								<Stack spacing={4}>
									<FormControl id='password'>
										<FormLabel>Password</FormLabel>
										<Input
											id='password'
											type='password'
											name='password'
											value={newPassword}
											onChange={(e) => {
												setNewPassword(e.target.value);
											}}
										/>
									</FormControl>

									<FormControl id='confirmPassword'>
										<FormLabel>Confirm Password</FormLabel>
										<Input
											id='confirmPassword'
											type='password'
											name='confirmPassword'
											value={confirmPassword}
											onChange={(e) => {
												setConfirmPassword(e.target.value);
											}}
										/>
									</FormControl>

									<Stack spacing={10}>
										<Button
											bg={"blue.400"}
											color={"white"}
											_hover={{
												bg: "blue.500",
											}}
											onClick={handleChange}
										>
											Submit
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
