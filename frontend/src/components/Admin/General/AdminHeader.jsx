// React Imports
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// ChakraUI Imports
import { Box, IconButton, useToast } from "@chakra-ui/react";

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

	const handleLogout = async () => {
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
					<Link to={"/admin"}>LOGO PLACEMENT</Link>
				</Box>
				<Box
					display='flex'
					justifyContent='flex-end'
					alignItems='center'
					width='33vw'
					height='50px'
				>
					<IconButton
						_hover={{
							color: "#D4F500",
						}}
						_active={{
							opacity: "0.5",
						}}
						onClick={handleLogout}
						as={IoMdLogOut}
						size={"sm"}
						bg='#121211'
						color='FFF'
						cursor={"pointer"}
						transition='all 0.05s ease'
					/>
				</Box>
			</Box>
		</Box>
	);
}
