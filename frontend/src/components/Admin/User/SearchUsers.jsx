// React Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// ChakraUI Imports
import {
	Box,
	Button,
	Card,
	FormControl,
	Heading,
	Icon,
	Input,
	InputGroup,
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
				"http://localhost:1234/user/getUsers",
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
									Search For A User
								</Heading>
							</Box>

							<Box ml={10} my={7} height={"10%"}>
								<List>
									<ListItem>
										<ListIcon as={MdSettings} color='yellowgreen' />
										Enter one, or more details to find desired user.
									</ListItem>
									<ListItem>
										<ListIcon as={MdSettings} color='yellowgreen' />
										To get all users, press{" "}
										<Text display={"inline"} color={"yellowgreen"}>
											search
										</Text>{" "}
										without any inputs.
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

								<FormControl
									id='username'
									display={"flex"}
									justifyContent={"space-evenly"}
								>
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

								<FormControl id='email'>
									<Input
										id='email'
										type='email'
										name='email'
										placeholder='Email'
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
										leftIcon={<Icon as={IoMdSearch} />}
										width={"50%"}
										mt={10}
									>
										Search
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
