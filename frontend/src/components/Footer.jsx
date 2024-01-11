import { Box, Container, Text, useColorModeValue } from "@chakra-ui/react";

export default function Footer() {
	return (
		<Box
			bg={useColorModeValue("gray.50", "gray.900")}
			color={useColorModeValue("gray.700", "gray.200")}
			minHeight={"100vh"}
			display={"flex"}
			flexDirection={"column"}
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
				<Text>© 2024 Modern Vet Clinic. All rights reserved.</Text>
			</Container>
		</Box>
	);
}
