// React Imports
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../../utils/constants";

// ChakraUI Imports
import { Box, IconButton, Icon, Tooltip, useToast } from "@chakra-ui/react";

// React Icons Imports
import { IoMdLogOut } from "react-icons/io";

// Custom Component Imports
import MyDrawerAdmin from "./MyDrawerAdmin";
import Spinner from "../../General/Spinner";

export default function AdminHeader() {
	const navigate = useNavigate();
	const toast = useToast();

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchRole = async () => {
			try {
				const response = await axios.get(`${api}/user/getUserInfo`, {
					withCredentials: true,
				});
				if (response.status === 200) {
					if (response.data.role !== "admin") {
						if (response.data.role === "vet") {
							navigate("/vet");
						}
						if (response.data.role === "secretary") {
							navigate("/secretary");
						}
					}
				}
			} catch (error) {
				if (error.response.data.message === "Not Logged In") {
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
			}
		};

		fetchRole();
	}, [navigate, toast]);

	const handleLogout = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(`${api}/user/logout`, {
				withCredentials: true,
			});

			if (response.status === 200) {
				navigate("/login");
			}
		} catch (error) {
			if (error.response.data.message === "Not Logged In") {
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

	return isLoading ? (
		<Spinner />
	) : (
		<Box
			bg='#121211'
			position='sticky'
			top={0}
			zIndex={10}
			color='#FFFFFF'
			width='100%'
			height='50px'
		>
			<Box display='flex' justifyContent='center' alignItems='center'>
				<Box
					display='flex'
					justifyContent='flex-start'
					alignItems='center'
					fontSize='25px'
					width='33vw'
					height='50px'
				>
					<MyDrawerAdmin />
				</Box>
				<Box
					display='flex'
					justifyContent='center'
					alignItems='center'
					width='33vw'
					height='50px'
				>
					<Link to={"/admin"}>Vetrik 🐾</Link>
				</Box>
				<Box
					display='flex'
					justifyContent='flex-end'
					alignItems='center'
					width='33vw'
					height='50px'
				>
					<Tooltip label='تسجيل الخروج' hasArrow placement='bottom'>
						<IconButton
							icon={<Icon as={IoMdLogOut} boxSize={7} />} // Bigger icon
							aria-label='تسجيل الخروج'
							onClick={handleLogout}
							bg='#121211'
							color='#FFF'
							_hover={{
								color: "#D4F500",
							}}
							_active={{
								bg: "#121211",
								transform: "scale(0.95)",
							}}
							boxSize='50px'
							boxShadow='lg'
							transition='all 0.2s ease'
							mr={4}
						/>
					</Tooltip>
				</Box>
			</Box>
		</Box>
	);
}
