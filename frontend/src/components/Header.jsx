import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Box, Button, Icon, useToast } from "@chakra-ui/react";

import { IoMdLogOut } from "react-icons/io";

import MyDrawer from "./MyDrawer";
import Spinner from "./Spinner";

export default function Header() {
	const navigate = useNavigate();
	const toast = useToast();
	const [error, setError] = useState(null);
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
			setError(error);
			toast({
				title: "Error",
				description: error.response.data.message,
				status: "error",
				duration: 2000,
				position: "top",
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

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
					Hello
				</Box>
				<Box
					width='33vw'
					height='50px'
					display='flex'
					justifyContent='flex-end'
					alignItems='center'
					key={3}
				>
					<Button
						fontSize='26px'
						bg='#121211'
						color='FFF'
						variant='link'
						onClick={handleLogout}
						_hover={{
							color: "#D4F500",
						}}
						_active={{
							opacity: "0.5",
						}}
						transition='all 0.05s ease'
					>
						<Icon as={IoMdLogOut} />
					</Button>
				</Box>
			</Box>
		</Box>
	);
}
