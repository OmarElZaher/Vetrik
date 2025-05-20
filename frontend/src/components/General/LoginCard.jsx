// // React Imports
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// // Axios Import
// import axios from "axios";

// // API URL Import
// import { API_URL as api } from "../../utils/constants";

// // Chakra UI Imports
// import {
// 	Box,
// 	Button,
// 	Flex,
// 	FormControl,
// 	FormLabel,
// 	Heading,
// 	Icon,
// 	IconButton,
// 	Input,
// 	InputGroup,
// 	InputRightElement,
// 	Stack,
// 	Text,
// 	useToast,
// } from "@chakra-ui/react";

// // React Icons Imports
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { FiLogIn } from "react-icons/fi";

// // Custom Component Imports
// import Footer from "./Footer";
// import Spinner from "./Spinner";

// export default function LoginCard() {
// 	const navigate = useNavigate();
// 	const toast = useToast();

// 	// Form useState
// 	const [formData, setFormData] = useState({
// 		username: "",
// 		password: "",
// 	});

// 	// Show Password useState
// 	const [showPassword, setShowPassword] = useState(false);

// 	// Misc useState
// 	const [isLoading, setIsLoading] = useState(false);

// 	const handleLogin = async () => {
// try {
// 	setIsLoading(true);

// 	if (formData.username === "" || formData.password === "") {
// 		toast({
// 			title: "يرجى إدخال جميع الحقول",
// 			status: "error",
// 			duration: 2500,
// 			position: "top",
// 			isClosable: true,
// 		});
// 		return;
// 	}

// 	const response = await axios.post(`${api}/user/login`, formData, {
// 		withCredentials: true,
// 	});

// 	if (response.status === 200) {
// 		localStorage.setItem("userRole", response.data.role);
// 		localStorage.setItem("userId", response.data.userId);
// 		toast({
// 			title: response.data.message,
// 			status: "success",
// 			duration: 2000,
// 			position: "top",
// 			isClosable: true,
// 		});

// 		if (response.data.role === "admin") {
// 			navigate("/admin");
// 		} else if (response.data.role === "vet") {
// 			navigate("/vet");
// 		} else if (response.data.role === "secretary") {
// 			navigate("/secretary");
// 		}
// 	} else {
// 		toast({
// 			title: response.data.message,
// 			status: "error",
// 			duration: 2500,
// 			position: "top",
// 			isClosable: true,
// 		});
// 	}
// } catch (error) {
// 	toast({
// 		title: error.response.data.message,
// 		status: "error",
// 		duration: 2500,
// 		position: "top",
// 		isClosable: true,
// 	});
// } finally {
// 	setIsLoading(false);
// }
// 	};

// 	const handleInputChange = (e) => {
// 		const { name, value } = e.target;
// 		setFormData({ ...formData, [name]: value });
// 	};

// 	const handleSubmit = (event) => {
// 		event.preventDefault();
// 		handleLogin();
// 	};

// 	return (
// 		<>
// 			{isLoading ? (
// 				<Spinner />
// 			) : (
// 				<>
// 					<Flex minH={"93vh"} align={"center"} justify={"center"} bg='#F6F9FB'>
// 						<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
// 							<Stack align={"center"}>
// 								<Icon as={FiLogIn} fontSize='100px' />
// 								<Heading dir='rtl' fontSize={"4xl"}>
// 									مرحباً بعودتك يا دكتور! 👋🏽
// 								</Heading>
// 								<Text
// 									dir='rtl'
// 									fontSize={"lg"}
// 									color={"gray.600"}
// 									align={"center"}
// 								>
// 									قم بتسجيل الدخول باستخدام بياناتك للوصول إلى لوحة التحكم
// 									الخاصة بك
// 								</Text>
// 							</Stack>

// 							<Box rounded={"lg"} bg='#F6F9FB' boxShadow={"lg"} p={8}>
// 								<Stack spacing={4}>
// 									<FormControl id='username'>
// 										<FormLabel dir='rtl'>
// 											اسم المستخدم{" "}
// 											<Text display={"inline"} color='red'>
// 												*
// 											</Text>
// 										</FormLabel>
// 										<Input
// 											type='text'
// 											name='username'
// 											value={formData.username}
// 											onChange={handleInputChange}
// 										/>
// 									</FormControl>

