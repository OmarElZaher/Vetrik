// React Imports
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import { Box, Button, Icon, Text, useToast } from "@chakra-ui/react";

// React Icons Imports
import { IoMdHome } from "react-icons/io";

// Custom Component Imports
import AdminHeader from "../Admin/General/AdminHeader";
import Footer from "./Footer";
import Header from "./Header";
import Spinner from "./Spinner";

export default function NotFound() {
	const navigate = useNavigate();
	const toast = useToast();

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${api}/user/getUserInfo`, {
					withCredentials: true,
				});

				if (response.status === 200) {
					setIsAdmin(response.data.role === "admin");
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
		fetchData();
	}, [toast]);

	return isLoading ? (
		<Spinner />
	) : (
		<>
			{isAdmin ? <AdminHeader /> : <Header />}
			<Box
				dir='rtl'
				display={"flex"}
				flexDirection={"column"}
				justifyContent={"center"}
				alignItems={"center"}
				bg={"#F3F3F3"}
				height={"87vh"}
			>
				<Text fontWeight={"bold"} fontSize={"60px"} color={"red"}>
					ERROR
				</Text>
				<Text fontSize={"40px"} textDecoration={"underline"}>
					الصفحة مش موجودة
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
						localStorage.getItem("userRole") === "admin"
							? navigate("/admin")
							: localStorage.getItem("userRole") === "vet"
							? navigate("/vet")
							: navigate("/secretary");
					}}
					leftIcon={<Icon as={IoMdHome} />}
					bg={"#FFF"}
					width={"25vw"}
					mt={10}
				>
					الصفحة الرئيسية
				</Button>
			</Box>
			<Footer />
		</>
	);
}
