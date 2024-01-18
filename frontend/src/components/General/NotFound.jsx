import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Text } from "@chakra-ui/react";

import Footer from "./Footer";

export default function NotFound() {
	const navigate = useNavigate();
    
	return (
		<>
			<Box
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				flexDirection={"column"}
				height={"87vh"}
				bg={"#F3F3F3"}
			>
				<Text fontWeight={"bold"} fontSize={"60px"} color={"red"}>
					ERROR 404
				</Text>
				<Text fontSize={"40px"} textDecoration={"underline"}>
					PAGE NOT FOUND
				</Text>
				<Button
					onClick={() => {
						navigate("/");
					}}
					_hover={{
						bg: "yellowgreen",
						color: "#000",
						transform: "scale(1.01)",
					}}
					_active={{
						transform: "scale(0.99)",
						opacity: "0.5",
					}}
					bg={"#FFF"}
					mt={10}
					width={"25vw"}
				>
					Home
				</Button>
			</Box>
			<Footer />
		</>
	);
}
