import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import {
	Box,
	Card,
	Divider,
	Button,
	FormControl,
	Text,
	Textarea,
	useToast,
} from "@chakra-ui/react";

import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

export default function OpenCase() {
	const { petId } = useParams();
	const navigate = useNavigate();

	const [pet, setPet] = useState(null);
	const [petName, setPetName] = useState("");

	const [isLoading, setIsLoading] = useState(false);

	const [reasonForVisit, setReasonForVisit] = useState("");

	const toast = useToast();

	useEffect(() => {
		const fetchPetDetails = async () => {
			try {
				setIsLoading(true);

				const response = await axios.get(
					`${api}/user/getPetInfo/${petId}`,
					{
						withCredentials: true,
					}
				);

				if (response.status === 200) {
					setPet(response.data.pet);
					setPetName(response.data.pet.name);
				}
			} catch (error) {
				toast({
					title: "Error",
					description: "Internal Server Error",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchPetDetails();
	}, [toast, petId]);

	const handleSubmit = async () => {
		try {
			setIsLoading(true);

			const response = await axios.post(
				`${api}/case/createCase`,
				{
					petId: petId,
					reasonForVisit: reasonForVisit,
				},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				toast({
					title: "Success",
					description: "Case opened successfully",
					status: "success",
					duration: 3000,
					isClosable: true,
					position: "top",
				});
			} else {
				toast({
					title: response.data.message,
					status: "error",
					duration: 2500,
					position: "top",
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Internal Server Error",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<Box
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				height={"100vh"}
			>
				<Spinner />
			</Box>
		);
	}
	if (!pet) {
		return (
			<Box
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				height={"100vh"}
			>
				<Text fontSize={"xl"}>No pet found</Text>
			</Box>
		);
	}

	return (
		<>
			<Box
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				flexDir={"column"}
				width={"100%"}
				height={"87vh"}
			>
				<Box
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
					height={"20%"}
					width={"100%"}
				>
					<Text fontSize={"40px"} fontWeight={"bold"}>
						Open A Case
					</Text>
				</Box>

				<Box as={"hr"} />

				<Card
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
					flexDir={"column"}
					height={"60%"}
					width={"70%"}
					mt={5}
				>
					<FormControl
						id="pet"
						display={"flex"}
						height={"20%"}
						width={"50%"}
						flexDir={"column"}
						isDisabled={true}
						justifyContent={"center"}
						alignItems={"center"}
					>
						<Text fontSize={"md"} fontStyle={"italic"}>
							Open case for {petName}.
						</Text>
						<br />
						<Text>
							enter why client has decided to visit to send to vet
							to accept and start working on case
						</Text>
					</FormControl>

					<FormControl
						id="reasonForVisit"
						display={"flex"}
						width={"50%"}
						height={"80%"}
						flexDir={"column"}
						mt={2.5}
						mb={2.5}
					>
						<Textarea
							resize={"none"}
							width={"100%"}
							height={"100%"}
							borderRadius={"5px"}
							placeholder='Reason For Visit...'
							p={5}
							onChange={(e) => {
								setReasonForVisit(e.target.value);
							}}
						/>
					</FormControl>
				</Card>

				<Box
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
					height={"20%"}
				>
					<Button
						_hover={{
							bg: "#D4F500",
							color: "#000",
							transform: "scale(1.05)",
							transition: "0.2s",
						}}
						_active={{
							bg: "#D4F500",
							color: "#000",
							transform: "scale(0.95)",
							transition: "0.2s",
						}}
						onClick={() => {
							handleSubmit();
							navigate(`/pet-details/${petId}`);
						}}
					>
						Submit
					</Button>
				</Box>
			</Box>
		</>
	);
}
