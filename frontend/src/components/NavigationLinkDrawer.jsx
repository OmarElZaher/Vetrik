import { Link } from "react-router-dom";
import { Box, Button, Icon } from "@chakra-ui/react";

export default function NavigationLinkDrawer({
	icon,
	text,
	to,
	justifyContent,
	alignItems,
}) {
	return (
		<Box display='flex' justifyContent={justifyContent} alignItems={alignItems}>
			<Link to={to}>
				<Button
					variant='ghost'
					fontSize='15px'
					leftIcon={<Icon as={icon} fontSize='18px' />}
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
					transition='all 0.15s ease'
					color='#8F8F8F'
					borderColor='#8F8F8F'
					mt={2}
				>
					{text}
				</Button>
			</Link>
		</Box>
	);
}
