// React Imports
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import { Box, IconButton, useToast } from "@chakra-ui/react";

// React Icons Imports
import { IoMdLogOut } from "react-icons/io";

// Custom Component Imports
import VetDrawer from "./VetDrawer";
import SecretaryDrawer from "./SecretaryDrawer";
import Spinner from "./Spinner";

export default function Header() {
	const navigate = useNavigate();
	const toast = useToast();

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const [role] = useState(localStorage.getItem("userRole") || "user");

	const handleLogout = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/user/logout`,
				{},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				localStorage.clear();
				navigate("/login");
			}
		} catch (error) {
			if (error.response.data.message === "غير مسجل الدخول") {
				navigate("/login");
			} else {
				toast({
					title: error.response.data.message,
					status: "error",
					duration: 2000,
					position: "top",
					isClosable: true,
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${api}/user/getUserInfo`, {
					withCredentials: true,
				});

				if (response.status !== 200) {
					toast({
						title: response?.data?.message,
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
			} catch (error) {
				toast({
					title: error?.response?.data?.message,
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
		<Box
			as="nav"
			bg="#121211"
			width="100%"
			height="50px"
			position="sticky"
			top={0}
			color="#FFFFFF"
			zIndex={10}
		>
			<Box display="flex" justifyContent="center" alignItems="center">
				<Box
					width="33vw"
					height="50px"
					display="flex"
					justifyContent="flex-start"
					alignItems="center"
					key={1}
					fontSize="25px"
				>
					{role === "secretary" ? (
						<SecretaryDrawer />
					) : role === "vet" ? (
						<VetDrawer />
					) : null}
				</Box>
				<Box
					width="33vw"
					height="50px"
					display="flex"
					justifyContent="center"
					alignItems="center"
					key={2}
				>
					<Link
						to={
							role === "admin"
								? "/admin"
								: role === "vet"
								? "/vet"
								: "/secretary"
						}
					>
						Vetrik 🐾
					</Link>
				</Box>
				<Box
					width="33vw"
					height="50px"
					display="flex"
					justifyContent="flex-end"
					alignItems="center"
					key={3}
				>
					<IconButton
						as={IoMdLogOut}
						size={"sm"}
						bg="#121211"
						color="FFF"
						onClick={handleLogout}
						cursor={"pointer"}
						aria-label="تسجيل الخروج"
						_hover={{
							color: "#D4F500",
						}}
						_active={{
							opacity: "0.5",
						}}
						transition="all 0.05s ease"
					/>
				</Box>
			</Box>
		</Box>
	);
}
