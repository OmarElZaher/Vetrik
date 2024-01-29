// React Imports
import React, { Component, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Axios Import
import axios from "axios";

// Variable Imports
import { API_URL } from "../../utils/constants";

// Chakra UI Imports
import { Box, useToast } from "@chakra-ui/react";

// Custom Component Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

export default function EditOwner() {
	const { ownerId } = useParams();
	const navigate = useNavigate();
	const toast = useToast();

	// Form useStates
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [contactMethod, setContactMethod] = useState("");

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const handleEdit = async () => {};

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
						Edit Owner
					</Box>
					<Footer />
				</>
			)}
		</>
	);
}
