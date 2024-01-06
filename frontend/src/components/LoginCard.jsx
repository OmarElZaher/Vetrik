import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	Checkbox,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Icon,
	Link,
} from "@chakra-ui/react";

import { FiLogIn } from "react-icons/fi";

export default function LoginCard() {
	return (
		<>
			<Flex
				minH={"93vh"}
				align={"center"}
				justify={"center"}
				bg={useColorModeValue("gray.50", "gray.800")}
			>
				<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
					<Stack align={"center"}>
						<Icon as={FiLogIn} fontSize='100px' />
						<Heading fontSize={"4xl"}>Welcome Back Doctor! 👋🏽</Heading>
						<Text fontSize={"lg"} color={"gray.600"} align={"center"}>
							Sign In Using Your Credentials to Access Your Dashboard
						</Text>
					</Stack>
					<Box
						rounded={"lg"}
						bg={useColorModeValue("white", "gray.700")}
						boxShadow={"lg"}
						p={8}
					>
						<Stack spacing={4}>
							<FormControl id='email'>
								<FormLabel>Email Address</FormLabel>
								<Input type='email' />
							</FormControl>

							<FormControl id='password'>
								<FormLabel>Password</FormLabel>
								<Input type='password' />
							</FormControl>

							<Stack spacing={10}>
								<Stack
									direction={{ base: "column", sm: "row" }}
									align={"start"}
									justify={"space-between"}
								>
									<Checkbox>Remember me</Checkbox>
									<Text color={"blue.400"}>Forgot password?</Text>
								</Stack>
								<Button
									bg={"blue.400"}
									color={"white"}
									_hover={{
										bg: "blue.500",
									}}
								>
									Sign in
								</Button>
							</Stack>
						</Stack>
					</Box>
				</Stack>
			</Flex>
		</>
	);
}
