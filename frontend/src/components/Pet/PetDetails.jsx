import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Spinner from "../General/Spinner";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

export default async function PetDetails() {
	const { petId } = useParams();
	const toast = useToast();
	const [pet, setPet] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const getData = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(
				`http://localhost:1234/user/getPetInfo/${petId}`,
				{
					withCredentials: true,
				}
			);
			if (response.status === 200) {
				console.log("Response Status: " + response.status);
				console.log("Response Data: " + JSON.stringify(response.data));
				return response.data;
			} else {
				toast({
					title: response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: error.response.data.message,
				status: "error",
				duration: 2500,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const data = await getData();
			setPet(data);
		} catch (error) {
			toast({
				title: error.response.data.message,
				status: "error",
				duration: 2500,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return isLoading ? <Spinner /> : <></>;
}
