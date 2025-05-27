// React Imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import {
	Box,
	Button,
	FormControl,
	Input,
	Icon,
	Select,
	Text,
	useToast,
	VStack,
	Divider,
	useColorModeValue,
} from "@chakra-ui/react";

// React Icons Imports
import { IoMdSearch } from "react-icons/io";
import { MdOutlinePets } from "react-icons/md";

// Component Imports
import Spinner from "../General/Spinner";

export default function SearchPet() {
	const toast = useToast();
	const navigate = useNavigate();

	// Form useStates
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [breed, setBreed] = useState("");
	const [gender, setGender] = useState("");

	const cardBg = useColorModeValue(
		"rgba(255,255,255,0.75)",
		"rgba(45,55,72,0.65)"
	);
	const iconColor = useColorModeValue("#2F80ED", "#56CCF2");

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

	return isLoading ? (
		<Spinner />
	) : (
		<Box p={6}>
			<Box
				bg={cardBg}
				rounded='xl'
				boxShadow='md'
				p={10}
				maxW='1200px'
				maxH='1000px'
				mx='auto'
				mt={8}
				dir='rtl'
			>
				<Box textAlign='center' mb={4}>
					<Icon as={MdOutlinePets} boxSize={10} color={iconColor} mb={2} />
					<Text fontSize='2xl' fontWeight='bold'>
						بحث عن الحيوان الأليف
					</Text>
				</Box>

				<Box textAlign='right' fontSize='sm' mb={6}>
					<Text>⚙️ اكتب اسم أو نوع أو سلالة الحيوان عشان توصل له.</Text>
					<Text>
						⚙️ لو عايز تشوف كل الحيوانات، دوس <strong>بحث</strong> من غير ما
						تكتب حاجة.
					</Text>
				</Box>

				<Divider />

				<Box h={6} />

				<VStack spacing={4} align='stretch'>
					<FormControl>
						<Input
							placeholder='اسم الحيوان'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</FormControl>

					<FormControl>
						<Input
							placeholder='سلالة الحيوان'
							value={breed}
							onChange={(e) => setBreed(e.target.value)}
						/>
					</FormControl>

					<FormControl>
						<Select
							value={type}
							onChange={(e) => setType(e.target.value)}
							iconColor='transparent'
							cursor={"pointer"}
						>
							<option value=''>اختر نوع الحيوان</option>
							<option value='Dog'>كلب</option>
							<option value='Cat'>قطة</option>
							<option value='Bird'>عصفور</option>
							<option value='Turtle'>سلحفاة</option>
							<option value='Hamster'>هامستر</option>
							<option value='Fish'>سمكة</option>
						</Select>
					</FormControl>

					<FormControl>
						<Select
							value={gender}
							onChange={(e) => setGender(e.target.value)}
							iconColor='transparent'
							cursor={"pointer"}
						>
							<option value=''>اختر الجنس</option>
							<option value='Male'>ذكر</option>
							<option value='Female'>أنثى</option>
						</Select>
					</FormControl>

					<Button
						mt={2}
						colorScheme='blue'
						leftIcon={<IoMdSearch />}
						onClick={handleSearch}
						isLoading={isLoading}
					>
						بحث
					</Button>
				</VStack>
			</Box>
		</Box>
	);
}
