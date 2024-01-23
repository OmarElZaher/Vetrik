// React Imports
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// ChakraUI Imports
import {
	Box,
	Button,
	Card,
	Tooltip,
	Text,
	useToast,
	Badge,
} from "@chakra-ui/react";

// React Icons Imports
import { TbTrashXFilled } from "react-icons/tb";

// Custom Component Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

function titleCase(str) {
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

export default function UserDetails() {
	const { userId } = useParams();
	const navigate = useNavigate();
	const toast = useToast();

	// User useStates
	const [user, setUser] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);
	const [gotData, setGotData] = useState(false);
	const [error, setError] = useState(null);

	const handleDeleteUser = async () => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this user?"
		);
		if (confirmDelete) {
			try {
				setIsLoading(true);
				const response = await axios.delete(
					`http://localhost:1234/user/deleteUser/${userId}`,
					{
						withCredentials: true,
					}
				);

				if (response.status === 200) {
					toast({
						title: response.data.message,
						status: "success",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
					navigate("/admin/search-users");
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
		}
	};

	const handleSetAdmin = async () => {
		const confirmSetAdmin = window.confirm(
			`Are you sure you want to set ${titleCase(user.firstName)} ${titleCase(
				user.lastName
			)} as an admin?`
		);
		if (confirmSetAdmin) {
			try {
				setIsLoading(true);
				const response = await axios.patch(
					`http://localhost:1234/user/setAdmin/${userId}`,
					{},
					{ withCredentials: true }
				);
				if (response.status === 200) {
					setIsAdmin(true);
					toast({
						title: response.data.message,
						status: "success",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
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
		}
	};

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(
				`http://localhost:1234/user/getUserInfo/${userId}`,
				{ withCredentials: true }
			);

			if (response.status === 200) {
				setUser(response.data.user);
				setIsAdmin(response.data.user.isAdmin);
				setGotData(true);
			} else {
				setError(response.data.message);
				toast({
					title: response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			}
		} catch (error) {
			setError(error.response.data.message);
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

	return isLoading ? (
		<Spinner />
	) : error ? (
		<>
			<Box
				display={"flex"}
				flexDirection={"column"}
				justifyContent={"center"}
				alignItems={"center"}
				bg={"#F3F3F3"}
				height={"87vh"}
			>
				<Text fontWeight={"bold"} fontSize={"60px"} color={"red"}>
					ERROR
				</Text>
				<Text fontSize={"40px"} textDecoration={"underline"}>
					{error}
				</Text>
				<Button
					_hover={{
						bg: "yellowgreen",
						color: "#000",
						transform: "scale(1.01)",
					}}
					_active={{
						transform: "scale(0.99)",
						opacity: "0.5",
					}}
					onClick={() => {
						navigate("/admin/search-users");
					}}
					bg={"#FFF"}
					width={"25vw"}
					mt={10}
				>
					Go Back To Search
				</Button>
			</Box>
			<Footer />
		</>
	) : gotData ? (
		<>
			<Box
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				bg={"#F3F3F3"}
				width={"100vw"}
				height={"87vh"}
			>
				{/* User Information */}
				<Card
					justifyContent={"center"}
					alignItems={"center"}
					width='80%'
					height='95%'
				>
					<Box
						display={"flex"}
						flexDirection={"column"}
						justifyContent={"center"}
						alignItems={"center"}
						bg={"#CCC"}
						borderTopRadius={"10px"}
						width={"90%"}
						height={"15%"}
					>
						<Text
							fontSize={"30px"}
							fontWeight={"bold"}
							textDecoration={"underline"}
						>
							User Information
						</Text>
						<Text fontSize={"28px"} mt={2}>
							{`${titleCase(user.firstName)} ${titleCase(user.lastName)}`}
						</Text>
					</Box>

					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						border={"2px solid #CCC"}
						width={"90%"}
						height={"60%"}
					>
						<Box
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
							alignItems={"center"}
							width={"40%"}
							height={"80%"}
						>
							<Text fontSize={"30px"} fontWeight={"bold"}>
								Username
							</Text>
							<Text fontSize={"30px"}>{user.username}</Text>
						</Box>

						<Box
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
							alignItems={"center"}
							borderLeft={"1px solid #CCC"}
							width={"40%"}
							height={"80%"}
						>
							<Text fontSize={"30px"} fontWeight={"bold"}>
								Email
							</Text>
							<Text fontSize={"30px"}>{user.email}</Text>
						</Box>

						<Box
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
							alignItems={"center"}
							borderLeft={"1px solid #CCC"}
							width={"20%"}
							height={"80%"}
						>
							<Text fontWeight={"bold"}>
								Is Admin:{" "}
								{isAdmin ? (
									<Badge colorScheme='green'>True</Badge>
								) : (
									<Badge colorScheme='red'>False</Badge>
								)}
							</Text>
						</Box>
					</Box>

					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						bg={"#CCC"}
						borderBottomRadius={"10px"}
						width={"90%"}
						height={"10%"}
					>
						<Tooltip
							hasArrow
							label='Sets User As An Admin'
							openDelay={75}
							placement='top'
							bg={"yellowgreen"}
						>
							<Button
								_hover={{
									bg: "yellowgreen",
									color: "#000",
									transform: "scale(1.01)",
								}}
								_active={{
									transform: "scale(0.99)",
									opacity: "0.5",
								}}
								onClick={handleSetAdmin}
								mx={1.5}
							>
								Set As Admin
							</Button>
						</Tooltip>
						<Tooltip
							hasArrow
							label='Deletes User From System'
							openDelay={75}
							placement='top'
							bg={"#EF5350"}
						>
							<Button
								_hover={{
									bg: "#EF5350",
									color: "#000",
									transform: "scale(1.01)",
								}}
								_active={{
									transform: "scale(0.99)",
									opacity: "0.5",
								}}
								onClick={handleDeleteUser}
								variant={"outline"}
								borderColor={"#EF5350"}
								leftIcon={<TbTrashXFilled />}
								mx={1.5}
							>
								Delete User
							</Button>
						</Tooltip>
					</Box>
				</Card>
			</Box>
			<Footer />
		</>
	) : (
		<></>
	);
}
