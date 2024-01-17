import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
	Box,
	Button,
	Card,
	CardBody,
	FormControl,
	Icon,
	Input,
	InputGroup,
	InputLeftAddon,
	Select,
	Text,
	useToast,
} from "@chakra-ui/react";

import { FaPerson } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";

import Spinner from "../General/Spinner";
import Footer from "../General/Footer";

export default function AddOwner() {
	const navigate = useNavigate();
	const toast = useToast();

	// Owner Data
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [email, setEmail] = useState("");
	const [gender, setGender] = useState("");
	const [receiveNotifications, setReceiveNotifications] = useState(null);
	const [preferredContactMethod, setPreferredContactMethod] = useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const handleAdd = async () => {
		if (
			firstName === "" ||
			lastName === "" ||
			mobileNumber === "" ||
			email === "" ||
			gender === "" ||
			receiveNotifications === "" ||
			receiveNotifications === null
		) {
			toast({
				title: "Input All Fields",
				status: "error",
				duration: 2000,
				isClosable: true,
				position: "top",
			});
		} else if (
			receiveNotifications === "true" &&
			preferredContactMethod === ""
		) {
			toast({
				title: "Enter Preferred Contact Method",
				status: "error",
				duration: 2000,
				isClosable: true,
				position: "top",
			});
		} else {
			if (receiveNotifications === "false") {
				setPreferredContactMethod("Neither");
			}
			try {
				setIsLoading(true);

				const response = await axios.post(
					"http://localhost:1234/user/createOwner",
					{
						firstName: firstName,
						lastName: lastName,
						mobileNumber: mobileNumber,
						email: email,
						gender: gender,
						receiveNotifications: receiveNotifications,
						preferredContactMethod: preferredContactMethod,
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
					navigate("/search-owner");
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
		}
	};

	useEffect(() => {
		if (receiveNotifications === "false") {
			setPreferredContactMethod("Neither");
		} else {
			setPreferredContactMethod("");
		}
	}, [receiveNotifications]);

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
							width={"80%"}
							height={"80%"}
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
						>
							<CardBody
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								width={"80%"}
							>
								<Box
									height={"5%"}
									mt={5}
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
								>
									<Icon as={FaPerson} fontSize={"60px"} />
								</Box>
								<Box
									height={"15%"}
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									mt={5}
								>
									<Text fontSize={"3xl"} fontWeight={"bold"}>
										Add An Owner
									</Text>
								</Box>

								<Box
									height={"60%"}
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									flexDirection={"column"}
								>
									<FormControl
										id='name'
										display={"flex"}
										justifyContent={"space-evenly"}
									>
										<Input
											mr={2.5}
											type='text'
											name='firstName'
											placeholder='First Name'
											value={firstName}
											onChange={(e) => {
												setFirstName(e.target.value);
											}}
										/>
										<Input
											type='text'
											name='lastName'
											placeholder='Last Name'
											value={lastName}
											onChange={(e) => {
												setLastName(e.target.value);
											}}
											ml={2.5}
											mr={2.5}
										/>
										<Select
											name='gender'
											placeholder='Select Gender'
											value={gender}
											onChange={(e) => {
												setGender(e.target.value);
											}}
											cursor={"pointer"}
											ml={2.5}
										>
											<option value='Male'>Male</option>
											<option value='Female'>Female</option>
										</Select>
									</FormControl>

									<FormControl id='email'>
										<Input
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

									<FormControl id='mobileNumber' mt={5}>
										<InputGroup>
											<InputLeftAddon>+20</InputLeftAddon>
											<Input
												type='tel'
												name='mobileNumber'
												placeholder='Mobile Number'
												value={mobileNumber}
												onChange={(e) => {
													setMobileNumber(e.target.value);
												}}
											/>
										</InputGroup>
									</FormControl>

									<FormControl id='notifications' mt={5} display={"flex"}>
										<Select
											name='receiveNotifications'
											placeholder='Receive Notifications?'
											value={receiveNotifications}
											onChange={(e) => {
												setReceiveNotifications(e.target.value);
											}}
											cursor={"pointer"}
											mr={2.5}
										>
											<option value='true'>Yes</option>
											<option value='false'>No</option>
										</Select>

										<Select
											name='preferredContactMethod'
											placeholder='Select Preferred Contact Method'
											value={preferredContactMethod}
											onChange={(e) => {
												setPreferredContactMethod(e.target.value);
											}}
											cursor={"pointer"}
											ml={2.5}
											disabled={
												receiveNotifications === "false" ||
												receiveNotifications === null ||
												receiveNotifications === ""
											}
											{...(receiveNotifications === "false"
												? { disabled: true }
												: {})}
										>
											<option value='Email'>Email</option>
											<option value='Phone'>Phone</option>
											<option value='Both'>Both</option>
											<option value='Neither'>Neither</option>
										</Select>
									</FormControl>
								</Box>

								<Box
									height={"10%"}
									display={"flex"}
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
										onClick={handleAdd}
										width={"25%"}
										leftIcon={<IoMdAdd />}
									>
										{" "}
										Add{" "}
									</Button>
								</Box>
							</CardBody>
						</Card>
					</Box>
					<Footer />
				</>
			)}
		</>
	);
}
