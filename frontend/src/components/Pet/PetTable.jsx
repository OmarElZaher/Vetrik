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

// React Icons Imports
import { IoMdEye, IoMdArrowRoundBack } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";

// Component Imports
import Footer from "../General/Footer";

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

export default function PetTable() {
	const navigate = useNavigate();
	const data = localStorage.getItem("petFilterData");

	const bg = useColorModeValue("gray.50", "gray.800");
	const cardBg = useColorModeValue("white", "gray.700");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const textColor = useColorModeValue("gray.800", "gray.100");
	const rowBg = useColorModeValue("gray.100", "gray.700");

	const pets = JSON.parse(data) || [];

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
					الحيوانات اللي تم العثور عليها
				</Text>

				<Text textAlign='center' color='gray.500' fontSize='sm' mb={6}>
					عدد النتائج: {pets.length}
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
								<Th textAlign='center'>اسم الحيوان</Th>
								<Th textAlign='center'>النوع</Th>
								<Th textAlign='center'>السلالة</Th>
								<Th textAlign='center'>الجنس</Th>
								<Th textAlign='center'>تاريخ الميلاد</Th>
								<Th textAlign='center'>عرض التفاصيل</Th>
							</Tr>
						</Thead>
						<Tbody>
							{pets.map((row) => (
								<Tr
									key={row._id}
									_hover={{ bg: rowBg }}
									transition='background-color 0.2s'
								>
									<Td textAlign='center'>{titleCase(row.name)}</Td>
									<Td textAlign='center'>{titleCase(row.type)}</Td>
									<Td textAlign='center'>{titleCase(row.breed)}</Td>
									<Td textAlign='center'>
										{row.gender === "male"
											? "ذكر"
											: row.gender === "female"
											? "أنثى"
											: ""}
									</Td>
									<Td textAlign='center'>
										{row.dob
											? new Date(row.dob).toLocaleDateString("ar-EG")
											: "—"}
									</Td>
									<Td textAlign='center'>
										<Button
											size='sm'
											colorScheme='blue'
											rightIcon={<IoMdEye />}
											onClick={() => navigate(`/pet-details/${row._id}`)}
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
					لم تجد الحيوان الذي تبحث عنه؟
				</Text>
				<Button
					colorScheme='green'
					onClick={() => navigate("/add-pet")}
					leftIcon={<IoMdAdd />}
				>
					إضافة حيوان جديد
				</Button>
			</Box>

			<Box mt={8} display='flex' justifyContent='center'>
				<Button
					width={["90%", "60%", "40%", "25vw"]}
					rightIcon={<IoMdArrowRoundBack />}
					onClick={() => {
						sessionStorage.removeItem("petFilterData");
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
