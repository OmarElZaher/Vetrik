// React Imports
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// Chakra UI Imports
import { Box, IconButton, useToast } from "@chakra-ui/react";

// React Icons Imports
import { IoMdLogOut } from "react-icons/io";

// Custom Component Imports
import MyDrawer from "./MyDrawer";
import Spinner from "./Spinner";

export default function Header() {
	const navigate = useNavigate();
	const toast = useToast();

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	const handleLogout = async () => {
		localStorage.clear();
		try {
			setIsLoading(true);
			const response = await axios.post(
				"http://localhost:1234/user/logout",
				{},
				{
					withCredentials: true,
				}
			);

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
		<Box
			as='nav'
			bg='#121211'
			width='100%'
			height='50px'
			position='sticky'
			top={0}
			color='#FFFFFF'
			zIndex={10}
		>
			<Box display='flex' justifyContent='center' alignItems='center'>
				<Box
					width='33vw'
					height='50px'
					display='flex'
					justifyContent='flex-start'
					alignItems='center'
					key={1}
					fontSize='25px'
				>
					<MyDrawer />
				</Box>
				<Box
					width='33vw'
					height='50px'
					display='flex'
					justifyContent='center'
					alignItems='center'
					key={2}
				>
					<Link to={isAdmin ? "/admin" : "/"}>LOGO PLACEMENT</Link>
				</Box>
				<Box
					width='33vw'
					height='50px'
					display='flex'
					justifyContent='flex-end'
					alignItems='center'
					key={3}
				>
					<IconButton
						as={IoMdLogOut}
						size={"sm"}
						bg='#121211'
						color='FFF'
						onClick={handleLogout}
						cursor={"pointer"}
						_hover={{
							color: "#D4F500",
						}}
						_active={{
							opacity: "0.5",
						}}
						transition='all 0.05s ease'
					/>
				</Box>
			</Box>
		</Box>
	);
}
