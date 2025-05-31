// React Imports
import React from "react";
import { useNavigate } from "react-router-dom";

// Chakra UI Imports
import {
	Box,
	Button,
	Table,
	TableContainer,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";

// React Icons Imports
import { IoMdEye, IoMdArrowRoundBack } from "react-icons/io";

function titleCase(str) {
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

export default function UsersTable() {
	const navigate = useNavigate();
	const data = localStorage.getItem("usersFilterData");

	// Color mode values
	const cardBg = useColorModeValue(
		"rgba(255,255,255,0.85)",
		"rgba(45,55,72,0.85)"
	);
	const pageBg = useColorModeValue("gray.50", "gray.900");
	const headingColor = useColorModeValue("#121211", "white");
	const rowHoverBg = useColorModeValue("blue.50", "gray.700");

	if (data === null) {
		return (
			<Box
				dir='rtl'
				display={"flex"}
				flexDirection={"column"}
				justifyContent={"center"}
				alignItems={"center"}
				minH='100vh'
				bg={pageBg}
			>
				<Text fontWeight={"bold"} fontSize={"60px"} color={"red"}>
					غير موجود
				</Text>
				<Text fontSize={"25px"} textDecoration={"underline"} mb={8}>
					من فضلك ابحث عن المستخدم قبل ما تدخل الصفحة دي
				</Text>
				<Button
					dir='rtl'
					colorScheme='blue'
					variant='solid'
					boxShadow='md'
					fontWeight='bold'
					fontSize='lg'
					px={8}
					py={6}
					borderRadius='lg'
					onClick={() => {
						navigate("/admin/search-users");
					}}
					leftIcon={<IoMdArrowRoundBack />}
					mt={4}
				>
					الرجوع لصفحة البحث
				</Button>
			</Box>
		);
	} else {
		return (
			<Box bg={pageBg} p={6}>
				<Box
					dir='rtl'
					bg={cardBg}
					boxShadow='md'
					rounded='xl'
					p={10}
					maxW='90vw'
					mx='auto'
					mt={8}
				>
					<Text
						fontSize={{ base: "2xl", md: "2.5xl", lg: "3xl" }}
						color={headingColor}
						fontWeight={700}
						textDecoration={"underline"}
						mb={8}
						textAlign='center'
					>
						المستخدمين اللي تم العثور عليهم
					</Text>
					<TableContainer
						width={{ base: "100%", md: "80%" }}
						maxHeight='70vh'
						overflowY='auto'
						mx='auto'
					>
						<Table variant='simple' size='md'>
							<Thead>
								<Tr>
									<Th textAlign={"left"}>الاسم الكامل</Th>
									<Th textAlign={"center"}>اسم المستخدم</Th>
									<Th textAlign={"center"}>البريد الإلكتروني</Th>
									<Th textAlign={"right"}>عرض التفاصيل</Th>
								</Tr>
							</Thead>
							<Tbody>
								{JSON.parse(data).map((row) => (
									<Tr key={row._id} _hover={{ bg: rowHoverBg }}>
										<Td textAlign={"left"}>{`${titleCase(
											row.firstName
										)} ${titleCase(row.lastName)}`}</Td>
										<Td textAlign={"center"}>{row.username}</Td>
										<Td textAlign={"center"}>{row.email}</Td>
										<Td textAlign={"right"}>
											<Button
												colorScheme='blue'
												variant='outline'
												fontWeight='bold'
												borderRadius='md'
												onClick={() => {
													navigate(`/admin/user-details/${row._id}`);
												}}
												rightIcon={<IoMdEye />}
											>
												عرض
											</Button>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</TableContainer>
					<Box
						display='flex'
						justifyContent='center'
						alignItems='center'
						mt={8}
					>
						<Button
							dir='rtl'
							colorScheme='blue'
							variant='solid'
							boxShadow='md'
							fontWeight='bold'
							fontSize='lg'
							px={8}
							py={6}
							borderRadius='lg'
							onClick={() => {
								localStorage.removeItem("usersFilterData");
								navigate("/admin/search-users");
							}}
							rightIcon={<IoMdArrowRoundBack />}
						>
							الرجوع لصفحة البحث
						</Button>
					</Box>
				</Box>
			</Box>
		);
	}
}
