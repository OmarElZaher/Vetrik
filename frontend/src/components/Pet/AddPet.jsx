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
	CardBody,
	FormControl,
	Icon,
	Input,
	Select,
	Text,
	Flex,
	useToast,
	useColorModeValue,
} from "@chakra-ui/react";

// React Icons Imports
import { IoMdAdd } from "react-icons/io";
import { MdOutlinePets } from "react-icons/md";

// Custom Components Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

export default function AddPet() {
	const navigate = useNavigate();
	const toast = useToast();

	// Form useStates
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [breed, setBreed] = useState("");
	const [gender, setGender] = useState("");
	const [dob, setDob] = useState("");
	const [weight, setWeight] = useState("");
	const [ownerMobileNumber, setownerMobileNumber] = useState("");

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
		try {
			setIsLoading(true);

			if (
				name === "" ||
				type === "" ||
				breed === "" ||
				gender === "" ||
				weight === "" ||
				dob === null ||
				dob === "" ||
				(ownerMobileNumber === "" && localStorage.getItem("ownerId") === null)
			) {
				toast({
					title: "يرجى إدخال جميع الحقول",
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			} else {
				const res = await axios.post(
					`${api}/user/getOwner`,
					{ mobileNumber: ownerMobileNumber },
					{ withCredentials: true }
				);

				if (res.status === 200) {
					const formData = {
						owners: localStorage.getItem("ownerId")
							? [localStorage.getItem("ownerId")]
							: [res.data[0]._id],
						name: name,
						type: type,
						breed: breed,
						gender: gender,
						dob: dob,
						weight: weight,
					};

					const response = await axios.post(`${api}/user/createPet`, formData, {
						withCredentials: true,
					});

					if (response.status === 200) {
						toast({
							title: response.data.message,
							status: "success",
							duration: 2500,
							isClosable: true,
							position: "top",
						});
						localStorage.removeItem("ownerId");
						navigate(`/pet-details/${response.data.pet._id}`);
					} else {
						toast({
							title: response.data.message,
							status: "error",
							duration: 2500,
							isClosable: true,
							position: "top",
						});
					}
				} else {
					toast({
						title: "Owner Not Found",
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
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
							<Icon
								as={MdOutlinePets}
								fontSize='64px'
								color={iconColor}
								mt={2}
							/>

							{/* Title */}
							<Text
								fontSize={["2xl", "3xl"]}
								fontWeight='bold'
								mt={2}
								mb={6}
								textAlign='center'
							>
								إضافة حيوان
							</Text>

							{/* Form */}
							<Box w='100%'>
								{/* Pet Name */}
								<Input
									id='name'
									type='text'
									name='name'
									placeholder='اسم الحيوان'
									value={name}
									onChange={(e) => setName(e.target.value)}
									rounded='lg'
									fontSize='md'
									mb={5}
								/>

								{/* Type & Breed */}
								<Flex
									gap={3}
									mb={5}
									flexDirection={["column", "row"]}
									alignItems='center'
								>
									<Select
										id='type'
										name='type'
										placeholder='نوع الحيوان'
										value={type}
										onChange={(e) => setType(e.target.value)}
										rounded='lg'
										fontSize='md'
										iconColor='transparent'
										flex='1'
										cursor='pointer'
									>
										<option value='Dog'>كلب</option>
										<option value='Cat'>قطة</option>
										<option value='Bird'>طائر</option>
										<option value='Turtle'>سلحفاة</option>
										<option value='Monkey'>قرد</option>
										<option value='Hamster'>هامستر</option>
										<option value='Fish'>سمكة</option>
									</Select>
									<Select
										id='breed'
										name='breed'
										placeholder='سلالة الحيوان'
										value={breed}
										onChange={(e) => setBreed(e.target.value)}
										rounded='lg'
										fontSize='md'
										flex='1'
										iconColor='transparent'
										cursor='pointer'
										disabled={!type}
									>
										{/* Breed options based on type */}
										{type === "Dog" && (
											<>
												<option value='Stray'>Stray</option>
												<option value='Labrador'>Labrador</option>
												<option value='German Shepherd'>German Shepherd</option>
												<option value='Golden Retriever'>
													Golden Retriever
												</option>
												<option value='Bulldog'>Bulldog</option>
												<option value='Beagle'>Beagle</option>
												<option value='Cocker Spaniel'>Cocker Spaniel</option>
											</>
										)}
										{type === "Cat" && (
											<>
												<option value='Stray'>Stray</option>
												<option value='Persian'>Persian</option>
												<option value='Siamese'>Siamese</option>
												<option value='Maine Coon'>Maine Coon</option>
												<option value='Ragdoll'>Ragdoll</option>
												<option value='Bengal'>Bengal</option>
											</>
										)}
										{type === "Bird" && (
											<>
												<option value='Parrot'>Parrot</option>
												<option value='Canary'>Canary</option>
												<option value='Finch'>Finch</option>
												<option value='Cockatiel'>Cockatiel</option>
												<option value='Budgerigar'>Budgerigar</option>
											</>
										)}
										{type === "Turtle" && (
											<>
												<option value='Red-Eared Slider'>
													Red-Eared Slider
												</option>
												<option value='Box Turtle'>Box Turtle</option>
												<option value='Painted Turtle'>Painted Turtle</option>
												<option value='Snapping Turtle'>Snapping Turtle</option>
												<option value='Wood Turtle'>Wood Turtle</option>
											</>
										)}
										{type === "Monkey" && (
											<>
												<option value='Capuchin'>Capuchin</option>
												<option value='Marmoset'>Marmoset</option>
												<option value='Tamarin'>Tamarin</option>
												<option value='Squirrel Monkey'>Squirrel Monkey</option>
												<option value='Macaque'>Macaque</option>
											</>
										)}
										{type === "Hamster" && (
											<>
												<option value='Syrian'>Syrian</option>
												<option value='Dwarf Campbell Russian'>
													Dwarf Campbell Russian
												</option>
												<option value='Dwarf Winter White Russian'>
													Dwarf Winter White Russian
												</option>
												<option value='Chinese'>Chinese</option>
												<option value='Roborovski'>Roborovski</option>
											</>
										)}
										{type === "Fish" && (
											<>
												<option value='Goldfish'>Goldfish</option>
												<option value='Betta'>Betta</option>
												<option value='Guppy'>Guppy</option>
												<option value='Angelfish'>Angelfish</option>
												<option value='Molly'>Molly</option>
											</>
										)}
									</Select>
								</Flex>

								{/* Gender & DOB */}
								<Flex
									gap={3}
									mb={5}
									flexDirection={["column", "row"]}
									alignItems='center'
								>
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
									<Input
										id='dob'
										type='date'
										name='dob'
										placeholder='تاريخ الميلاد'
										value={dob}
										onChange={(e) => setDob(e.target.value)}
										rounded='lg'
										fontSize='md'
										flex='1'
									/>
								</Flex>

								{/* Weight */}
								<Input
									id='weight'
									type='number'
									name='weight'
									placeholder='الوزن (كجم)'
									value={weight}
									onChange={(e) => setWeight(e.target.value)}
									rounded='lg'
									fontSize='md'
									mb={5}
								/>

								<Input
									id='ownerMobileNumber'
									type='text'
									name='ownerMobileNumber'
									placeholder='رقم هاتف المالك'
									value={ownerMobileNumber}
									onChange={(e) => setownerMobileNumber(e.target.value)}
									rounded='lg'
									fontSize='md'
									mb={5}
								/>

								{/* Submit Button */}
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
