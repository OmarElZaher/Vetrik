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
	Card,
	FormControl,
	Heading,
	Input,
	InputGroup,
	InputRightAddon,
	Icon,
	Divider,
	List,
	Text,
	ListItem,
	ListIcon,
	useToast,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";

// React Icons Imports
import { IoMdSearch } from "react-icons/io";
import { FaPerson } from "react-icons/fa6";
import { MdSettings } from "react-icons/md";

// Custom Components Imports
import Spinner from "../General/Spinner";

export default function SearchOwner() {
	const toast = useToast();
	const navigate = useNavigate();

	const cardBg = useColorModeValue("white", "gray.700");
	const iconColor = useColorModeValue("blue.500", "blue.300");
	const textColor = useColorModeValue("gray.800", "gray.200");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const boxColor = useColorModeValue("gray.50", "gray.800");

	// Form useStates
	const [fullName, setFullName] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [email, setEmail] = useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const handleSearch = async () => {
		try {
			setIsLoading(true);
			let formData = {};

			if (fullName !== "") {
				formData.fullName = fullName;
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
				sessionStorage.setItem(
					"ownerFilterData",
					JSON.stringify(response.data)
				);
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

	return (
		<Box p={6} maxH='87.7vh'>
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
					<Icon as={FaPerson} boxSize={10} color={iconColor} mb={2} />
					<Text fontSize='2xl' fontWeight='bold'>
						بحث عن المالك
					</Text>
				</Box>

				<Box textAlign='right' fontSize='sm' mb={6}>
					<Text>⚙️ أدخل اسم أو أكثر عشان توصل للمالك اللي تقدر عليه.</Text>
					<Text>
						⚙️ لو عايز تشوف كل المالكين، دوس <strong>بحث</strong> من غير ما تكتب
						حاجة.
					</Text>
				</Box>

				<Divider />

				<Box h={6} />

				<VStack spacing={4} align='stretch'>
					<FormControl>
						<InputGroup>
							<InputRightAddon children={<FaPerson />} />
							<Input
								placeholder='اسم المالك'
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
							/>
						</InputGroup>
					</FormControl>

					<FormControl>
						<InputGroup>
							<InputRightAddon children={<MdSettings />} />
							<Input
								placeholder='البريد الإلكتروني'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</InputGroup>
					</FormControl>

					<FormControl>
						<InputGroup>
							<InputRightAddon children={<IoMdSearch />} />
							<Input
								placeholder='رقم الموبايل'
								value={mobileNumber}
								onChange={(e) => setMobileNumber(e.target.value)}
							/>
						</InputGroup>
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
