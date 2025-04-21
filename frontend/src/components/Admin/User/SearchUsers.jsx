// React Imports
import React, { useState } from "react";
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
	Heading,
	Icon,
	Input,
	List,
	ListIcon,
	ListItem,
	Text,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import { FaPerson } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { MdSettings } from "react-icons/md";

// Custom Component Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

export default function SearchUsers() {
	const navigate = useNavigate();
	const toast = useToast();

	// Form useStates
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const handleSearch = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/user/getUsers`,
				{
					firstName: firstName,
					lastName: lastName,
					username: username,
					email: email,
				},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				localStorage.setItem(
					"usersFilterData",
					JSON.stringify(response.data.users)
				);
				navigate("/admin/users-table");
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
						justifyContent={"space-around"}
						alignItems={"center"}
						bg={"#F3F3F3"}
						width={"100%"}
						height={"87vh"}
					>
						<Card width='80%' height='80%'>
							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								height={"20%"}
								px={5}
								pt={5}
							>
								<Icon as={FaPerson} fontSize={"60px"} />

								<Heading size='lg' mt={2}>
									ابحث عن مستخدم
								</Heading>
							</Box>

							<Box mr={10} my={7} height={"10%"}>
								<List>
									<ListItem>
										<ListIcon as={MdSettings} color='yellowgreen' />
										اكتب اسم أو أكتر علشان تلاقي المستخدم اللي بتدور عليه.
									</ListItem>
									<ListItem>
										<ListIcon as={MdSettings} color='yellowgreen' />
										لو عايز تظهر كل المستخدمين، دوس{" "}
										<Text display={"inline"} color={"yellowgreen"}>
											بحث
										</Text>{" "}
										من غير ما تكتب أي حاجة.
									</ListItem>
								</List>
							</Box>

							<hr />

							<Box p={10} height={"50%"} width={"100%"}>
								{/* Search Form */}
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

								<FormControl
									id='username'
									display={"flex"}
									justifyContent={"space-evenly"}
								>
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

								<FormControl id='email'>
									<Input
										id='email'
										type='email'
										name='email'
										placeholder='البريد الإلكتروني'
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
										}}
										mt={5}
									/>
								</FormControl>

								<FormControl
									id='submit'
									display={"flex"}
									flexDirection={"column"}
									justifyContent={"center"}
									alignItems={"center"}
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
										onClick={handleSearch}
										rightIcon={<Icon as={IoMdSearch} />}
										width={"50%"}
										mt={10}
									>
										بحث
									</Button>
								</FormControl>
							</Box>
						</Card>
					</Box>
					<Footer />
				</>
			)}
		</>
	);
}
