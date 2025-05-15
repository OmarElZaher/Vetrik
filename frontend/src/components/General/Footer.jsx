import { Box, Text } from "@chakra-ui/react";

export default function Footer() {
	return (
		<Box
			as="footer"
			bg="#121211"
			color="#F3F3F3"
			py={4}
			px={6}
			width="100%"
			textAlign="center"
			mt="auto"
		>
			<Text fontSize="sm">© 2024 Vetrik. All rights reserved.</Text>
		</Box>
	);
}