// 									<FormControl id='password'>
// 										<FormLabel dir='rtl'>
// 											كلمة السر{" "}
// 											<Text display={"inline"} color='red'>
// 												*
// 											</Text>
// 										</FormLabel>
// 										<InputGroup>
// 											{showPassword ? (
// 												<InputRightElement
// 													children={
// 														<IconButton
// 															_hover={{}}
// 															_active={{}}
// 															onClick={() => {
// 																setShowPassword(!showPassword);
// 															}}
// 															as={FaEye}
// 															cursor={"pointer"}
// 															bg={"#FFF"}
// 															size={"xs"}
// 														/>
// 													}
// 												/>
// 											) : (
// 												<InputRightElement
// 													children={
// 														<IconButton
// 															_hover={{}}
// 															_active={{}}
// 															onClick={() => {
// 																setShowPassword(!showPassword);
// 															}}
// 															as={FaEyeSlash}
// 															cursor={"pointer"}
// 															bg={"#FFF"}
// 															size={"xs"}
// 														/>
// 													}
// 												/>
// 											)}
// 											<Input
// 												id='password'
// 												type={showPassword ? "text" : "password"}
// 												name='password'
// 												value={formData.password}
// 												onChange={handleInputChange}
// 											/>
// 										</InputGroup>
// 									</FormControl>

// 									<Stack spacing={10}>
// 										<Stack
// 											direction={{
// 												base: "column",
// 												sm: "row",
// 											}}
// 											align={"start"}
// 											justify={"space-between"}
// 										>
// 											<Link to={"/forgot-username"}>
// 												<Text
// 													dir='rtl'
// 													color={"blue.400"}
// 													_hover={{
// 														textDecoration: "underline",
// 													}}
// 												>
// 													نسيت اسم المستخدم؟
// 												</Text>
// 											</Link>
// 											<Link to={"/forgot-password"}>
// 												<Text
// 													dir='rtl'
// 													color={"blue.400"}
// 													_hover={{
// 														textDecoration: "underline",
// 													}}
// 												>
// 													نسيت كلمة السر؟
// 												</Text>
// 											</Link>
// 										</Stack>
// 										<Button
// 											dir='rtl'
// 											_hover={{
// 												bg: "blue.500",
// 											}}
// 											onClick={handleSubmit}
// 											bg={"blue.400"}
// 											color={"white"}
// 										>
// 											تسجيل الدخول
// 										</Button>
// 									</Stack>
// 								</Stack>
// 							</Box>
// 						</Stack>
// 					</Flex>
// 					<Footer />
// 				</>
// 			)}
// 		</>
// 	);
// }

// React Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../utils/constants";

import {
	Box,
	Flex,
	Heading,
	Input,
	Button,
	Text,
	useColorMode,
	useColorModeValue,
	useToast,
	IconButton,
	VStack,
	HStack,
	InputGroup,
	Link,
	InputLeftElement,
	InputRightElement,
	keyframes,
} from "@chakra-ui/react";
import { FaMoon, FaSun, FaUser } from "react-icons/fa";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const spin = keyframes`
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
  `;

