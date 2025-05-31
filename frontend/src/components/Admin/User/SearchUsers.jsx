// React Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../../utils/constants";

// ChakraUI Imports
import {
	Box,
	Button,
	Card,
	FormControl,
	Heading,
	Icon,
	Input,
	List,
	ListIcon,
	ListItem,
	Text,
	useToast,
	InputGroup,
	InputRightAddon,
	Divider,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";

// React Icons Imports
import { FaPerson } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { MdSettings, MdAlternateEmail } from "react-icons/md";
import { FaUser, FaUserTag } from "react-icons/fa";

// Custom Component Imports
import Spinner from "../General/Spinner";

export default function SearchUsers() {
	const navigate = useNavigate();
	const toast = useToast();

	// Form useStates
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	// Color mode values (move hooks to top level)
	const cardBg = useColorModeValue(
		"rgba(255,255,255,0.85)",
		"rgba(45,55,72,0.85)"
	);
	const iconColor = useColorModeValue("#2F80ED", "#56CCF2");
	const pageBg = useColorModeValue("gray.50", "gray.900");
	const hintBg = useColorModeValue("blue.50", "blue.900");

	const handleSearch = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/user/getUsers`,
				{
					firstName: firstName,
					lastName: lastName,
					username: username,
					email: email,
				},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				localStorage.setItem(
					"usersFilterData",
					JSON.stringify(response.data.users)
				);
				navigate("/admin/users-table");
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

	return isLoading ? (
		<Spinner />
	) : (
		<Box p={6} bg={pageBg}>
			<Box
				bg={cardBg}
				rounded='xl'
				boxShadow='md'
				p={10}
				maxW='75vw'
				mx='auto'
				mt={12}
				dir='rtl'
			>
				<Box textAlign='center' mb={4}>
					<Icon as={FaPerson} boxSize={12} color={iconColor} mb={2} />
					<Text fontSize='2xl' fontWeight='bold'>
						بحث عن مستخدم
					</Text>
				</Box>

				<Box
					textAlign='right'
					fontSize='sm'
					mb={6}
					bg={hintBg}
					p={3}
					rounded='md'
				>
					<Text>
						🔎 أدخل اسم أو أكثر أو البريد الإلكتروني أو اسم المستخدم للبحث عن
						المستخدم.
					</Text>
					<Text>
						🔎 لعرض جميع المستخدمين، اضغط <b>بحث</b> بدون إدخال بيانات.
					</Text>
				</Box>

				<Divider />
				<Box h={6} />

				<VStack spacing={4} align='stretch'>
					<FormControl>
						<InputGroup>
							<InputRightAddon children={<FaUser />} />
							<Input
								placeholder='الاسم الأول'
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>
						</InputGroup>
					</FormControl>

					<FormControl>
						<InputGroup>
							<InputRightAddon children={<FaUserTag />} />
							<Input
								placeholder='اسم العائلة'
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</InputGroup>
					</FormControl>

					<FormControl>
						<InputGroup>
							<InputRightAddon children={<IoMdSearch />} />
							<Input
								placeholder='اسم المستخدم'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</InputGroup>
					</FormControl>

					<FormControl>
						<InputGroup>
							<InputRightAddon children={<MdAlternateEmail />} />
							<Input
								placeholder='البريد الإلكتروني'
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</InputGroup>
					</FormControl>

					<Button
						colorScheme='blue'
						leftIcon={<IoMdSearch />}
						onClick={handleSearch}
						isLoading={isLoading}
						mt={2}
						w='100%'
					>
						بحث
					</Button>
				</VStack>
			</Box>
		</Box>
	);
}
