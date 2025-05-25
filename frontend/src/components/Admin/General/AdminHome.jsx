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
} from "@chakra-ui/react";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

export default function AdminHome() {
	const bg = useColorModeValue("gray.50", "gray.800");
	const cardBg = useColorModeValue("white", "gray.700");
	const boxBg = useColorModeValue("gray.100", "gray.700");
	const toast = useToast();

	const [staff, setStaff] = useState([
		{ id: 1, name: "د. أحمد", email: "ahmed@vet.com", role: "vet" },
		{ id: 2, name: "سارة", email: "sara@clinic.com", role: "secretary" },
	]);

	const [newUser, setNewUser] = useState({
		username: "",
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "",
	});

	const [isLoading, setIsLoading] = useState(false);

	const [adminStats, setAdminStats] = useState(null);

	// const chart = useChart({
	// 	data: [
	// 		{ label: "مكتملة", value: adminStats?.totalCompletedCases || 0 },
	// 		{ label: "جارية", value: adminStats?.totalAssignedCases || 0 },
	// 		{ label: "منتظرة", value: adminStats?.totalPendingCases || 0 },
	// 		{ label: "مغلقة", value: adminStats?.totalClosedCases || 0 },
	// 	],
	// 	series: [{ name: "allocation", color: "teal.solid" }],
	// });

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
	}, [toast]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setIsLoading(true);
				const response = await axios.post(
					`${api}/user/getUsers`,
					{}, // optionally send filters like { fullName: 'Ali' }
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
	}, [toast]);

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
				// Optional: push to staff list or refresh
				setNewUser({
					username: "",
					firstName: "",
					lastName: "",
					email: "",
					password: "",
					confirmPassword: "",
					role: "",
				});
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
							{/* <Chart.Root maxH='sm' chart={chart}>
								<BarChart data={chart.data} barSize={40}>
									<CartesianGrid
										stroke={chart.color("border.muted")}
										vertical={false}
									/>
									<XAxis
										axisLine={false}
										tickLine={false}
										dataKey={chart.key("type")}
									/>
									<YAxis
										axisLine={false}
										tickLine={false}
										domain={[0, 100]}
										tickFormatter={(value) => `${value}%`}
									/>
									{chart.series.map((item) => (
										<Bar
											key={item.name}
											isAnimationActive={false}
											dataKey={chart.key(item.name)}
											fill={chart.color(item.color)}
											radius={10}
										/>
									))}
								</BarChart>
							</Chart.Root> */}
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
									<Th>الاسم</Th>
									<Th>البريد الإلكتروني</Th>
									<Th>الدور</Th>
									<Th>إجراءات</Th>
								</Tr>
							</Thead>
							<Tbody>
								{staff.map((user) => (
									<Tr key={user._id}>
										<Td>{`${user.firstName} ${user.lastName}`}</Td>
										<Td>{user.email}</Td>
										<Td>
											{user.role === "admin"
												? "أدمن"
												: user.role === "vet"
												? "طبيب"
												: "سكرتير"}
										</Td>
										<Td>
											<Flex
												direction={{ base: "column", sm: "row" }}
												gap={2}
												align='flex-start'
											>
												<IconButton
													icon={<MdEdit />}
													size='sm'
													colorScheme='blue'
													aria-label='تعديل'
													onClick={() => {
														// edit logic
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
							value={newUser.username}
							onChange={(e) =>
								setNewUser({ ...newUser, username: e.target.value })
							}
						/>
						<Input
							placeholder='البريد الإلكتروني'
							type='email'
							value={newUser.email}
							onChange={(e) =>
								setNewUser({ ...newUser, email: e.target.value })
							}
						/>
						<Input
							placeholder='الاسم الأول'
							value={newUser.firstName}
							onChange={(e) =>
								setNewUser({ ...newUser, firstName: e.target.value })
							}
						/>
						<Input
							placeholder='الاسم الأخير'
							value={newUser.lastName}
							onChange={(e) =>
								setNewUser({ ...newUser, lastName: e.target.value })
							}
						/>
						<Input
							placeholder='كلمة المرور'
							type='password'
							value={newUser.password}
							onChange={(e) =>
								setNewUser({ ...newUser, password: e.target.value })
							}
						/>
						<Input
							placeholder='تأكيد كلمة المرور'
							type='password'
							value={newUser.confirmPassword}
							onChange={(e) =>
								setNewUser({ ...newUser, confirmPassword: e.target.value })
							}
						/>
					</SimpleGrid>

					<Select
						mt={4}
						placeholder='اختر الدور'
						value={newUser.role}
						onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
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
		</Box>
	);
}
