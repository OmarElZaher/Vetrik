// React Imports
import React from "react";
import { useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../../utils/constants";

// ChakraUI Imports
import {
	Box,
	Button,
	Card,
	FormControl,
	Icon,
	Input,
	Text,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import { MdAdminPanelSettings } from "react-icons/md";

// Custom Component Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

export default function CreateUser() {
	const navigate = useNavigate();
	const toast = useToast();

	// Form useStates
	const [firstName, setFirstName] = React.useState("");
	const [lastName, setLastName] = React.useState("");
	const [username, setUsername] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = React.useState(false);

	const handleAdd = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/user/createAdmin`,
				{
					username: username,
					password: password,
					confirmPassword: confirmPassword,
					email: email,
					firstName: firstName,
					lastName: lastName,
				},
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
				navigate(`/admin/user-details/${response.data._id}`);
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
					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						bg={"#F3F3F3"}
						height={"87vh"}
					>
						<Card
							display={"flex"}
							justify={"center"}
							alignItems={"center"}
							width={"80%"}
							height={"90%"}
						>
							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								height={"15%"}
								width={"90%"}
							>
								<Box
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									height={"5%"}
									mb={10}
								>
									<Icon as={MdAdminPanelSettings} fontSize={"60px"} />
								</Box>
								<Box
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									height={"10%"}
									mt={5}
								>
									<Text
										fontSize={"40px"}
										fontWeight={"bold"}
										textDecoration={"underline"}
									>
										Add An Admin
									</Text>
								</Box>
							</Box>

							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								height={"60%"}
								width={"90%"}
							>
								<FormControl
									id='name'
									display={"flex"}
									justifyContent={"space-evenly"}
									mb={5}
								>
									<Input
										id='firstName'
										type='text'
										name='firstName'
										placeholder='First Name'
										value={firstName}
										onChange={(e) => {
											setFirstName(e.target.value);
										}}
										mr={2.5}
									/>

									<Input
										id='lastName'
										type='text'
										name='lastName'
										placeholder='Last Name'
										value={lastName}
										onChange={(e) => {
											setLastName(e.target.value);
										}}
										ml={2.5}
									/>
								</FormControl>

								<FormControl id='email' mb={5}>
									<Input
										id='email'
										type='email'
										name='email'
										placeholder='Email'
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
										}}
									/>
								</FormControl>

								<FormControl id='username' mb={5}>
									<Input
										id='username'
										type='text'
										name='username'
										placeholder='Username'
										value={username}
										onChange={(e) => {
											setUsername(e.target.value);
										}}
									/>
								</FormControl>

								<FormControl
									id='password'
									display={"flex"}
									justifyContent={"space-evenly"}
								>
									<Input
										id='password'
										type='password'
										name='password'
										placeholder='Password'
										value={password}
										onChange={(e) => {
											setPassword(e.target.value);
										}}
										mr={2.5}
									/>
									<Input
										id='confirmPassword'
										type='password'
										name='confirmPassword'
										placeholder='Confirm Password'
										value={confirmPassword}
										onChange={(e) => {
											setConfirmPassword(e.target.value);
										}}
									/>
								</FormControl>
							</Box>

							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								height={"15%"}
								width={"90%"}
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
									onClick={handleAdd}
									width={"25%"}
								>
									Add
								</Button>
							</Box>
						</Card>
					</Box>
					<Footer />
				</>
			)}
		</>
	);
}
