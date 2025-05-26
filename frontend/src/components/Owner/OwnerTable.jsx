// React Imports
import React from "react";
import { useNavigate } from "react-router-dom";

// Chakra UI Imports
import {
	Box,
	Button,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";

// React Icon Imports
import { IoMdEye, IoMdArrowRoundBack } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";

function titleCase(str) {
	if (!str) return "";
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

export default function OwnerTable() {
	const navigate = useNavigate();
	const data = sessionStorage.getItem("ownerFilterData");

	const bg = useColorModeValue("gray.50", "gray.800");
	const cardBg = useColorModeValue("white", "gray.700");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const textColor = useColorModeValue("gray.800", "gray.100");
	const rowBg = useColorModeValue("gray.100", "gray.700");

	const owners = JSON.parse(data) || [];

	return (
		<>
			<Box dir='rtl' bg={bg} px={6} py={10}>
				<Text
					fontSize='2xl'
					fontWeight='bold'
					textAlign='center'
					mb={2}
					textDecoration='underline'
					color={textColor}
				>
					المالكين اللي تم العثور عليهم
				</Text>

				<Text textAlign='center' color='gray.500' fontSize='sm' mb={6}>
					عدد النتائج: {owners.length}
				</Text>

				<Box
					rounded='lg'
					bg={cardBg}
					boxShadow='sm'
					p={5}
					maxW='95%'
					mx='auto'
					overflow='auto'
					border='1px solid'
					borderColor={borderColor}
				>
					<Table variant='simple' size='md'>
						<Thead
							bg={useColorModeValue("gray.100", "gray.600")}
							position='sticky'
							top={0}
							zIndex={1}
						>
							<Tr>
								<Th textAlign='center'>الاسم الكامل</Th>
								<Th textAlign='center'>البريد الإلكتروني</Th>
								<Th textAlign='center'>رقم الموبايل</Th>
								<Th textAlign='center'>عرض التفاصيل</Th>
							</Tr>
						</Thead>
						<Tbody>
							{owners.map((row) => (
								<Tr
									key={row._id}
									_hover={{ bg: rowBg }}
									transition='background-color 0.2s'
								>
									<Td textAlign='center'>{titleCase(row.fullName)}</Td>
									<Td textAlign='center'>{row.email}</Td>
									<Td textAlign='center'>{row.mobileNumber}</Td>

									<Td textAlign='center'>
										<Button
											size='sm'
											colorScheme='blue'
											rightIcon={<IoMdEye />}
											onClick={() => navigate(`/owner-details/${row._id}`)}
											_active={{ transform: "scale(0.98)", opacity: 0.7 }}
										>
											عرض
										</Button>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>

				<Box mt={10} textAlign='center' color='gray.500'>
					<Text mb={1}>🔍 تمت عملية البحث بنجاح</Text>
					<Text fontSize='sm'>
						يمكنك الآن استعراض التفاصيل أو العودة للبحث من جديد
					</Text>
				</Box>
			</Box>

			<Box
				mt={10}
				p={6}
				rounded='lg'
				bg={useColorModeValue("gray.100", "gray.700")}
				textAlign='center'
				boxShadow='md'
			>
				<Text fontSize='lg' mb={3}>
					لم تجد المالك الذي تبحث عنه؟
				</Text>
				<Button
					colorScheme='green'
					onClick={() => navigate("/add-owner")}
					leftIcon={<IoMdAdd />}
				>
					إنشاء مالك جديد
				</Button>
			</Box>

			<Box mt={8} display='flex' justifyContent='center'>
				<Button
					width={["90%", "60%", "40%", "25vw"]}
					rightIcon={<IoMdArrowRoundBack />}
					onClick={() => {
						sessionStorage.removeItem("ownerFilterData");
						navigate(-1);
					}}
					_active={{ transform: "scale(0.97)", opacity: 0.8 }}
				>
					الرجوع لصفحة البحث
				</Button>
			</Box>
		</>
	);
}
