// React Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// Variable Imports
import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Flex,
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

// React Icon Imports
import { FaEye, FaEyeSlash } from "react-icons/fa";
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

	// Show useStates
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
								<Heading fontSize={"4xl"}>إعادة تعيين كلمة المرور</Heading>
								<Text fontSize={"lg"} color={"gray.600"} align={"center"}>
									أدخل كلمة المرور الجديدة وقم بتأكيدها لإعادة التعيين.
								</Text>
							</Stack>

							<Box rounded={"lg"} bg='#F6F9FB' boxShadow={"lg"} p={8}>
								<Stack spacing={4}>
									<FormControl id='password'>
										<FormLabel>كلمة المرور الجديدة</FormLabel>
										<InputGroup>
											{showNewPassword ? (
												<InputRightElement
													children={
														<IconButton
															_hover={{}}
															_active={{}}
															onClick={() => {
																setShowNewPassword(!showNewPassword);
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
																setShowNewPassword(!showNewPassword);
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
												type={showNewPassword ? "text" : "password"}
												name='password'
												value={newPassword}
												onChange={(e) => {
													setNewPassword(e.target.value);
												}}
											/>
										</InputGroup>
									</FormControl>

									<FormControl id='confirmPassword'>
										<FormLabel>تأكيد كلمة المرور</FormLabel>
										<InputGroup>
											{showConfirmPassword ? (
												<InputRightElement
													children={
														<IconButton
															_hover={{}}
															_active={{}}
															onClick={() => {
																setShowConfirmPassword(!showConfirmPassword);
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
																setShowConfirmPassword(!showConfirmPassword);
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
												id='confirmPassword'
												type={showConfirmPassword ? "text" : "password"}
												name='confirmPassword'
												value={confirmPassword}
												onChange={(e) => {
													setConfirmPassword(e.target.value);
												}}
											/>
										</InputGroup>
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
											تأكيد
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
