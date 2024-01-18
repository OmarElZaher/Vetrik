import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	Box,
	Card,
	FormControl,
	Input,
	Text,
	useToast,
} from "@chakra-ui/react";

import TextField from "@mui/material/TextField";

import Spinner from "../General/Spinner";
import Footer from "../General/Footer";
import axios from "axios";

export default function EditProfile() {
	const navigate = useNavigate();
	const toast = useToast();

	const [isLoading, setIsLoading] = useState(false);

	const [user, setUser] = useState({});

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);

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
				setFirstName(response.data.firstName);
				setLastName(response.data.lastName);
				setEmail(response.data.email);
				setUsername(response.data.username);
				setIsAdmin(response.data.isAdmin);
				setUser(response.data);
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

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						height={"87vh"}
						bg={"#F3F3F3"}
					>
						<Card
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							height={"80%"}
							width={"80%"}
						/>
					</Box>
					<Footer />
				</>
			)}
		</>
	);
}
