// React Imports
import React, { useState, useEffect } from "react";
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
	InputGroup,
	InputRightAddon,
	Select,
	Text,
	Flex,
	useToast,
	useColorModeValue,
} from "@chakra-ui/react";

// React Icons Imports
import { IoMdAdd } from "react-icons/io";
import { FaPerson } from "react-icons/fa6";

// Custom Component Imports
import Spinner from "../General/Spinner";

export default function AddOwner() {
	const navigate = useNavigate();
	const toast = useToast();

	// Form useStates
	const [fullName, setFullName] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [email, setEmail] = useState("");
	const [gender, setGender] = useState("");
	const [receiveNotifications, setReceiveNotifications] = useState(null);
	const [preferredContactMethod, setPreferredContactMethod] = useState("");

	const bg = useColorModeValue("gray.100", "gray.900");
	const boxBg = useColorModeValue("gray.100", "gray.800");
	const cardBg = useColorModeValue(
		"rgba(255,255,255,0.75)",
		"rgba(45,55,72,0.65)"
	);
	const flexBg = useColorModeValue("gray.50", "gray.900");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	const iconColor = useColorModeValue("#2F80ED", "#56CCF2");

	const tableColor = useColorModeValue("gray.100", "gray.700");
	const rowBg = useColorModeValue("blue.50", "blue.500");

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const handleAdd = async () => {
		if (
			fullName === "" ||
			mobileNumber === "" ||
			gender === "" ||
			receiveNotifications === "" ||
			receiveNotifications === null
		) {
			toast({
				title: "يرجى إدخال جميع الحقول",
				status: "error",
				duration: 2000,
				isClosable: true,
				position: "top",
			});
		} else if (
			receiveNotifications === "true" &&
			preferredContactMethod === ""
		) {
			toast({
				title: "يرجى اختيار طريقة التواصل المفضلة",
				status: "error",
				duration: 2000,
				isClosable: true,
				position: "top",
			});
		} else {
			if (receiveNotifications === "false") {
				setPreferredContactMethod("Neither");
			}
			try {
				setIsLoading(true);

				const response = await axios.post(
					`${api}/user/createOwner`,
					{
						fullName: fullName,
						mobileNumber: mobileNumber,
						email: email,
						gender: gender,
						receiveNotifications: receiveNotifications,
						preferredContactMethod: preferredContactMethod,
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
					localStorage.setItem("ownerId", response.data.ownerId);
					navigate("/add-pet");
					// navigate(`/owner-details/${response.data.ownerId}`);
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
		}
	};

	useEffect(() => {
		if (receiveNotifications === "false") {
			setPreferredContactMethod("Neither");
		} else {
			setPreferredContactMethod("");
		}
	}, [receiveNotifications]);

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<Box
						display='flex'
						justifyContent='center'
						alignItems='center'
						px={[2, 5]}
						py={[4, 8]}
					>
						<Card
							width={["100%", "95%", "70%"]}
							p={[2, 6, 10]}
							bg={cardBg}
							border='1px solid'
							borderColor={borderColor}
							rounded='2xl'
							boxShadow='md'
							mx='auto'
							display='flex'
							flexDirection='column'
							justifyContent='center'
							alignItems='center'
						>
							{/* Header Icon */}
							<Icon as={FaPerson} fontSize='64px' color={iconColor} mt={2} />

							{/* Title */}
							<Text
								fontSize={["2xl", "3xl"]}
								fontWeight='bold'
								mt={2}
								mb={6}
								textAlign='center'
							>
								إضافة مالك جديد
							</Text>

							{/* Form */}
							<Box w='100%'>
								<Flex
									gap={3}
									mb={5}
									flexDirection={["column", "row"]}
									alignItems='center'
								>
									<Input
										id='fullName'
										type='text'
										name='fullName'
										placeholder='الاسم الكامل (الاسم الأول واسم العائلة)'
										value={fullName}
										onChange={(e) => setFullName(e.target.value)}
										rounded='lg'
										fontSize='md'
										flex='2'
									/>
									<Select
										id='gender'
										name='gender'
										placeholder='اختر الجنس'
										value={gender}
										onChange={(e) => setGender(e.target.value)}
										rounded='lg'
										fontSize='md'
										flex='1'
										cursor='pointer'
										iconColor='transparent'
									>
										<option value='Male'>ذكر</option>
										<option value='Female'>أنثى</option>
									</Select>
								</Flex>

								<InputGroup mb={5}>
									<InputRightAddon children='@' border='none' />
									<Input
										id='email'
										type='email'
										name='email'
										placeholder='البريد الإلكتروني'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										rounded='lg'
										fontSize='md'
									/>
								</InputGroup>

								<InputGroup mb={5}>
									<InputRightAddon children='+٢' border='none' />
									<Input
										id='mobileNumber'
										name='mobileNumber'
										placeholder='رقم الموبايل'
										value={mobileNumber}
										onChange={(e) => setMobileNumber(e.target.value)}
										rounded='lg'
										fontSize='md'
									/>
								</InputGroup>

								<Flex
									gap={3}
									mb={5}
									flexDirection={["column", "row"]}
									alignItems='center'
								>
									<Select
										id='receiveNotifications'
										name='receiveNotifications'
										placeholder='استقبال الإشعارات؟'
										value={receiveNotifications}
										onChange={(e) => setReceiveNotifications(e.target.value)}
										rounded='lg'
										fontSize='md'
										flex='1'
										cursor='pointer'
										iconColor='transparent'
									>
										<option value='true'>نعم</option>
										<option value='false'>لا</option>
									</Select>
									<Select
										id='preferredContactMethod'
										name='preferredContactMethod'
										placeholder='طريقة التواصل المفضلة'
										value={preferredContactMethod}
										onChange={(e) => setPreferredContactMethod(e.target.value)}
										rounded='lg'
										fontSize='md'
										flex='1'
										cursor='pointer'
										disabled={
											receiveNotifications === "false" ||
											receiveNotifications === null ||
											receiveNotifications === ""
										}
										iconColor='transparent'
									>
										<option value='Email'>بريد إلكتروني</option>
										<option value='Phone'>مكالمة</option>
										<option value='Both'>الاثنين</option>
									</Select>
								</Flex>

								<Button
									mt={4}
									w='60%'
									mx='auto'
									display='block'
									fontWeight='bold'
									fontSize='lg'
									rounded='xl'
									rightIcon={<IoMdAdd />}
									onClick={handleAdd}
									_hover={{
										transform: "scale(1.02)",
									}}
									_active={{
										transform: "scale(0.99)",
										opacity: 0.7,
									}}
									isLoading={isLoading}
								>
									إضافة
								</Button>
							</Box>
						</Card>
					</Box>
				</>
			)}
		</>
	);
}
