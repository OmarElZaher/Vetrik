// React Imports
import React, { useState } from "react";

// Axios Import
import axios from "axios";

// Variable Imports
import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import {
	Box,
	Button,
	Card,
	FormControl,
	Input,
	InputGroup,
	InputLeftAddon,
	Text,
	Textarea,
	useToast,
} from "@chakra-ui/react";

// Custom Component Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

export default function SendFeedback() {
	const toast = useToast();

	// Form useStates
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [feedback, setFeedback] = useState("");
	const [clinic, setClinic] = useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
		try {
			setIsLoading(true);
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

	return isLoading ? (
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
					flexDirection={"column"}
					justifyContent={"center"}
					alignItems={"center"}
					width={"90%"}
					height={"90%"}
				>
					<Box
						display={"flex"}
						flexDirection={"column"}
						justifyContent={"center"}
						alignItems={"center"}
						width={"90%"}
						height={"15%"}
					>
						<Text fontSize={"40px"} fontWeight={"bold"}>
							Send Feedback
						</Text>
						<Text fontSize={"22px"}>Help make this system better! </Text>
						<Text fontSize={"21px"} textAlign={"center"}>
							Send any ideas you have to make this an easier and more convinient
							software.
						</Text>
						<Text fontSize={"21px"}>
							You can also report any problems you find while using the system.
						</Text>
						<Text fontSize={"21px"}>
							{" "}
							Your feedback is important to us and will be taken into
							consideration!{" "}
						</Text>
					</Box>
					<Box
						display={"flex"}
						flexDirection={"column"}
						justifyContent={"center"}
						alignItems={"center"}
						width={"90%"}
						height={"60%"}
					>
						<FormControl
							id='name'
							display={"flex"}
							justifyContent={"space-evenly"}
							alignItems={"center"}
							mb={5}
						>
							<Input
								id='firstName'
								type='text'
								name='firstName'
								placeholder='First Name'
								value={firstName}
								onChange={(e) => {
									setFirstName(e.target.value);
								}}
								mr={2.5}
							/>
							<Input
								id='lastName'
								type='text'
								name='lastName'
								placeholder='Last Name'
								value={lastName}
								onChange={(e) => {
									setLastName(e.target.value);
								}}
								ml={2.5}
							/>
						</FormControl>

						<FormControl
							id='email'
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							mb={5}
						>
							<InputGroup
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
							>
								<InputLeftAddon
									display={"flex"}
									justifyContent={"center"}
									alignItems={"center"}
									width={"5%"}
								>
									@
								</InputLeftAddon>
								<Input
									id='email'
									type='email'
									name='email'
									placeholder='Email'
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
									}}
								/>
							</InputGroup>
						</FormControl>

						<FormControl id='clinic' mb={5}>
							<Input
								id='clinic'
								type='text'
								name='clinic'
								placeholder='Operating Clinic'
								value={clinic}
								onChange={(e) => {
									setClinic(e.target.value);
								}}
							/>
						</FormControl>

						<FormControl id='feedback'>
							<Textarea
								id='feedback'
								name='feedback'
								placeholder="What's On Your Mind?"
								value={feedback}
								onChange={(e) => {
									console.log(e.target.value);
									setFeedback(e.target.value);
								}}
							/>
						</FormControl>
					</Box>
					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						width={"90%"}
						height={"15%"}
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
							onClick={handleSubmit}
							width={"25%"}
						>
							Submit
						</Button>
					</Box>
				</Card>
			</Box>
			<Footer />
		</>
	);
}
