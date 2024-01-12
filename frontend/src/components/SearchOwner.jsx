import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	FormControl,
	Heading,
	Input,
	InputGroup,
	InputLeftAddon,
	Select,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Icon,
	TableCaption,
	TableContainer,
	List,
	ListItem,
	ListIcon,
	useToast,
} from "@chakra-ui/react";

import { MdSettings } from "react-icons/md";
import { FaPerson } from "react-icons/fa6";

import Spinner from "./Spinner";
import Footer from "./Footer";
import axios from "axios";

// TODO: Gender filter, navigate to different page when table is shown

export default function SearchOwner() {
	const toast = useToast();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [email, setEmail] = useState("");

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

			const response = await axios.post(
				"http://localhost:1234/user/getOwner",
				formData,
				{
					withCredentials: true,
				}
			);

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
						width={"100%"}
						height={"100vh"}
					>
						<Card width='50vw' height='65vh'>
							<Box px={5} pt={5} display={"flex"} justifyContent={"center"}>
								<Icon as={FaPerson} fontSize={"60px"} />
							</Box>
							<Box px={5} pt={5} display={"flex"} justifyContent={"center"}>
								<Heading size='lg'>Search For An Owner</Heading>
							</Box>
							<Box ml={10} mt={5}>
								<List>
									<ListItem>
										<ListIcon as={MdSettings} color='green.500' />
										Enter one or more details to find desired owner.
									</ListItem>
									<ListItem>
										<ListIcon as={MdSettings} color='green.500' />
										To get all owners, press search with no details entered.
									</ListItem>
								</List>
							</Box>
							<br />
							<hr style={{ fontWeight: "bolder" }} />

							<CardBody>
								{/* Search Form */}
								<FormControl
									id='fullName'
									display={"flex"}
									justifyContent={"space-evenly"}
								>
									<InputGroup>
										<Input
											type='text'
											name='firstName'
											placeholder='First Name'
											value={firstName}
											onChange={handleFirstNameChange}
											mr={2.5}
										/>
										<Input
											type='text'
											name='lastName'
											placeholder='Last Name'
											value={lastName}
											onChange={handleLastNameChange}
											ml={2.5}
										/>
									</InputGroup>
								</FormControl>

								<FormControl id='email'>
									<InputGroup>
										<Input
											type='email'
											name='email'
											placeholder='Email'
											value={email}
											onChange={handleEmailChange}
											mt={5}
										/>
									</InputGroup>
								</FormControl>

								<FormControl id='mobileNumber' mt={5}>
									<InputGroup>
										<InputLeftAddon>+20</InputLeftAddon>
										<Input
											type='tel'
											name='mobileNumber'
											placeholder='Mobile Number'
											value={mobileNumber}
											onChange={handleMobileNumberChange}
										/>
									</InputGroup>
								</FormControl>
							</CardBody>

							<CardFooter display={"flex"} justifyContent={"center"}>
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
									width={"50vw"}
								>
									Search
								</Button>
							</CardFooter>
						</Card>
					</Box>
					<Footer />
				</>
			)}
		</>
	);
}
