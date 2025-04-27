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
	InputGroup,
	InputRightAddon,
	Icon,
	List,
	Text,
	ListItem,
	ListIcon,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import { IoMdSearch } from "react-icons/io";
import { FaPerson } from "react-icons/fa6";
import { MdSettings } from "react-icons/md";

// Custom Components Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

export default function SearchOwner() {
	const toast = useToast();
	const navigate = useNavigate();

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
				localStorage.setItem("ownerFilterData", JSON.stringify(response.data));
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

	const handleFullNameChange = (e) => {
		setFullName(e.target.value);
	};

	const handleMobileNumberChange = (e) => {
		setMobileNumber(e.target.value);
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		handleSearch();
	};

	return (
		<>
			{isLoading ? (
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
								<Icon as={FaPerson} fontSize={"60px"} />

								<Heading size='lg' mt={2}>
									بحث عن المالك
								</Heading>
							</Box>

							<Box height={"10%"} mr={10} my={7}>
								<List>
									<ListItem>
										<ListIcon as={MdSettings} color='yellowgreen' />
										أدخل اسم أو أكتر علشان توصل للمالك اللي بتدور عليه.
									</ListItem>
									<ListItem>
										<ListIcon as={MdSettings} color='yellowgreen' />
										لو عايز تشوف كل المالكين، دوس{" "}
										<Text display={"inline"} color={"yellowgreen"}>
											بحث
										</Text>{" "}
										من غير ما تكتب حاجة.
									</ListItem>
								</List>
							</Box>

							<hr />

							<Box dir='rtl' height={"50%"} p={10}>
								{/* Search Form */}
								<FormControl
									id='fullName'
									display={"flex"}
									justifyContent={"space-evenly"}
								>
									<Input
										id='fullName'
										type='text'
										name='fullName'
										placeholder='(الاسم كامل (الاسم الأول واسم العائلة'
										value={fullName}
										onChange={handleFullNameChange}
										ml={2.5}
									/>
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
											onChange={handleEmailChange}
										/>
									</InputGroup>
								</FormControl>

								<FormControl id='mobileNumber' mt={5}>
									<InputGroup>
										<InputRightAddon
											dir='rtl'
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
											onChange={handleMobileNumberChange}
										/>
									</InputGroup>
								</FormControl>

								<FormControl
									dir='rtl'
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
										rightIcon={<Icon as={IoMdSearch} />}
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
			)}
		</>
	);
}
