/* eslint-disable react-hooks/exhaustive-deps */
// React Imports
import React, { useState, useEffect } from "react";
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
	Select,
	Text,
	useToast,
} from "@chakra-ui/react";

// React Icons Import
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

export default function EditPet() {
	const { petId } = useParams();
	const navigate = useNavigate();
	const toast = useToast();

	// Form useStates
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [breed, setBreed] = useState("");
	const [gender, setGender] = useState("");
	const [dob, setDob] = useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const handleEdit = async () => {
		try {
			setIsLoading(true);
			const response = await axios.patch(
				`${api}/user/updatePet/${petId}`,
				{
					name: name,
					type: type,
					breed: breed,
					gender: gender,
					dob: dob,
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
				navigate(`/pet-details/${petId}`);
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
				`${api}/user/getPetInfo/${petId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
				// 	{
				// 	withCredentials: true,
				// }
			);
			setName(response.data.pet.name);
			setType(response.data.pet.type);
			setBreed(response.data.pet.breed);
			setDob(response.data.pet.dob);
			setGender(response.data.pet.gender);
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
										Edit Pet Profile
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
												Name
											</Text>
											<Input
												id='name'
												type='text'
												name='name'
												value={titleCase(name)}
												onChange={(e) => {
													setName(e.target.value);
												}}
												mr={2.5}
											/>
										</Box>
									</InputGroup>
								</FormControl>

								<FormControl
									id='type'
									display={"flex"}
									justifyContent={"space-evenly"}
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
											Type
										</Text>
										<InputGroup>
											<Select
												id='type'
												name='type'
												cursor={"pointer"}
												value={type}
												onChange={(e) => {
													setType(e.target.value);
												}}
												mr={2.5}
											>
												<option value='dog'>Dog</option>
												<option value='cat'>Cat</option>
												<option value='bird'>Bird</option>
												<option value='turtle'>Turtle</option>
												<option value='monkey'>Monkey</option>
												<option value='hamster'>Hamster</option>
												<option value='fish'>Fish</option>
											</Select>
										</InputGroup>
									</Box>
									<Box
										display={"flex"}
										flexDirection={"column"}
										justifyContent={"center"}
										alignItems={"flex-start"}
										width={"100%"}
									>
										<Text fontSize={"16px"} color={"#7F7F7F"} ml={1.5} mb={1}>
											Breed
										</Text>
										<Input
											id='breed'
											type='text'
											name='breed'
											value={titleCase(breed)}
											onChange={(e) => {
												setBreed(e.target.value);
											}}
											mr={2.5}
										/>
									</Box>
								</FormControl>

								<FormControl
									id='dob'
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
											Date of Birth
										</Text>
										<InputGroup>
											<Input
												id='dob'
												type='date'
												name='dob'
												value={dob}
												onChange={(e) => {
													setDob(e.target.value);
												}}
												mr={2.5}
											/>
										</InputGroup>
									</Box>
								</FormControl>

								<FormControl
									id='gender'
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
											Gender
										</Text>
										<InputGroup>
											<Select
												id='gender'
												name='gender'
												value={gender}
												cursor={"pointer"}
												onChange={(e) => {
													setGender(e.target.value);
												}}
											>
												<option value='male'>Male</option>
												<option value='female'>Female</option>
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
