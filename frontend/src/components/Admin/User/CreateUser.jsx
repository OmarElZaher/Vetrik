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
	Select,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import { FaUserAlt } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";

// Custom Components Imports
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
	const [role, setRole] = React.useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = React.useState(false);

	const handleAdd = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/user/createUser`,
				{
					username: username,
					password: password,
					confirmPassword: confirmPassword,
					email: email,
					firstName: firstName,
					lastName: lastName,
					role: role,
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
						dir='rtl'
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
								width={"90%"}
							>
								<Box
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									height={"5%"}
									mb={10}
								>
									<Icon as={FaUserAlt} fontSize={"60px"} />
								</Box>
								<Box
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									height={"10%"}
									mt={5}
								>
									<Text fontSize={"3xl"} fontWeight={"bold"}>
										إضافة مستخدم
									</Text>
								</Box>
							</Box>

							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								height={"50%"}
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
										placeholder='الاسم الأول'
										value={firstName}
										onChange={(e) => {
											setFirstName(e.target.value);
										}}
										ml={2.5}
									/>

									<Input
										id='lastName'
										type='text'
										name='lastName'
										placeholder='اسم العائلة'
										value={lastName}
										onChange={(e) => {
											setLastName(e.target.value);
										}}
										mr={2.5}
									/>
								</FormControl>

								<FormControl id='email' mb={5}>
									<Input
										id='email'
										type='email'
										name='email'
										placeholder='البريد الإلكتروني'
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
										placeholder='اسم المستخدم'
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
									mb={5}
								>
									<Input
										id='password'
										type='password'
										name='password'
										placeholder='كلمة السر'
										value={password}
										onChange={(e) => {
											setPassword(e.target.value);
										}}
										ml={2.5}
									/>
									<Input
										id='confirmPassword'
										type='password'
										name='confirmPassword'
										placeholder='تأكيد كلمة السر'
										value={confirmPassword}
										onChange={(e) => {
											setConfirmPassword(e.target.value);
										}}
										mr={2.5}
									/>
								</FormControl>

								<FormControl
									id='role'
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
								>
									<Select
										id='role'
										name='role'
										placeholder='اختر الدور'
										iconColor='transparent'
										cursor={"pointer"}
										value={role}
										onChange={(e) => {
											setRole(e.target.value);
										}}
										ml={2.5}
									>
										<option value='vet'>Vet</option>
										<option value='secretary'>Secretary</option>
										<option value='admin'>Admin</option>
									</Select>
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
									rightIcon={<IoIosAdd />}
									width={"25%"}
								>
									إضافة
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
