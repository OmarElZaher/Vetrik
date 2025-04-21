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
	Input,
	Stack,
	Text,
	useToast,
} from "@chakra-ui/react";

// React Icon Imports
import { GrPowerReset } from "react-icons/gr";

// Custom Component Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

export default function ForgotUsername() {
	const navigate = useNavigate();
	const toast = useToast();

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	// Form useStates
	const [email, setEmail] = useState("");

	const handleRequest = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(`${api}/user/forgotUsername`, {
				email: email,
			});

			if (response.status === 200) {
				toast({
					title: response.data.message,
					status: "success",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
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
								<Icon as={GrPowerReset} fontSize='100px' />
								<Heading fontSize={"4xl"}>نسيت اسم المستخدم</Heading>
								<Text fontSize={"lg"} color={"gray.600"} align={"center"}>
									أدخل بريدك الإلكتروني المُسجَّل وسنرسل لك اسم المستخدم الخاص
									بك.
								</Text>
							</Stack>

							<Box rounded={"lg"} bg='#F6F9FB' boxShadow={"lg"} p={8}>
								<Stack spacing={4}>
									<FormControl id='email'>
										<FormLabel>البريد الإلكتروني</FormLabel>
										<Input
											id='email'
											type='email'
											name='email'
											value={email}
											onChange={(e) => {
												setEmail(e.target.value);
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
											onClick={handleRequest}
										>
											إرسال
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
