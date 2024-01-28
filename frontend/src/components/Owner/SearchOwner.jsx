// React Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { api } from "../../variables";

// Chakra UI Imports
import {
	Box,
	Button,
	Card,
	FormControl,
	Heading,
	Input,
	InputGroup,
	InputLeftAddon,
	Icon,
	List,
	Text,
	ListItem,
	ListIcon,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import { IoMdSearch } from "react-icons/io";
import { FaPerson } from "react-icons/fa6";
import { MdSettings } from "react-icons/md";

// Custom Components Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

export default function SearchOwner() {
	const toast = useToast();
	const navigate = useNavigate();

	// Form useStates
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [email, setEmail] = useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const handleSearch = async () => {
		try {
			setIsLoading(true);
			let formData = {};

			if (firstName !== "") {
				formData.firstName = firstName;
			}
			if (lastName !== "") {
				formData.lastName = lastName;
			}
			if (mobileNumber !== "") {
				formData.mobileNumber = mobileNumber;
			}
			if (email !== "") {
				formData.email = email;
			}

			const response = await axios.post(`${api}/user/getOwner`, formData, {
				withCredentials: true,
			});

			if (response.status === 200) {
				localStorage.setItem("ownerFilterData", JSON.stringify(response.data));
				navigate("/owner-table");
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

	const handleFirstNameChange = (e) => {
		setFirstName(e.target.value);
	};

	const handleLastNameChange = (e) => {
		setLastName(e.target.value);
	};

	const handleMobileNumberChange = (e) => {
		setMobileNumber(e.target.value);
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		handleSearch();
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
									Search For An Owner
								</Heading>
							</Box>

							<Box height={"10%"} ml={10} my={7}>
								<List>
									<ListItem>
										<ListIcon as={MdSettings} color='yellowgreen' />
										Enter one, or more details to find desired owner.
									</ListItem>
									<ListItem>
										<ListIcon as={MdSettings} color='yellowgreen' />
										To get all owners, press{" "}
										<Text display={"inline"} color={"yellowgreen"}>
											search
										</Text>{" "}
										without any inputs.
									</ListItem>
								</List>
							</Box>

							<hr />

							<Box height={"50%"} p={10}>
								{/* Search Form */}
								<FormControl
									id='fullName'
									display={"flex"}
									justifyContent={"space-evenly"}
								>
									<Input
										id='firstName'
										type='text'
										name='firstName'
										placeholder='First Name'
										value={firstName}
										onChange={handleFirstNameChange}
										mr={2.5}
									/>
									<Input
										id='lastName'
										type='text'
										name='lastName'
										placeholder='Last Name'
										value={lastName}
										onChange={handleLastNameChange}
										ml={2.5}
									/>
								</FormControl>

								<FormControl id='email'>
									<Input
										id='email'
										type='email'
										name='email'
										placeholder='Email'
										value={email}
										onChange={handleEmailChange}
										mt={5}
									/>
								</FormControl>

								<FormControl id='mobileNumber' mt={5}>
									<InputGroup>
										<InputLeftAddon>+2</InputLeftAddon>
										<Input
											id='mobileNumber'
											type='tel'
											name='mobileNumber'
											placeholder='Mobile Number'
											value={mobileNumber}
											onChange={handleMobileNumberChange}
										/>
									</InputGroup>
								</FormControl>

								<FormControl
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
										onClick={handleSubmit}
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
