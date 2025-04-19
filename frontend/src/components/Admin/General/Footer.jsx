import { Box, Container, Text } from "@chakra-ui/react";

export default function Footer() {
	return (
		<Box
			display={"flex"}
			flexDirection={"column"}
			bg={"#121211"}
			color={"#F3F3F3"}
			height={"8vh"}
		>
			<Box flex={"1"}></Box>
			<Container
				as={Box}
				maxW={"26vw"}
				py={4}
				direction={{ base: "column", md: "row" }}
				spacing={4}
				justify={{ base: "center", md: "space-between" }}
				align={{ base: "center", md: "center" }}
			>
				<Text>© 2025 Vetrik. All rights reserved.</Text>
			</Container>
		</Box>
	);
}
