import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Icon, Text, useToast } from "@chakra-ui/react";

import { IoMdHome } from "react-icons/io";

import Footer from "./Footer";
import Header from "./Header";
import AdminHeader from "../Admin/General/AdminHeader";
import Spinner from "./Spinner";
import axios from "axios";

export default function NotFound() {
	const navigate = useNavigate();
	const toast = useToast();

	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(
				"http://localhost:1234/user/getUserInfo",
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				setIsAdmin(response.data.isAdmin);
			} else {
				toast({
					title: response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
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

	useEffect(() => {
		fetchData();
	}, []);

	return isLoading ? (
		<Spinner />
	) : (
		<>
			{isAdmin ? <AdminHeader /> : <Header />}
			<Box
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				flexDirection={"column"}
				height={"87vh"}
				bg={"#F3F3F3"}
			>
				<Text fontWeight={"bold"} fontSize={"60px"} color={"red"}>
					404 ERROR
				</Text>
				<Text fontSize={"40px"} textDecoration={"underline"}>
					PAGE NOT FOUND
				</Text>
				<Button
					onClick={() => {
						if (isAdmin) {
							navigate("/admin");
						} else {
							navigate("/");
						}
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
					bg={"#FFF"}
					mt={10}
					leftIcon={<Icon as={IoMdHome} />}
					width={"25vw"}
				>
					Home
				</Button>
			</Box>
			<Footer />
		</>
	);
}
