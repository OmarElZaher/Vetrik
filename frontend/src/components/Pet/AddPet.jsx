// React Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import {
	Box,
	Button,
	Card,
	CardBody,
	FormControl,
	Icon,
	Input,
	Select,
	Text,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import { IoMdAdd } from "react-icons/io";
import { MdOutlinePets } from "react-icons/md";

// Custom Components Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

export default function AddPet() {
	const navigate = useNavigate();
	const toast = useToast();

	// Form useStates
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [breed, setBreed] = useState("");
	const [gender, setGender] = useState("");
	const [dob, setDob] = useState("");
	const [weight, setWeight] = useState("");
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
				(ownerEmail === "" && localStorage.getItem("ownerId") === null)
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
					`${api}/user/getOwner`,
					{ email: ownerEmail },
					{ withCredentials: true }
				);

				if (res.status === 200) {
					const formData = {
						owners: localStorage.getItem("ownerId")
							? [localStorage.getItem("ownerId")]
							: [res.data[0]._id],
						name: name,
						type: type,
						breed: breed,
						gender: gender,
						dob: dob,
						weight: weight,
					};

					const response = await axios.post(`${api}/user/createPet`, formData, {
						withCredentials: true,
					});

					if (response.status === 200) {
						toast({
							title: response.data.message,
							status: "success",
							duration: 2500,
							isClosable: true,
							position: "top",
						});
						localStorage.removeItem("ownerId");
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
						bg={"#F3F3F3"}
						height={"87vh"}
					>
						<Card
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							width={"80%"}
							height={"80%"}
						>
							<CardBody
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								width={"80%"}
							>
								<Box
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									height={"5%"}
									mt={5}
								>
									<Icon as={MdOutlinePets} fontSize={"60px"} />
								</Box>

								<Box
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									height={"15%"}
									mt={5}
								>
									<Text fontSize={"3xl"} fontWeight={"bold"}>
										Add A Pet
									</Text>
								</Box>
								<Box
									display={"flex"}
									flexDirection={"column"}
									justifyContent={"center"}
									alignItems={"center"}
									height={"60%"}
								>
									<FormControl id='name' mb={5}>
										<Input
											id='name'
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
											id='type'
											name='type'
											placeholder='Type of Animal'
											cursor={"pointer"}
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

										<Select
											id='breed'
											name='breed'
											placeholder='Breed of Animal'
											value={breed}
											onChange={(e) => {
												setBreed(e.target.value);
											}}
											ml={2}
										>
											{type === "Dog" && (
												<>
													<option value='Stray'>Stray</option>
													<option value='Labrador'>Labrador</option>
													<option value='German Shepherd'>
														German Shepherd
													</option>
													<option value='Golden Retriever'>
														Golden Retriever
													</option>
													<option value='Bulldog'>Bulldog</option>
													<option value='Beagle'>Beagle</option>
													<option value='Cocker Spaniel'>Cocker Spaniel</option>
												</>
											)}
											{type === "Cat" && (
												<>
													<option value='Stray'>Stray</option>
													<option value='Persian'>Persian</option>
													<option value='Siamese'>Siamese</option>
													<option value='Maine Coon'>Maine Coon</option>
													<option value='Ragdoll'>Ragdoll</option>
													<option value='Bengal'>Bengal</option>
												</>
											)}
											{type === "Bird" && (
												<>
													<option value='Parrot'>Parrot</option>
													<option value='Canary'>Canary</option>
													<option value='Finch'>Finch</option>
													<option value='Cockatiel'>Cockatiel</option>
													<option value='Budgerigar'>Budgerigar</option>
												</>
											)}
											{type === "Turtle" && (
												<>
													<option value='Red-Eared Slider'>
														Red-Eared Slider
													</option>
													<option value='Box Turtle'>Box Turtle</option>
													<option value='Painted Turtle'>Painted Turtle</option>
													<option value='Snapping Turtle'>
														Snapping Turtle
													</option>
													<option value='Wood Turtle'>Wood Turtle</option>
												</>
											)}
											{type === "Monkey" && (
												<>
													<option value='Capuchin'>Capuchin</option>
													<option value='Marmoset'>Marmoset</option>
													<option value='Tamarin'>Tamarin</option>
													<option value='Squirrel Monkey'>
														Squirrel Monkey
													</option>
													<option value='Macaque'>Macaque</option>
												</>
											)}
											{type === "Hamster" && (
												<>
													<option value='Syrian'>Syrian</option>
													<option value='Dwarf Campbell Russian'>
														Dwarf Campbell Russian
													</option>
													<option value='Dwarf Winter White Russian'>
														Dwarf Winter White Russian
													</option>
													<option value='Chinese'>Chinese</option>
													<option value='Roborovski'>Roborovski</option>
												</>
											)}
											{type === "Fish" && (
												<>
													<option value='Goldfish'>Goldfish</option>
													<option value='Betta'>Betta</option>
													<option value='Guppy'>Guppy</option>
													<option value='Angelfish'>Angelfish</option>
													<option value='Molly'>Molly</option>
												</>
											)}
										</Select>
									</FormControl>

									<FormControl id='gender' mb={5}>
										<Select
											id='gender'
											name='gender'
											placeholder='Select Gender'
											cursor={"pointer"}
											value={gender}
											onChange={(e) => {
												setGender(e.target.value);
											}}
										>
											<option value='Male'>Male</option>
											<option value='Female'>Female</option>
										</Select>
									</FormControl>

									<FormControl
										id='dob'
										mb={5}
										display={"flex"}
										justifyContent={"space-evenly"}
									>
										<Input
											id='dob'
											type='date'
											name='dob'
											placeholder='Date of Birth'
											value={dob}
											onChange={(e) => {
												setDob(e.target.value);
											}}
											mr={2}
										/>

										<Input
											id='weight'
											type='number'
											name='weight'
											placeholder='Weight (KGs)'
											value={weight}
											onChange={(e) => {
												setWeight(e.target.value);
											}}
										/>
									</FormControl>

									<FormControl id='ownerEmail'>
										<Input
											id='ownerEmail'
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
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									height={"10%"}
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
										leftIcon={<IoMdAdd />}
										width={"25%"}
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
