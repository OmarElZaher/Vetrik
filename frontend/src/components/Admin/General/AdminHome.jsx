import React, { useEffect, useState } from "react";

import axios from "axios";

import { API_URL as api } from "../../../utils/constants";

import {
	Box,
	Text,
	Card,
	CardBody,
	Icon,
	Button,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Select,
	Input,
	Flex,
	IconButton,
	SimpleGrid,
	useToast,
	useColorModeValue,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	useDisclosure,
} from "@chakra-ui/react";

import {
	FaUser,
	FaUsers,
	FaDog,
	FaClipboardList,
	FaCheckCircle,
	FaHourglassHalf,
	FaSpinner,
	FaTimesCircle,
} from "react-icons/fa";

import { MdDelete, MdEdit } from "react-icons/md";
import Spinner from "../../General/Spinner";

function titleCase(str) {
	if (!str || typeof str !== "string") return "";
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export default function AdminHome() {
	const bg = useColorModeValue("gray.50", "gray.800");
	const cardBg = useColorModeValue("white", "gray.700");
	const boxBg = useColorModeValue("gray.100", "gray.800");
	const rowBg = useColorModeValue("blue.50", "blue.500");
	const toast = useToast();

	const [staff, setStaff] = useState([]);

	const [newUser, setNewUser] = useState({
		username: "",
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "",
	});

	const [reloadUsers, setReloadUsers] = useState(0);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [editingUser, setEditingUser] = useState(null);
	const [editRole, setEditRole] = useState("");

	const [isLoading, setIsLoading] = useState(false);

	const [adminStats, setAdminStats] = useState(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const res = await axios.get(`${api}/user/stats`, {
					withCredentials: true,
				});
				if (res.status === 200) setAdminStats(res.data);
			} catch (err) {
				toast({
					title: err?.response?.data?.message || "حدث خطأ أثناء جلب الإحصائيات",
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			}
		};
		fetchStats();
	}, [toast, reloadUsers]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setIsLoading(true);
				const response = await axios.post(
					`${api}/user/getUsers`,
					{},
					{ withCredentials: true }
				);
				if (response.status === 200) {
					setStaff(response.data.users);
				}
			} catch (error) {
				toast({
					title:
						error?.response?.data?.message || "حدث خطأ أثناء جلب المستخدمين",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "top",
				});
			} finally {
				setIsLoading(false);
			}
		};
		fetchUsers();
	}, [toast, reloadUsers]);

	const handleCreateUser = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(`${api}/user/createUser`, newUser, {
				withCredentials: true,
			});
			if (response.status === 200) {
				toast({
					title: "تم إنشاء المستخدم بنجاح",
					status: "success",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
				setNewUser({
					username: "",
					firstName: "",
					lastName: "",
					email: "",
					password: "",
					confirmPassword: "",
					role: "",
				});
				setReloadUsers((prev) => prev + 1);
			}
		} catch (error) {
			toast({
				title: error?.response?.data?.message || "فشل إنشاء المستخدم",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteUser = async (userId) => {
		const confirm = window.confirm("هل أنت متأكد من حذف هذا المستخدم؟");
		if (!confirm) return;

		try {
			setIsLoading(true);
			const response = await axios.delete(`${api}/user/deleteUser/${userId}`, {
				withCredentials: true,
			});
			if (response.status === 200) {
				toast({
					title: "تم حذف المستخدم بنجاح",
					status: "success",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
				setStaff((prev) => prev.filter((u) => u._id !== userId));
				setReloadUsers((prev) => prev - 1);
			}
		} catch (error) {
			toast({
				title: error?.response?.data?.message || "فشل حذف المستخدم",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleEditUser = async () => {
		if (editRole === "admin") {
			const confirm = window.confirm(
				"هل أنت متأكد من تعيين هذا المستخدم كأدمن؟"
			);

			if (!confirm) return;
		}

		try {
			setIsLoading(true);
			await axios.patch(
				editRole === "admin"
					? `${api}/user/setAdmin/${editingUser._id}`
					: editRole === "vet"
					? `${api}/user/setVet/${editingUser._id}`
					: `${api}/user/setSecretary/${editingUser._id}`,
				{},
				{ withCredentials: true }
			);
			toast({
				title: "تم تحديث دور المستخدم بنجاح",
				status: "success",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
			setEditingUser(null);
			setEditRole("");
			setReloadUsers((prev) => prev + 1); // Refresh users!
			onClose();
		} catch (error) {
			toast({
				title: error?.response?.data?.message || "فشل تحديث الدور",
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
		<Box p={{ base: 4, md: 6 }} bg={bg} minH='100vh'>
			<Text fontSize='3xl' fontWeight='bold' textAlign='center' mb={8}>
				🛠️ لوحة تحكم المدير
			</Text>

			{/* 📊 Admin Stats */}
			{adminStats && (
				<>
					<Card mb={10} boxShadow='md' bg={cardBg}>
						<CardBody>
							<Text fontSize='xl' fontWeight='bold' mb={6}>
								📈 إحصائيات النظام
							</Text>

							<SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
								{[
									{
										icon: FaUsers,
										label: "إجمالي المستخدمين",
										value: adminStats.totalUsers,
										color: "blue.400",
									},
									{
										icon: FaUser,
										label: "المالكين",
										value: adminStats.totalOwners,
										color: "teal.400",
									},
									{
										icon: FaDog,
										label: "الحيوانات",
										value: adminStats.totalPets,
										color: "green.400",
									},
									{
										icon: FaClipboardList,
										label: "إجمالي الحالات",
										value: adminStats.totalCases,
										color: "orange.400",
									},
									{
										icon: FaHourglassHalf,
										label: "الحالات المنتظرة",
										value: adminStats.totalPendingCases,
										color: "yellow.500",
									},
									{
										icon: FaSpinner,
										label: "الحالات الجارية",
										value: adminStats.totalAssignedCases,
										color: "blue.500",
									},
									{
										icon: FaCheckCircle,
										label: "الحالات المكتملة",
										value: adminStats.totalCompletedCases,
										color: "green.500",
									},
									{
										icon: FaTimesCircle,
										label: "الحالات المغلقة",
										value: adminStats.totalClosedCases,
										color: "red.400",
									},
								].map((stat, i) => (
									<Flex
										key={i}
										align='center'
										bg={boxBg}
										rounded='lg'
										p={4}
										gap={4}
										boxShadow='sm'
										transition='0.2s'
										_hover={{ transform: "scale(1.02)", boxShadow: "md" }}
									>
										<Icon as={stat.icon} boxSize={5} />

										<Box>
											<Text fontSize='sm' color='gray.600' fontWeight='medium'>
												{stat.label}
											</Text>
											<Text fontSize='2xl' fontWeight='bold' color={stat.color}>
												{stat.value}
											</Text>
										</Box>
									</Flex>
								))}
							</SimpleGrid>
						</CardBody>
					</Card>

					<Card mb={10} boxShadow='md' bg={cardBg}>
						<CardBody
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
							alignItems={"center"}
						>
							<Text fontSize='xl' fontWeight='bold' mb={4}>
								📊 توزيع الحالات
							</Text>
						</CardBody>
					</Card>
				</>
			)}

			{/* 👥 Staff Table */}
			<Card mb={10} boxShadow='md' bg={cardBg}>
				<CardBody>
					<Text fontSize='xl' fontWeight='bold' mb={4}>
						👥 إدارة الموظفين
					</Text>
					<Box overflowX='auto'>
						<Table variant='simple' size='sm' minW='600px'>
							<Thead>
								<Tr>
									<Th textAlign={"center"}>الاسم</Th>
									<Th textAlign={"center"}>البريد الإلكتروني</Th>
									<Th textAlign={"center"}>الدور</Th>
									<Th textAlign={"center"}>إجراءات</Th>
								</Tr>
							</Thead>
							<Tbody>
								{staff.map((user) => (
									<Tr key={user._id} _hover={{ bg: rowBg }}>
										<Td textAlign={"center"}>{`${titleCase(
											user.firstName
										)} ${titleCase(user.lastName)}`}</Td>
										<Td textAlign={"center"}>{user.email}</Td>
										<Td textAlign={"center"}>
											{user.role === "admin"
												? "أدمن"
												: user.role === "vet"
												? "طبيب"
												: "سكرتير"}
										</Td>
										<Td textAlign={"center"}>
											<Flex
												direction={{ base: "column", sm: "row" }}
												gap={2}
												display={"flex"}
												justifyContent={"center"}
												alignItems={"center"}
											>
												<IconButton
													icon={<MdEdit />}
													size='sm'
													colorScheme='blue'
													aria-label='تعديل'
													onClick={() => {
														setEditingUser(user);
														setEditRole(user.role);
														onOpen();
													}}
												/>
												<IconButton
													icon={<MdDelete />}
													size='sm'
													colorScheme='red'
													aria-label='حذف'
													onClick={() => handleDeleteUser(user._id)}
												/>
											</Flex>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>
				</CardBody>
			</Card>

			{/* ➕ Add User */}
			<Card mb={10} boxShadow='md' bg={cardBg}>
				<CardBody>
					<Text fontWeight='bold' fontSize='lg' mb={4}>
						➕ إنشاء مستخدم جديد
					</Text>

					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
						<Input
							placeholder='اسم المستخدم'
							type='username'
							value={newUser.username}
							onChange={(e) =>
								setNewUser({ ...newUser, username: e.target.value })
							}
							bg={boxBg}
							_hover={{
								transform: "scale(1.01)",
								boxShadow: "md",
							}}
							_focus={{
								borderColor: "blue.400",
								boxShadow: "0 0 0 1px blue.400",
								transform: "scale(1.02)",
							}}
							transition='0.2s'
						/>
						<Input
							placeholder='البريد الإلكتروني'
							type='email'
							value={newUser.email}
							onChange={(e) =>
								setNewUser({ ...newUser, email: e.target.value })
							}
							bg={boxBg}
							_hover={{
								transform: "scale(1.01)",
								boxShadow: "md",
							}}
							_focus={{
								borderColor: "blue.400",
								boxShadow: "0 0 0 1px blue.400",
								transform: "scale(1.02)",
							}}
							transition='0.2s'
						/>
						<Input
							placeholder='الاسم الأول'
							type='text'
							value={newUser.firstName}
							onChange={(e) =>
								setNewUser({ ...newUser, firstName: e.target.value })
							}
							bg={boxBg}
							_hover={{
								transform: "scale(1.01)",
								boxShadow: "md",
							}}
							_focus={{
								borderColor: "blue.400",
								boxShadow: "0 0 0 1px blue.400",
								transform: "scale(1.02)",
							}}
							transition='0.2s'
						/>
						<Input
							placeholder='الاسم الأخير'
							type='text'
							value={newUser.lastName}
							onChange={(e) =>
								setNewUser({ ...newUser, lastName: e.target.value })
							}
							bg={boxBg}
							_hover={{
								transform: "scale(1.01)",
								boxShadow: "md",
							}}
							_focus={{
								borderColor: "blue.400",
								boxShadow: "0 0 0 1px blue.400",
								transform: "scale(1.02)",
							}}
							transition='0.2s'
						/>
						<Input
							placeholder='كلمة المرور'
							type='password'
							value={newUser.password}
							onChange={(e) =>
								setNewUser({ ...newUser, password: e.target.value })
							}
							bg={boxBg}
							_hover={{
								transform: "scale(1.01)",
								boxShadow: "md",
							}}
							_focus={{
								borderColor: "blue.400",
								boxShadow: "0 0 0 1px blue.400",
								transform: "scale(1.02)",
							}}
							transition='0.2s'
						/>
						<Input
							placeholder='تأكيد كلمة المرور'
							type='password'
							value={newUser.confirmPassword}
							onChange={(e) =>
								setNewUser({ ...newUser, confirmPassword: e.target.value })
							}
							bg={boxBg}
							_hover={{
								transform: "scale(1.01)",
								boxShadow: "md",
							}}
							_focus={{
								borderColor: "blue.400",
								boxShadow: "0 0 0 1px blue.400",
								transform: "scale(1.02)",
							}}
							transition='0.2s'
						/>
					</SimpleGrid>

					<Select
						mt={4}
						placeholder='اختر الدور'
						value={newUser.role}
						onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
						w={["100%", "100%", "50%"]}
						cursor={"pointer"}
						bg={boxBg}
						_hover={{
							transform: "scale(1.01)",
							boxShadow: "md",
						}}
						_focus={{
							borderColor: "blue.400",
							boxShadow: "0 0 0 1px blue.400",
							transform: "scale(1.02)",
						}}
						transition='0.2s'
					>
						<option value='vet'>طبيب</option>
						<option value='secretary'>سكرتير</option>
						<option value='admin'>أدمن</option>
					</Select>

					<Button mt={4} colorScheme='green' onClick={handleCreateUser}>
						إنشاء المستخدم
					</Button>
				</CardBody>
			</Card>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>تعديل دور المستخدم</ModalHeader>
					<ModalBody>
						<Text mb={2}>
							{editingUser &&
								`${titleCase(editingUser.firstName)} ${titleCase(
									editingUser.lastName
								)}`}
						</Text>
						<Select
							value={editRole}
							onChange={(e) => setEditRole(e.target.value)}
							placeholder='اختر الدور'
							iconColor='transparent'
							cursor={"pointer"}
						>
							<option value='vet'>طبيب</option>
							<option value='secretary'>سكرتير</option>
							<option value='admin'>أدمن</option>
						</Select>
					</ModalBody>
					<ModalFooter>
						<Button variant='ghost' ml={3} onClick={onClose}>
							إلغاء
						</Button>
						<Button
							colorScheme='blue'
							onClick={() => {
								handleEditUser();
							}}
							isLoading={isLoading}
							disabled={!editRole || !editingUser}
						>
							حفظ التغييرات
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
}
