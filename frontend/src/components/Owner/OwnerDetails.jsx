import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, useToast } from "@chakra-ui/react";

import Spinner from "../General/Spinner";
import axios from "axios";

export default async function OwnerDetails() {
	const ownerId = localStorage.getItem("ownerId");
	const navigate = useNavigate();
	const toast = useToast();
	const [isLoading, setIsLoading] = useState(true);

	if (ownerId == null) {
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
		try {
			const response = await axios.get(
				`http://localhost:1234/getOwnerInfo/${ownerId}`,
				{
					withCredentials: true,
				}
			);
			console.log(response.data);
		} catch (error) {
			toast({
				title: error.response.data.message,
				status: "error",
				duration: 2500,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}

		return isLoading ? <Spinner /> : <></>;
	}
}
