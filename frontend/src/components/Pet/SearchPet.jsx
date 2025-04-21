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
	FormControl,
	Heading,
	Input,
	Icon,
	List,
	ListItem,
	ListIcon,
	Select,
	Text,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import { IoMdSearch } from "react-icons/io";
import { MdOutlinePets, MdSettings } from "react-icons/md";

// Component Imports
import Spinner from "../General/Spinner";
import Footer from "../General/Footer";

export default function SearchPet() {
	const toast = useToast();
	const navigate = useNavigate();

	// Form useStates
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [breed, setBreed] = useState("");
	const [gender, setGender] = useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

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

			const response = await axios.post(`${api}/user/getPet`, formData, {
				withCredentials: true,
			});

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
						<Icon as={MdOutlinePets} fontSize={"60px"} />

						<Heading size='lg' mt={2}>
							ابحث عن حيوان أليف
						</Heading>
					</Box>

					<Box height={"10%"} mr={10} my={7}>
						<List>
							<ListItem>
								<ListIcon as={MdSettings} color='yellowgreen' />
								أدخل اسم الحيوان أو أي بيانات إضافية للبحث عنه.
							</ListItem>
							<ListItem>
								<ListIcon as={MdSettings} color='yellowgreen' />
								للحصول على جميع الحيوانات، اضغط{" "}
								<Text display={"inline"} color={"yellowgreen"}>
									بحث
								</Text>{" "}
								بدون إدخال أي بيانات.
							</ListItem>
						</List>
					</Box>

					<hr />

					<Box height={"50%"} p={10}>
						{/* Search Form */}
						<FormControl
							id='name'
							display={"flex"}
							justifyContent={"space-evenly"}
						>
							<Input
								id='name'
								type='text'
								name='name'
								placeholder='اسم الحيوان'
								value={name}
								onChange={handleNameChange}
							/>
						</FormControl>

						<FormControl
							id='type'
							display={"flex"}
							justifyContent={"space-evenly"}
							alignItems={"center"}
						>
							<Select
								id='type'
								name='type'
								placeholder='اختر نوع الحيوان'
								cursor={"pointer"}
								value={type}
								iconColor='transparent'
								onChange={handleTypeChange}
								mt={5}
								ml={2.5}
							>
								<option value='Dog'>كلب</option>
								<option value='Cat'>قطة</option>
								<option value='Bird'>عصفور</option>
								<option value='Turtle'>سلحفاة</option>
								<option value='Monkey'>قرد</option>
								<option value='Hamster'>هامستر</option>
								<option value='Fish'>سمكة</option>
							</Select>
							<Input
								id='breed'
								type='text'
								name='breed'
								placeholder='سلالة الحيوان'
								value={breed}
								onChange={handleBreedChange}
								mt={5}
								mr={2.5}
							/>
						</FormControl>

						<FormControl id='gender' mt={5} mr={"25%"}>
							<Select
								id='gender'
								name='gender'
								placeholder='اختر الجنس'
								cursor={"pointer"}
								iconColor='transparent'
								width={"50%"}
								value={gender}
								onChange={handleGenderChange}
							>
								<option value='Male'>ذكر</option>
								<option value='Female'>أنثى</option>
							</Select>
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
								بحث
							</Button>
						</FormControl>
					</Box>
				</Card>
			</Box>
			<Footer />
		</>
	);
}
