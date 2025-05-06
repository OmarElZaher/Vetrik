import React, { useEffect, useState } from "react";

import { Box, Text, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { VET_NAME as vet_name, API_URL as api } from "../../utils/constants";
import axios from "axios";

export default function Home() {
	const toast = useToast();
	const navigate = useNavigate();

	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [vetName, setVetName] = useState(vet_name);

	const [openCases, setOpenCases] = useState([]);

	const [gotData, setGotData] = useState(false);

	useEffect(() => {
		const fetchOpenCases = async () => {
			try {
				setLoading(true);
				const response = await axios.get(`${api}/case/getUnassignedCases`, {
					withCredentials: true,
				});

				if (response.status === 200) {
					setOpenCases(response.data);
				} else {
					setError(response.data.message);
				}
			} catch (error) {
				setError(error.response.data.message);
			} finally {
				setLoading(false);
			}
		};
		fetchOpenCases();
	}, [toast]);

	return (
		<>
			{/* Welcome Box */}
			<Box
				height={"10vh"}
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				bg={"#A3F8E2"}
			>
				<Text>{"Welcome to " + vetName + " Vet Clinic"}</Text>
			</Box>

			{/* Search Box */}
			<Box
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				bg={"#F3F3F3"}
				height={"33vh"}
			>
				<Box
					width={"50%"}
					height={"95%"}
					mx={5}
					bg={"#A3D4FF"}
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
				>
					{" "}
					hi
				</Box>
				<Box
					width={"50%"}
					height={"95%"}
					mx={5}
					bg={"#DDFFAA"}
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
				>
					hi
				</Box>
			</Box>

			{/* Open Cases Box */}
			<Box
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				bg={"#000"}
				height={"44vh"}
			>
				<Box
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
					bg={"#FFEE34"}
					width={"90%"}
					height={"95%"}
					mx={5}
				>
					hello
				</Box>
			</Box>
		</>
	);
}