const LoginPage = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const toast = useToast();
	const navigate = useNavigate();

	const [isSpinning, setIsSpinning] = useState(false);
	const [loginFailed, setLoginFailed] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const bg = useColorModeValue("gray.100", "gray.900");
	const cardBg = useColorModeValue(
		"rgba(255,255,255,0.75)",
		"rgba(45,55,72,0.65)"
	);

	const icon = colorMode === "light" ? <FaMoon /> : <FaSun />;

	const handleThemeToggle = () => {
		setIsSpinning(true);
		toggleColorMode();
		setTimeout(() => setIsSpinning(false), 500);
	};
	const handleTogglePassword = () => setShowPassword(!showPassword);

	const handleLogin = async () => {
		try {
			setIsLoading(true);

			if (username === "" || password === "") {
				setLoginFailed(true);
				toast({
					title: "خطأ في تسجيل الدخول",
					description: "اسم المستخدم أو كلمة المرور غير صحيحة.",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "top",
				});
				setTimeout(() => setLoginFailed(false), 1000);
				return;
			}

			const response = await axios.post(
				`${api}/user/login`,
				{
					username,
					password,
				},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				localStorage.setItem("userRole", response.data.role);
				localStorage.setItem("userId", response.data.userId);
				toast({
					title: response.data.message,
					status: "success",
					duration: 2000,
					position: "top",
					isClosable: true,
				});

				if (response.data.role === "admin") {
					navigate("/admin");
				} else if (response.data.role === "vet") {
					navigate("/vet");
				} else if (response.data.role === "secretary") {
					navigate("/secretary");
				}
			} else {
				setLoginFailed(true);
				toast({
					title: "خطأ في تسجيل الدخول",
					description: "اسم المستخدم أو كلمة المرور غير صحيحة.",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "top",
				});
				setTimeout(() => setLoginFailed(false), 1000);
			}
		} catch (error) {
			setLoginFailed(true);
			toast({
				title: error.response.data.message,
				status: "error",
				duration: 2500,
				position: "top",
				isClosable: true,
			});
			setTimeout(() => setLoginFailed(false), 1000);
		} finally {
			setIsLoading(false);
		}
	};

	return isLoading ? (
		<></>
	) : (
		<>
			<Flex
				minH='100vh'
				align='center'
				justify='center'
				bg={bg}
				px={4}
				position='relative'
				overflow='hidden'
			>
				<Box
					bg={cardBg}
					p={8}
					rounded='xl'
					boxShadow='lg'
					w={{ base: "100%", sm: "400px" }}
					backdropFilter='blur(10px)'
					border='1px solid rgba(255, 255, 255, 0.2)'
					animation={loginFailed ? "shake 0.3s" : ""}
					sx={{
						"@keyframes shake": {
							"0%": { transform: "translateX(0px)" },
							"25%": { transform: "translateX(-10px)" },
							"50%": { transform: "translateX(10px)" },
							"75%": { transform: "translateX(-10px)" },
							"100%": { transform: "translateX(0px)" },
						},
					}}
				>
					<Flex justify='space-between' align='center' mb={6}>
						<Box>
							<Heading size='md' color='blue.500'>
								مرحباً بعودتك يا دكتور! 👋🏽
							</Heading>
							<Text fontSize='sm' color='gray.500' mt={1}>
								قم بتسجيل الدخول باستخدام بياناتك
							</Text>
						</Box>

						<IconButton
							aria-label='Toggle Theme'
							icon={icon}
							onClick={handleThemeToggle}
							size='sm'
							variant='ghost'
							animation={isSpinning ? `${spin} 0.5s linear` : ""}
						/>
					</Flex>

					<VStack spacing={4}>
						<InputGroup>
							<InputRightElement>
								<FaUser color='gray.400' />
							</InputRightElement>
							<Input
								placeholder='اسم المستخدم'
								size='md'
								pl='2.5rem'
								pr='2.5rem'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</InputGroup>

						<InputGroup>
							<InputLeftElement>
								<IconButton
									variant='ghost'
									size='sm'
									icon={showPassword ? <FaEyeSlash /> : <FaEye />}
									onClick={handleTogglePassword}
								/>
							</InputLeftElement>

							<InputRightElement pointerEvents='none'>
								<FaLock color='gray.400' />
							</InputRightElement>

							<Input
								placeholder='كلمة السر'
								type={showPassword ? "text" : "password"}
								size='md'
								pr='2.5rem'
								pl='2.5rem'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</InputGroup>

						<Button
							colorScheme='blue'
							width='100%'
							mt={2}
							onClick={handleLogin}
							_active={{
								transform: "scale(0.98)",
								boxShadow: "sm",
							}}
						>
							تسجيل الدخول
						</Button>
					</VStack>

					<HStack justify='space-between' mt={4} fontSize='sm'>
						<Link color='blue.400' href='/forgot-password'>
							نسيت كلمة السر؟
						</Link>
						<Link color='blue.400' href='/forgot-username'>
							نسيت اسم المستخدم؟
						</Link>
					</HStack>
				</Box>
			</Flex>
		</>
	);
};

export default LoginPage;
