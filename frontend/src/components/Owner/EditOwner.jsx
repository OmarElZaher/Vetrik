/* eslint-disable react-hooks/exhaustive-deps */
// React Imports
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Axios Import
import axios from "axios";

// Variable Imports
import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import {
	Box,
	Button,
	Card,
	FormControl,
	Icon,
	Input,
	InputGroup,
	InputLeftAddon,
	Select,
	Text,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import { FaRegEdit } from "react-icons/fa";
import { IoSaveSharp } from "react-icons/io5";

// Custom Component Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

function titleCase(str) {
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

export default function EditOwner() {
	const { ownerId } = useParams();
	const navigate = useNavigate();
	const toast = useToast();

	// Form useStates
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [contactMethod, setContactMethod] = useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const handleEdit = async () => {
		try {
			setIsLoading(true);
			const response = await axios.patch(
				`${api}/user/updateOwner/${ownerId}`,
				{
					firstName,
					lastName,
					email,
					mobileNumber,
					preferredContactMethod: contactMethod,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
				// { withCredentials: true }
			);

			if (response.status === 200) {
				toast({
					title: response.data.message,
					status: "success",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
				navigate(`/owner-details/${ownerId}`);
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

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(
				`${api}/user/getOwnerInfo/${ownerId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
				// 	{
				// 	withCredentials: true,
				// }
			);
			setFirstName(response.data.firstName);
			setLastName(response.data.lastName);
			setEmail(response.data.email);
			setMobileNumber(response.data.mobileNumber);
			setContactMethod(response.data.preferredContactMethod);
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

	useEffect(() => {
		fetchData();
	}, []);

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
						height={"87vh"}
						bg={"#F3F3F3"}
					>
						<Card
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
							alignItems={"center"}
							width={"90%"}
							height={"90%"}
						>
							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"33%"}
							>
								<Box
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									height={"15%"}
									width={"100%"}
								>
									<Icon as={FaRegEdit} fontSize={"60px"} />
								</Box>
								<Box
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									height={"15%"}
									width={"100%"}
									mt={5}
								>
									<Text fontSize={"3xl"} fontWeight={"bold"}>
										Edit Owner Profile
									</Text>
								</Box>
							</Box>

							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"33%"}
							>
								<FormControl
									id='name'
									display={"flex"}
									justifyContent={"space-evenly"}
									alignItems={"center"}
									mb={3}
								>
									<InputGroup>
										<Box
											display={"flex"}
											flexDirection={"column"}
											justifyContent={"center"}
											alignItems={"flex-start"}
											width={"100%"}
										>
											<Text fontSize={"16px"} color={"#7F7F7F"} ml={1.5} mb={1}>
												First Name
											</Text>
											<Input
												id='firstName'
												type='text'
												name='firstName'
												value={titleCase(firstName)}
												onChange={(e) => {
													setFirstName(e.target.value);
												}}
												mr={2.5}
											/>
										</Box>
										<Box
											display={"flex"}
											flexDirection={"column"}
											justifyContent={"center"}
											alignItems={"flex-start"}
											width={"100%"}
										>
											<Text fontSize={"16px"} color={"#7F7F7F"} ml={4} mb={1}>
												Last Name
											</Text>
											<Input
												id='lastName'
												type='text'
												name='lastName'
												value={titleCase(lastName)}
												onChange={(e) => {
													setLastName(e.target.value);
												}}
												ml={2.5}
											/>
										</Box>
									</InputGroup>
								</FormControl>

								<FormControl
									id='email'
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									mb={3}
								>
									<Box
										display={"flex"}
										flexDirection={"column"}
										justifyContent={"center"}
										alignItems={"flex-start"}
										width={"100%"}
									>
										<Text fontSize={"16px"} color={"#7F7F7F"} ml={1.5} mb={1}>
											Email
										</Text>
										<InputGroup>
											<InputLeftAddon
												display={"flex"}
												justifyContent={"center"}
												alignItems={"center"}
												width={"5%"}
											>
												@
											</InputLeftAddon>
											<Input
												id='email'
												type='text'
												name='email'
												value={email}
												onChange={(e) => {
													setEmail(e.target.value);
												}}
												mr={2.5}
											/>
										</InputGroup>
									</Box>
								</FormControl>

								<FormControl
									id='mobileNumber'
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									mb={3}
								>
									<Box
										display={"flex"}
										flexDirection={"column"}
										justifyContent={"center"}
										alignItems={"flex-start"}
										width={"100%"}
									>
										<Text fontSize={"16px"} color={"#7F7F7F"} ml={1.5} mb={1}>
											Mobile Number
										</Text>
										<InputGroup>
											<InputLeftAddon
												display={"flex"}
												justifyContent={"center"}
												alignItems={"center"}
												width={"5%"}
											>
												+2
											</InputLeftAddon>
											<Input
												id='mobileNumber'
												type='text'
												name='mobileNumber'
												value={mobileNumber}
												onChange={(e) => {
													setMobileNumber(e.target.value);
												}}
												mr={2.5}
											/>
										</InputGroup>
									</Box>
								</FormControl>

								<FormControl
									id='recieveNotifications'
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
								>
									<Box
										display={"flex"}
										flexDirection={"column"}
										justifyContent={"center"}
										alignItems={"flex-start"}
										width={"100%"}
									>
										<Text fontSize={"16px"} color={"#7F7F7F"} ml={1.5} mb={1}>
											Receive Notifications?
										</Text>
										<InputGroup>
											<Select
												id='receiveNotifications'
												name='receiveNotifications'
												cursor={"pointer"}
												value={contactMethod}
												onChange={(e) => {
													setContactMethod(e.target.value);
												}}
											>
												<option value='email'>Email</option>
												<option value='phone'>Phone</option>
												<option value='Both'>Both</option>
												<option value='neither'>Neither</option>
											</Select>
										</InputGroup>
									</Box>
								</FormControl>
							</Box>
							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"33%"}
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
									onClick={handleEdit}
									leftIcon={<Icon as={IoSaveSharp} />}
									width={"25%"}
								>
									{" "}
									Save
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
