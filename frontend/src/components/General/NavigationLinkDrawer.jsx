// React Imports
import React from "react";
import { useNavigate } from "react-router-dom";

// ChakraUI Imports
import { Box, Button, Icon } from "@chakra-ui/react";

export default function NavigationLinkDrawer({
	icon,
	text,
	to,
	justifyContent,
	alignItems,
}) {
	const navigate = useNavigate();
	return (
		<Box display='flex' justifyContent={justifyContent} alignItems={alignItems}>
			<Button
				_hover={{
					bg: "#D4F500",
					borderColor: "#D4F500",
					color: "#000",
					transform: "scale(1.05)",
				}}
				_active={{
					transform: "scale(0.98)",
					opacity: "0.5",
				}}
				onClick={() => navigate(to)}
				justifyContent={"flex-start"}
				variant='ghost'
				fontSize='15px'
				leftIcon={<Icon as={icon} fontSize='18px' />}
				transition='all 0.15s ease'
				color='#8F8F8F'
				borderColor='#8F8F8F'
				width={"230px"}
				ml={10}
				mt={2}
			>
				{text}
			</Button>
		</Box>
	);
}
