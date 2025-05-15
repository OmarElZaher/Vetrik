// React Imports
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../utils/constants";

// Hook Import
import useIsMobile from "../../hooks/useIsMobile";

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
	useToast,
	Flex,
} from "@chakra-ui/react";

// React Icons Imports
import { IoMdAdd } from "react-icons/io";
import { FaPerson } from "react-icons/fa6";

// Custom Component Imports
import Spinner from "../General/Spinner";
import Footer from "../General/Footer";

export default function AddOwner() {
	const navigate = useNavigate();
	const toast = useToast();
	const isMobile = useIsMobile();

	// Form useStates
	const [fullName, setFullName] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [email, setEmail] = useState("");
	const [gender, setGender] = useState("");
	const [receiveNotifications, setReceiveNotifications] = useState(null);
	const [preferredContactMethod, setPreferredContactMethod] = useState("");

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

	if (isMobile) {
		return (
			<>
			  {isLoading ? (
				<Spinner />
			  ) : (
				<>
				  <Box
					dir='rtl'
					display='flex'
					justifyContent='center'
					alignItems='center'
					bg='#F3F3F3'
					minHeight='90vh'
					px={[2, 5]}
					py={[4, 8]}
				  >
					<Card width={['100%', '95%', '80%']} height='auto'>
					  <CardBody
						display='flex'
						flexDirection='column'
						justifyContent='center'
						alignItems='center'
						width='100%'
						px={[2, 4, 10]}
						py={5}
					  >
						{/* Header Icon */}
						<Icon as={FaPerson} fontSize={["40px", "50px", "60px"]} mt={2} />
		  
						{/* Title */}
						<Text
						  fontSize={["xl", "2xl", "3xl"]}
						  fontWeight='bold'
						  mt={4}
						  textAlign='center'
						>
						  إضافة مالك جديد
						</Text>
		  
						{/* Form */}
						<Box
						  width='100%'
						  mt={8}
						  display='flex'
						  flexDirection='column'
						  gap={5}
						>
						  {/* Full Name & Gender */}
						  <Flex
							flexDirection={['column', 'row']}
							justifyContent='space-between'
							gap={[3, 5]}
						  >
							<Input
							  id='fullName'
							  type='text'
							  name='fullName'
							  placeholder='الاسم كامل (الاسم الأول واسم العائلة)'
							  value={fullName}
							  onChange={(e) => setFullName(e.target.value)}
							  flex='1'
							/>
							<Select
							  id='gender'
							  name='gender'
							  placeholder='اختر الجنس'
							  cursor='pointer'
							  value={gender}
							  onChange={(e) => setGender(e.target.value)}
							  flex='1'
							>
							  <option value='Male'>ذكر</option>
							  <option value='Female'>أنثى</option>
							</Select>
						  </Flex>
		  
						  {/* Email */}
						  <FormControl id='email'>
							<InputGroup>
							  <InputRightAddon>@</InputRightAddon>
							  <Input
								id='email'
								type='email'
								name='email'
								placeholder='البريد الإلكتروني'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							  />
							</InputGroup>
						  </FormControl>
		  
						  {/* Mobile Number */}
						  <FormControl id='mobileNumber'>
							<InputGroup>
							  <InputRightAddon>+٢</InputRightAddon>
							  <Input
								id='mobileNumber'
								type='tel'
								name='mobileNumber'
								placeholder='رقم الموبايل'
								value={mobileNumber}
								onChange={(e) => setMobileNumber(e.target.value)}
							  />
							</InputGroup>
						  </FormControl>
		  
						  {/* Notifications & Preferred Contact */}
						  <Flex
							flexDirection={['column', 'row']}
							gap={[3, 5]}
						  >
							<Select
							  id='receiveNotifications'
							  name='receiveNotifications'
							  placeholder='استقبال الإشعارات؟'
							  cursor='pointer'
							  value={receiveNotifications}
							  onChange={(e) => setReceiveNotifications(e.target.value)}
							  flex='1'
							>
							  <option value='true'>نعم</option>
							  <option value='false'>لا</option>
							</Select>
		  
							<Select
							  id='preferredContactMethod'
							  name='preferredContactMethod'
							  placeholder='طريقة التواصل المفضلة'
							  cursor='pointer'
							  value={preferredContactMethod}
							  onChange={(e) =>
								setPreferredContactMethod(e.target.value)
							  }
							  isDisabled={
								!receiveNotifications || receiveNotifications === 'false'
							  }
							  flex='1'
							>
							  <option value='Email'>بريد إلكتروني</option>
							  <option value='Phone'>مكالمة</option>
							  <option value='Both'>الاثنين</option>
							</Select>
						  </Flex>
		  
						  {/* Submit Button */}
						  <Button
							_hover={{
							  bg: 'yellowgreen',
							  color: '#000',
							  transform: 'scale(1.01)',
							}}
							_active={{
							  transform: 'scale(0.99)',
							  opacity: '0.5',
							}}
							onClick={handleAdd}
							rightIcon={<IoMdAdd />}
							width={['100%', '60%', '25%']}
							alignSelf='center'
							mt={4}
						  >
							إضافة
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

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<Box
						dir='rtl'
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
									<Icon as={FaPerson} fontSize={"60px"} />
								</Box>
								<Box
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									height={"15%"}
									mt={5}
								>
									<Text fontSize={"3xl"} fontWeight={"bold"}>
										إضافة مالك جديد
									</Text>
								</Box>

								<Box
									dir='rtl'
									display={"flex"}
									flexDirection={"column"}
									justifyContent={"center"}
									alignItems={"center"}
									height={"60%"}
								>
									<FormControl
										id='name'
										display={"flex"}
										justifyContent={"space-evenly"}
									>
										<Input
											id='fullName'
											type='text'
											name='fullName'
											placeholder='الاسم كامل (الاسم الأول واسم العائلة)'
											value={fullName}
											onChange={(e) => {
												setFullName(e.target.value);
											}}
											ml={2.5}
										/>
									
										<Select
											id='gender'
											name='gender'
											placeholder='اختر الجنس'
											cursor={"pointer"}
											iconColor='transparent'
											value={gender}
											onChange={(e) => {
												setGender(e.target.value);
											}}
											mr={2.5}
										>
											<option value='Male'>ذكر</option>
											<option value='Female'>أنثى</option>
										</Select>
									</FormControl>

									<FormControl id='email'>
										<InputGroup mt={5}>
											<InputRightAddon
												display={"flex"}
												justifyContent={"center"}
												alignItems={"center"}
												width={"5%"}
											>
												@
											</InputRightAddon>
											<Input
												id='email'
												type='email'
												name='email'
												placeholder='البريد الإلكتروني'
												value={email}
												onChange={(e) => {
													setEmail(e.target.value);
												}}
											/>
										</InputGroup>
									</FormControl>

									<FormControl dir='rtl' id='mobileNumber' mt={5}>
										<InputGroup dir='rtl'>
											<InputRightAddon
												display={"flex"}
												justifyContent={"center"}
												alignItems={"center"}
												width={"5%"}
											>
												+٢
											</InputRightAddon>
											<Input
												dir='rtl'
												id='mobileNumber'
												type='tel'
												name='mobileNumber'
												placeholder='رقم الموبايل'
												value={mobileNumber}
												onChange={(e) => {
													setMobileNumber(e.target.value);
												}}
											/>
										</InputGroup>
									</FormControl>

									<FormControl
										dir='rtl'
										id='notifications'
										mt={5}
										display={"flex"}
									>
										<Select
											id='receiveNotifications'
											name='receiveNotifications'
											placeholder='استقبال الإشعارات؟'
											iconColor='transparent'
											cursor={"pointer"}
											value={receiveNotifications}
											onChange={(e) => {
												setReceiveNotifications(e.target.value);
											}}
											ml={2.5}
										>
											<option value='true'>نعم</option>
											<option value='false'>لا</option>
										</Select>

										<Select
											id='preferredContactMethod'
											name='preferredContactMethod'
											placeholder='طريقة التواصل المفضلة'
											cursor={"pointer"}
											value={preferredContactMethod}
											onChange={(e) => {
												setPreferredContactMethod(e.target.value);
											}}
											disabled={
												receiveNotifications === "false" ||
												receiveNotifications === null ||
												receiveNotifications === ""
											}
											{...(receiveNotifications === "false"
												? { disabled: true }
												: {})}
											mr={2.5}
											iconColor='transparent'
										>
											<option value='Email'>بريد إلكتروني</option>
											<option value='Phone'>مكالمة</option>
											<option value='Both'>الاثنين</option>
										</Select>
									</FormControl>
								</Box>

								<Box
									dir='rtl'
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
										rightIcon={<IoMdAdd />}
										width={"25%"}
									>
										{" "}
										إضافة{" "}
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
