// React Imports
import React from "react";
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
	Icon,
	Input,
	Text,
	Select,
	useToast,
	useColorModeValue,
	VStack,
	InputGroup,
	InputRightAddon,
	Divider,
} from "@chakra-ui/react";

// React Icons Imports
import {
	FaUserAlt,
	FaUser,
	FaUserTag,
	FaLock,
	FaEnvelope,
} from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";

// Custom Components Imports
import Spinner from "../General/Spinner";

export default function CreateUser() {
	const navigate = useNavigate();
	const toast = useToast();

	// Form useStates
	const [firstName, setFirstName] = React.useState("");
	const [lastName, setLastName] = React.useState("");
	const [username, setUsername] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [role, setRole] = React.useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = React.useState(false);

	// Color mode values
	const cardBg = useColorModeValue(
		"rgba(255,255,255,0.85)",
		"rgba(45,55,72,0.85)"
	);
	const pageBg = useColorModeValue("gray.50", "gray.900");
	const iconColor = useColorModeValue("#2F80ED", "#56CCF2");
	const hintBg = useColorModeValue("blue.50", "blue.900");

	const handleAdd = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/user/createUser`,
				{
					username: username,
					password: password,
					confirmPassword: confirmPassword,
					email: email,
					firstName: firstName,
					lastName: lastName,
					role: role,
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
				navigate(`/admin/user-details/${response.data._id}`);
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
		<Box bg={pageBg} p={6}>
			<Box
				bg={cardBg}
				rounded='xl'
				boxShadow='md'
				p={10}
				maxW='65vw'
				mx='auto'
				mt={12}
				dir='rtl'
			>
				<Box textAlign='center' mb={4}>
					<Icon as={FaUserAlt} boxSize={12} color={iconColor} mb={2} />
					<Text fontSize='2xl' fontWeight='bold'>
						إضافة مستخدم
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
					<Text>📝 أدخل بيانات المستخدم الجديد بدقة.</Text>
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
							<InputRightAddon children={<FaEnvelope />} />
							<Input
								placeholder='البريد الإلكتروني'
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</InputGroup>
					</FormControl>

					<FormControl>
						<InputGroup>
							<InputRightAddon children={<FaUser />} />
							<Input
								placeholder='اسم المستخدم'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</InputGroup>
					</FormControl>

					<FormControl>
						<InputGroup>
							<InputRightAddon children={<FaLock />} />
							<Input
								placeholder='كلمة السر'
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</InputGroup>
					</FormControl>

					<FormControl>
						<InputGroup>
							<InputRightAddon children={<FaLock />} />
							<Input
								placeholder='تأكيد كلمة السر'
								type='password'
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</InputGroup>
					</FormControl>

					<FormControl>
						<Select
							placeholder='اختر الدور'
							iconColor='transparent'
							cursor={"pointer"}
							value={role}
							onChange={(e) => setRole(e.target.value)}
						>
							<option value='vet'>طبيب بيطرى</option>
							<option value='secretary'>سكرتير</option>
							<option value='admin'>أدمن</option>
						</Select>
					</FormControl>

					<Button
						colorScheme='blue'
						leftIcon={<IoIosAdd />}
						onClick={handleAdd}
						isLoading={isLoading}
						mt={2}
						w='100%'
					>
						إضافة
					</Button>
				</VStack>
			</Box>
		</Box>
	);
}
