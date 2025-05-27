import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import { API_URL as api } from "../../utils/constants";

import {
	Box,
	Button,
	Center,
	Icon,
	Text,
	SimpleGrid,
	Input,
	Select,
	Flex,
	useDisclosure,
	useColorModeValue,
	useToast,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@chakra-ui/react";

import { IoMdEye } from "react-icons/io";
import { TbTrashXFilled } from "react-icons/tb";

import Spinner from "../General/Spinner";

function titleCase(str) {
	if (!str || typeof str !== "string") return "";
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function formatDate(date) {
	const d = new Date(date);
	let month = "" + (d.getMonth() + 1);
	let day = "" + d.getDate();
	let year = d.getFullYear();

	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;

	return [day, month, year].join("-");
}

export default function OwnerDetails() {
	const { ownerId } = useParams();
	const toast = useToast();
	const navigate = useNavigate();

	const [owner, setOwner] = useState({});

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const cardBg = useColorModeValue("white", "gray.700");
	const iconColor = useColorModeValue("blue.500", "blue.300");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const boxColor = useColorModeValue("gray.50", "gray.800");

	const handleRemovePet = async (petId) => {
		const confirmDelete = window.confirm(
			"هل أنت متأكد أنك تريد حذف هذا الحيوان؟"
		);

		if (!confirmDelete) return;

		try {
			setIsLoading(true);

			const response = await axios.delete(
				`${api}/user/removePetFromOwner/${owner._id}/${petId}`,
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				toast({
					title: response.data.message,
					status: "success",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
				setOwner((prev) => ({
					...prev,
					pets: prev.pets.filter((pet) => pet._id !== response.data.petId),
				}));
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

	const handleDeleteOwner = async () => {
		const confirmDelete = window.confirm(
			"هل أنت متأكد أنك تريد حذف هذا المالك؟"
		);

		if (!confirmDelete) return;

		try {
			setIsLoading(true);
			const response = await axios.delete(
				`${api}/user/deleteOwner/${owner._id}`,
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
				navigate("/search-owner");
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

	const {
		isOpen: isEditOpen,
		onOpen: openEditModal,
		onClose: closeEditModal,
	} = useDisclosure();

	const [updatedOwner, setUpdatedOwner] = useState({
		fullName: "",
		gender: "",
		mobileNumber: "",
		preferredContactMethod: "",
	});

	const [newPet, setNewPet] = useState({
		name: "",
		type: "",
		breed: "",
		gender: "",
		weight: "",
		dob: "",
	});

	const handleCreatePet = async () => {
		if (
			!newPet.name ||
			!newPet.type ||
			!newPet.breed ||
			!newPet.gender ||
			!newPet.weight ||
			!newPet.dob
		) {
			toast({
				title: "يرجى ملء جميع الحقول",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
			return;
		}
		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/user/createPet`,
				{
					...newPet,
					owners: [owner._id],
				},
				{ withCredentials: true }
			);
			if (response.status === 200) {
				toast({
					title: "تم إضافة الحيوان بنجاح",
					status: "success",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
				setOwner((prev) => ({
					...prev,
					pets: [...prev.pets, response.data.pet],
				}));
				setNewPet({
					name: "",
					type: "",
					breed: "",
					gender: "",
					weight: "",
					dob: "",
				});
			}
		} catch (error) {
			toast({
				title: error?.response?.data?.message || "حدث خطأ",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (owner?._id) {
			setUpdatedOwner({
				fullName: owner.fullName || "",
				gender: owner.gender || "",
				mobileNumber: owner.mobileNumber || "",
				preferredContactMethod: owner.preferredContactMethod || "",
			});
		}
	}, [owner]);

	const handleUpdateOwner = async () => {
		try {
			setIsLoading(true);
			const response = await axios.patch(
				`${api}/user/updateOwner/${owner._id}`,
				updatedOwner,
				{ withCredentials: true }
			);
			if (response.status === 200) {
				toast({
					title: "تم تحديث بيانات المالك بنجاح",
					status: "success",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
				setOwner((prev) => ({
					...prev,
					...updatedOwner,
				}));
				closeEditModal();
			}
		} catch (error) {
			toast({
				title: error?.response?.data?.message || "حدث خطأ أثناء التحديث",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(
					`${api}/user/getOwnerInfo/${ownerId}`,
					{ withCredentials: true }
				);
				if (response.status === 200) {
					setOwner(response.data);
				} else {
					setError(response.data.message);
				}
			} catch (error) {
				setError(error.response.data.message);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [ownerId]);

	if (isLoading) return <Spinner />;
	if (error) return <Text color='red.500'>{error}</Text>;

	return (
		<>
			<Box dir='rtl' p={6}>
				{/* Page Title */}
				<Text fontSize='2xl' fontWeight='bold' mb={2} textAlign='center'>
					تفاصيل المالك
				</Text>
				<Text fontSize={"xl"} fontWeight={"bold"} textAlign={"center"} mb={4}>
					{titleCase(owner?.fullName)}
				</Text>

				<Flex
					direction={{ base: "column", md: "row" }}
					gap={6}
					justify='center'
					mb={10}
				>
					<Box bg={boxColor} p={6} rounded='xl' boxShadow='md' flex='1'>
						<Center>
							<Text fontSize='lg' fontWeight='semibold' mb={4}>
								معلومات المالك
							</Text>
						</Center>

						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
							{[
								{
									// icon: IoMdPaw,
									label: "الاسم",
									value: titleCase(owner?.fullName),
								},
								{
									// icon: IoMdMale,
									label: "الجنس",
									value: owner?.gender === "male" ? "ذكر" : "أنثى",
								},
								{
									// icon: IoMdPricetags,
									label: "رقم الهاتف",
									value: owner?.mobileNumber,
								},
								{
									// icon: FaWeightScale,
									label: "طريقة التواصل المفضلة",
									value:
										owner?.preferredContactMethod === "phone"
											? "الهاتف"
											: owner?.preferredContactMethod === "email"
											? "البريد الإلكتروني"
											: owner?.preferredContactMethod === "both"
											? "الهاتف والبريد الإلكتروني"
											: "لا تواصل",
								},
							].map((item, i) => (
								<Flex
									key={i}
									bg={cardBg}
									p={3}
									rounded='md'
									align='center'
									boxShadow='sm'
									border='1px solid'
									borderColor={borderColor}
									gap={3}
								>
									<Icon as={item.icon} boxSize={5} color={iconColor} />
									<Text>
										<strong>{item.label}:</strong> {item.value}
									</Text>
								</Flex>
							))}
						</SimpleGrid>

						<Box h={6} />

						<Center gap={3} mt={4}>
							<Button colorScheme='blue' size='sm' onClick={openEditModal}>
								تعديل المالك
							</Button>
							<Button
								colorScheme='red'
								size='sm'
								onClick={() => {
									handleDeleteOwner();
									navigate("/search-owner");
								}}
								leftIcon={<Icon as={TbTrashXFilled} />}
							>
								حذف المالك
							</Button>
						</Center>
					</Box>

					<Box bg={boxColor} p={6} rounded='xl' boxShadow='md' flex='1'>
						<Text fontSize='lg' fontWeight='semibold' mb={4} textAlign='center'>
							➕ إضافة حيوان جديد
						</Text>

						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
							<Input
								placeholder='اسم الحيوان'
								value={newPet.name}
								onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
							/>
							<Select
								placeholder='نوع الحيوان'
								value={newPet.type}
								iconColor='transparent'
								cursor={"pointer"}
								onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
							>
								<option value='dog'>كلب</option>
								<option value='cat'>قط</option>
								<option value='bird'>طائر</option>
								<option value='turtle'>سلحفاة</option>
								<option value='monkey'>قرد</option>
								<option value='hamster'>هامستر</option>
								<option value='fish'>سمكة</option>
							</Select>
							<Input
								placeholder='السلالة'
								value={newPet.breed}
								onChange={(e) =>
									setNewPet({ ...newPet, breed: e.target.value })
								}
							/>
							<Select
								placeholder='الجنس'
								value={newPet.gender}
								iconColor='transparent'
								cursor={"pointer"}
								onChange={(e) =>
									setNewPet({ ...newPet, gender: e.target.value })
								}
							>
								<option value='male'>ذكر</option>
								<option value='female'>أنثى</option>
							</Select>
							<Input
								placeholder='الوزن (كجم)'
								type='number'
								value={newPet.weight}
								onChange={(e) =>
									setNewPet({ ...newPet, weight: e.target.value })
								}
							/>
							<Input
								type='date'
								placeholder='تاريخ الميلاد'
								value={newPet.dob}
								onChange={(e) => setNewPet({ ...newPet, dob: e.target.value })}
							/>
						</SimpleGrid>

						<Flex justifyContent='center'>
							<Button
								colorScheme='green'
								onClick={handleCreatePet}
								isLoading={isLoading}
								isDisabled={isLoading}
							>
								إضافة الحيوان
							</Button>
						</Flex>
					</Box>
				</Flex>

				<Box mb={12}>
					<Text fontSize='lg' fontWeight='semibold' mb={4}>
						معلومات الحيوانات
					</Text>

					<Box bg={boxColor} rounded='xl' boxShadow='md' p={4}>
						{owner?.pets?.length > 0 ? (
							<>
								<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
									{owner.pets.map((pet, i) => (
										<Box
											key={i}
											p={4}
											display='flex'
											justifyContent='space-between'
											alignItems='flex-start'
											border='1px solid'
											borderColor={borderColor}
											borderRadius='md'
											bg={cardBg}
											boxShadow='sm'
										>
											<Box flex='1' pr={4}>
												<Text fontWeight='bold' mb={1}>
													🐾 {pet?.name}
												</Text>
												<Text>
													<strong>نوع الحيوان:</strong>{" "}
													{titleCase(pet?.type) || "—"}
												</Text>
												<Text>
													<strong>السلالة:</strong>{" "}
													{titleCase(pet?.breed) || "—"}
												</Text>
												<Text>
													<strong>الجنس:</strong>{" "}
													{pet?.gender === "male" ? "ذكر" : "أنثى"}
												</Text>
												<Text>
													<strong>تاريخ الميلاد:</strong>{" "}
													{formatDate(pet?.dob) || "—"}
												</Text>
												<Text>
													<strong>الوزن:</strong> {`${pet?.weight} كجم` || "—"}
												</Text>
											</Box>

											<Flex direction='column' align='center' gap={2}>
												<Button
													colorScheme='blue'
													// variant='outline'
													size='sm'
													isLoading={isLoading}
													isDisabled={isLoading}
													onClick={() => {
														navigate(`/pet-details/${pet._id}`);
													}}
													leftIcon={<Icon as={IoMdEye} />}
												>
													عرض الحيوان
												</Button>
												<Button
													colorScheme='red'
													variant='ghost'
													size='sm'
													isLoading={isLoading}
													isDisabled={isLoading}
													onClick={() => {
														handleRemovePet(pet._id);
													}}
													leftIcon={<Icon as={TbTrashXFilled} />}
												>
													حذف الحيوان
												</Button>
											</Flex>
										</Box>
									))}
								</SimpleGrid>
							</>
						) : (
							<Text textAlign='center' color='gray.500'>
								لا توجد معلومات عن الحيوانات بعد. يمكنك إضافة حيوانات جديدة من
								خلال زر "إضافة حيوان" أدناه.
							</Text>
						)}
					</Box>
				</Box>

				<Modal isOpen={isEditOpen} onClose={closeEditModal}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>تعديل بيانات المالك</ModalHeader>
						<ModalBody>
							<Input
								placeholder='الاسم الكامل'
								value={updatedOwner.fullName}
								onChange={(e) =>
									setUpdatedOwner({ ...updatedOwner, fullName: e.target.value })
								}
								mb={3}
							/>
							<Select
								placeholder='الجنس'
								value={updatedOwner.gender}
								iconColor='transparent'
								cursor={"pointer"}
								onChange={(e) =>
									setUpdatedOwner({ ...updatedOwner, gender: e.target.value })
								}
								mb={3}
							>
								<option value='male'>ذكر</option>
								<option value='female'>أنثى</option>
							</Select>
							<Input
								placeholder='رقم الهاتف'
								value={updatedOwner.mobileNumber}
								onChange={(e) =>
									setUpdatedOwner({
										...updatedOwner,
										mobileNumber: e.target.value,
									})
								}
								mb={3}
							/>
							<Select
								placeholder='طريقة التواصل المفضلة'
								value={updatedOwner.preferredContactMethod}
								iconColor='transparent'
								cursor={"pointer"}
								onChange={(e) =>
									setUpdatedOwner({
										...updatedOwner,
										preferredContactMethod: e.target.value,
									})
								}
							>
								<option value='phone'>الهاتف</option>
								<option value='email'>البريد الإلكتروني</option>
								<option value='both'>الاثنين</option>
								<option value='neither'>لا تواصل</option>
							</Select>
						</ModalBody>
						<ModalFooter>
							<Button
								colorScheme='blue'
								onClick={handleUpdateOwner}
								isLoading={isLoading}
							>
								حفظ التغييرات
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</Box>
		</>
	);
}
