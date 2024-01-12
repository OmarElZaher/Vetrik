import React, { useState } from "react";
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
	TableCaption,
	TableContainer,
	Text,
} from "@chakra-ui/react";

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
						ERROR 404 NOT FOUND
					</Text>
					<Text fontSize={"25px"} textDecoration={"underline"}>
						Please Search For An Owner Before Accessing This Page
					</Text>
					<Button
						onClick={() => {
							navigate("/search-owner");
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
				<Box
					display={"flex"}
					flexDirection={"column"}
					justifyContent={"center"}
					alignItems={"center"}
					width={"100%"}
					height={"100vh"}
				>
					<TableContainer width={"80%"}>
						<Table variant='simple'>
							<Thead>
								<Tr>
									<Th>Full Name</Th>
									<Th>Email</Th>
									<Th>Mobile Number</Th>
									<Th>View Details</Th>
								</Tr>
							</Thead>
							<Tbody>
								{JSON.parse(data).map((row) => (
									<Tr key={data._id}>
										<Td>{`${titleCase(row.firstName)} ${titleCase(
											row.lastName
										)}`}</Td>
										<Td>{row.email}</Td>
										<Td>{row.mobileNumber}</Td>
										<Td>
											<Button
												onClick={() => {
													localStorage.setItem("ownerId", row._id);
													navigate("/owner-details");
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
											>
												View
											</Button>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</TableContainer>
					<Button
						onClick={() => {
							localStorage.removeItem("ownerFilterData");
							navigate("/search-owner");
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
						Back To Search
					</Button>
				</Box>
				<Footer />
			</>
		);
	}
}
