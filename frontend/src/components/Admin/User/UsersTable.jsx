import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	Box,
	Button,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Text,
	useToast,
} from "@chakra-ui/react";

import { IoMdEye, IoMdArrowRoundBack } from "react-icons/io";

import Spinner from "../General/Spinner";
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

export default function UsersTable() {
	const navigate = useNavigate();
	const data = localStorage.getItem("usersFilterData");
	const toast = useToast();

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
						Please Search For A User Before Accessing This Page
					</Text>
					<Button
						onClick={() => {
							navigate("/admin/search-users");
						}}
						_hover={{
							bg: "yellowgreen",
							color: "#000",
							transform: "scale(1.01)",
						}}
						_active={{
							transform: "scale(0.99)",
							opacity: "0.5",
						}}
						mt={10}
						width={"25vw"}
					>
						Go Back To Search
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
						justifyContent={"center"}
						alignItems={"center"}
						flexDirection={"column"}
						my={5}
						height={"15%"}
					>
						<Text
							fontSize={"35px"}
							color={"#121211"}
							fontWeight={500}
							textDecoration={"underline"}
						>
							Users Found
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
										<Th textAlign={"left"}>Full Name</Th>
										<Th textAlign={"center"}>Username</Th>
										<Th textAlign={"center"}>Email</Th>
										<Th textAlign={"right"}>View Details</Th>
									</Tr>
								</Thead>
								<Tbody>
									{JSON.parse(data).map((row) => (
										<Tr key={data._id}>
											<Td textAlign={"left"}>{`${titleCase(
												row.firstName
											)} ${titleCase(row.lastName)}`}</Td>
											<Td textAlign={"center"}>{row.username}</Td>
											<Td textAlign={"center"}>{row.email}</Td>
											<Td textAlign={"right"}>
												<Button
													onClick={() => {
														navigate(`/admin/user-details/${row._id}`);
													}}
													_hover={{
														bg: "yellowgreen",
														color: "#000",
														transform: "scale(1.01)",
													}}
													_active={{
														transform: "scale(0.99)",
														opacity: "0.5",
													}}
													leftIcon={<IoMdEye />}
												>
													View
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
							onClick={() => {
								localStorage.removeItem("usersFilterData");
								navigate("/admin/search-users");
							}}
							_hover={{
								bg: "yellowgreen",
								color: "#000",
								transform: "scale(1.01)",
							}}
							_active={{
								transform: "scale(0.99)",
								opacity: "0.5",
							}}
							width={"25vw"}
							leftIcon={<IoMdArrowRoundBack />}
						>
							Back To Search
						</Button>
					</Box>
				</Box>
				<Footer />
			</>
		);
	}
}
