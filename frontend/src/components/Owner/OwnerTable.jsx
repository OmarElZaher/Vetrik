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
} from "@chakra-ui/react";

// React Icon Imports
import { IoMdEye, IoMdArrowRoundBack } from "react-icons/io";

// Custom Component Imports
import Footer from "../General/Footer";

function titleCase(str) {
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
	const data = localStorage.getItem("ownerFilterData");

	if (data === null) {
		return (
			<>
				<Box
					display={"flex"}
					flexDirection={"column"}
					justifyContent={"center"}
					alignItems={"center"}
					height={"100vh"}
				>
					<Text fontWeight={"bold"} fontSize={"60px"} color={"red"}>
						NOT FOUND
					</Text>
					<Text fontSize={"25px"} textDecoration={"underline"}>
						من فضلك ابحث عن المالك قبل الدخول للصفحة دي
					</Text>
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
						onClick={() => {
							navigate("/search-owner");
						}}
						leftIcon={<IoMdArrowRoundBack />}
						width={"25vw"}
						mt={10}
					>
						الرجوع لصفحة البحث
					</Button>
				</Box>
			</>
		);
	} else {
		return (
			<>
				<Box width={"100%"} height={"87vh"}>
					<Box
						display={"flex"}
						flexDirection={"column"}
						justifyContent={"center"}
						alignItems={"center"}
						height={"15%"}
						my={5}
					>
						<Text
							fontSize={"35px"}
							color={"#121211"}
							fontWeight={500}
							textDecoration={"underline"}
						>
							المالكين اللي تم العثور عليهم
						</Text>
					</Box>
					<Box
						display={"flex"}
						flexDirection={"column"}
						justifyContent={"center"}
						alignItems={"center"}
						width={"100%"}
						height={"70%"}
					>
						<TableContainer width={"80%"} maxHeight={"70vh"} overflowY={"auto"}>
							<Table variant='simple' size='md'>
								<Thead>
									<Tr>
										<Th textAlign={"left"}>الاسم الكامل</Th>
										<Th textAlign={"center"}>البريد الإلكتروني</Th>
										<Th textAlign={"center"}>رقم الموبايل</Th>
										<Th textAlign={"right"}>عرض التفاصيل</Th>
									</Tr>
								</Thead>
								<Tbody>
									{JSON.parse(data).map((row) => (
										<Tr key={data._id}>
											<Td textAlign={"left"}>{`${titleCase(
												row.firstName
											)} ${titleCase(row.lastName)}`}</Td>
											<Td textAlign={"center"}>{row.email}</Td>
											<Td textAlign={"center"}>{row.mobileNumber}</Td>
											<Td textAlign={"right"}>
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
													onClick={() => {
														navigate(`/owner-details/${row._id}`);
													}}
													leftIcon={<IoMdEye />}
												>
													عرض
												</Button>
											</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						</TableContainer>
					</Box>
					<Box
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
							onClick={() => {
								localStorage.removeItem("ownerFilterData");
								navigate("/search-owner");
							}}
							leftIcon={<IoMdArrowRoundBack />}
							width={"25vw"}
						>
							الرجوع لصفحة البحث
						</Button>
					</Box>
				</Box>
				<Footer />
			</>
		);
	}
}
