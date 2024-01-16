import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
	Box,
	Button,
	Card,
	FormControl,
	Heading,
	Input,
	InputGroup,
	Icon,
	List,
	Select,
	Text,
	ListItem,
	ListIcon,
	useToast,
} from "@chakra-ui/react";

import { MdSettings } from "react-icons/md";
import { MdOutlinePets } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";

import Spinner from "../General/Spinner";
import Footer from "../General/Footer";
import axios from "axios";

export default function SearchPet() {
	const toast = useToast();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [breed, setBreed] = useState("");
	const [gender, setGender] = useState("");

	const handleSearch = async () => {
		try {
			setIsLoading(true);
			let formData = {};

			if (name !== "") {
				formData.name = name;
			}
			if (type !== "") {
				formData.type = type;
			}
			if (breed !== "") {
				formData.breed = breed;
			}
			if (gender !== "") {
				formData.gender = gender;
			}

			const response = await axios.post(
				"http://localhost:1234/user/getPet",
				formData,
				{ withCredentials: true }
			);

			if (response.status === 200) {
				localStorage.setItem("petFilterData", JSON.stringify(response.data));
				navigate("/pet-table");
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

	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handleTypeChange = (e) => {
		setType(e.target.value);
	};

	const handleBreedChange = (e) => {
		setBreed(e.target.value);
	};

	const handleGenderChange = (e) => {
		setGender(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		handleSearch();
	};

	return isLoading ? (
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
				<Card width='50%' height='75%'>
					<Box
						px={5}
						pt={5}
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						flexDirection={"column"}
						height={"20%"}
					>
						<Icon as={MdOutlinePets} fontSize={"60px"} />

						<Heading size='lg' mt={2}>
							Search For A Pet
						</Heading>
					</Box>

					<Box ml={10} my={7} height={"10%"}>
						<List>
							<ListItem>
								<ListIcon as={MdSettings} color='yellowgreen' />
								Enter one, or more details to find desired pet.
							</ListItem>
							<ListItem>
								<ListIcon as={MdSettings} color='yellowgreen' />
								To get all pets, press{" "}
								<Text display={"inline"} color={"yellowgreen"}>
									search
								</Text>{" "}
								without any inputs.
							</ListItem>
						</List>
					</Box>

					<hr />

					<Box p={10} height={"50%"}>
						{/* Search Form */}
						<FormControl
							id='name'
							display={"flex"}
							justifyContent={"space-evenly"}
						>
							<InputGroup>
								<Input
									type='text'
									name='name'
									placeholder='Name'
									value={name}
									onChange={handleNameChange}
								/>
							</InputGroup>
						</FormControl>

						<FormControl id='type'>
							<InputGroup>
								<Select
									name='type'
									placeholder='Select Type of Animal'
									value={type}
									onChange={handleTypeChange}
									cursor={"pointer"}
									mt={5}
									mr={2.5}
								>
									<option value='Dog'>Dog</option>
									<option value='Cat'>Cat</option>
									<option value='Bird'>Bird</option>
									<option value='Turtle'>Turtle</option>
									<option value='Monkey'>Monkey</option>
									<option value='HamsterFish'>Hamster</option>
									<option value='Fish'>Fish</option>
								</Select>
								<Input
									type='text'
									name='breed'
									placeholder='Breed of Animal'
									value={breed}
									onChange={handleBreedChange}
									mt={5}
									ml={2.5}
								/>
							</InputGroup>
						</FormControl>

						<FormControl id='gender' mt={5}>
							<InputGroup>
								<Select
									name='gender'
									placeholder='Select Gender'
									value={gender}
									onChange={handleGenderChange}
									cursor={"pointer"}
								>
									<option value='Male'>Male</option>
									<option value='Female'>Female</option>
								</Select>
							</InputGroup>
						</FormControl>

						<FormControl
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
							alignItems={"center"}
						>
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
								mt={10}
								width={"50%"}
								leftIcon={<Icon as={IoMdSearch} />}
							>
								Search
							</Button>
							<Text
								_hover={{
									color: "yellowgreen",
									cursor: "pointer",
								}}
								textDecoration={"underline"}
								mt={10}
							>
								<Link to={"/search-owner"}>Search Owner</Link>
							</Text>
						</FormControl>
					</Box>
				</Card>
			</Box>
			<Footer />
		</>
	);
}
