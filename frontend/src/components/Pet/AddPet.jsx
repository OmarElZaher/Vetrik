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

import { MdOutlinePets } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

import Spinner from "../General/Spinner";
import Footer from "../General/Footer";

export default function AddPet() {
	const navigate = useNavigate();
	const toast = useToast();

	// Pet Data
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [breed, setBreed] = useState("");
	const [gender, setGender] = useState("");
	const [dob, setDob] = useState("");
	const [ownerEmail, setOwnerEmail] = useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const handleAdd = async () => {
		try {
			setIsLoading(true);

			if (
				name === "" ||
				type === "" ||
				breed === "" ||
				gender === "" ||
				dob === null ||
				ownerEmail === ""
			) {
				toast({
					title: "Please Enter All Fields",
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			} else {
				const res = await axios.post(
					"http://localhost:1234/user/getOwner",
					{ email: ownerEmail },
					{ withCredentials: true }
				);

				if (res.status === 200) {
					const formData = {
						owners: [res.data[0]._id],
						name: name,
						type: type,
						breed: breed,
						gender: gender,
						dob: dob,
					};

					const response = await axios.post(
						"http://localhost:1234/user/createPet",
						formData,
						{
							withCredentials: true,
						}
					);

					if (response.status === 200) {
						toast({
							title: response.data.message,
							status: "success",
							duration: 2500,
							isClosable: true,
							position: "top",
						});
						navigate(`/pet-details/${response.data.pet._id}`);
					} else {
						toast({
							title: response.data.message,
							status: "error",
							duration: 2500,
							isClosable: true,
							position: "top",
						});
					}
				} else {
					toast({
						title: "Owner Not Found",
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
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
									<Icon as={MdOutlinePets} fontSize={"60px"} />
								</Box>

								<Box
									height={"15%"}
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									mt={5}
								>
									<Text fontSize={"3xl"} fontWeight={"bold"}>
										Add A Pet
									</Text>
								</Box>
								<Box
									height={"60%"}
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									flexDirection={"column"}
								>
									<FormControl id='name' mb={5}>
										<Input
											type='text'
											name='name'
											placeholder='Pet Name'
											value={name}
											onChange={(e) => {
												setName(e.target.value);
											}}
											mb={1.25}
										/>
									</FormControl>

									<FormControl
										id='type'
										display={"flex"}
										justifyContent={"space-evenly"}
										mb={5}
									>
										<Select
											name='type'
											cursor={"pointer"}
											placeholder='Type of Animal'
											value={type}
											onChange={(e) => {
												setType(e.target.value);
											}}
											mr={2}
										>
											<option value='Dog'>Dog</option>
											<option value='Cat'>Cat</option>
											<option value='Bird'>Bird</option>
											<option value='Turtle'>Turtle</option>
											<option value='Monkey'>Monkey</option>
											<option value='Hamster'>Hamster</option>
											<option value='Fish'>Fish</option>
										</Select>

										<Input
											type='text'
											name='breed'
											placeholder='Breed of Animal'
											value={breed}
											onChange={(e) => {
												setBreed(e.target.value);
											}}
											ml={2}
										/>
									</FormControl>
									<FormControl id='gender' mb={5}>
										<Select
											name='gender'
											cursor={"pointer"}
											placeholder='Select Gender'
											value={gender}
											onChange={(e) => {
												setGender(e.target.value);
											}}
										>
											<option value='Male'>Male</option>
											<option value='Female'>Female</option>
										</Select>
									</FormControl>
									<FormControl id='dob' mb={5}>
										<Input
											type='date'
											name='dob'
											placeholder='Date of Birth'
											value={dob}
											onChange={(e) => {
												setDob(e.target.value);
											}}
										/>
									</FormControl>

									<FormControl>
										<Input
											type='text'
											name='owner'
											placeholder='Owner Email'
											value={ownerEmail}
											onChange={(e) => {
												setOwnerEmail(e.target.value);
											}}
										/>
									</FormControl>
								</Box>
								<Box
									height={"10%"}
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
								>
									<Button
										onClick={handleAdd}
										_hover={{
											bg: "yellowgreen",
											color: "#000",
											transform: "scale(1.01)",
										}}
										_active={{
											transform: "scale(0.99)",
											opacity: "0.5",
										}}
										width={"25%"}
										leftIcon={<IoMdAdd />}
									>
										Add
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
