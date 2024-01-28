/* eslint-disable react-hooks/exhaustive-deps */
// React Imports
import React, { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Axios Import
import axios from "axios";

// Variable Imports
import { vet_name } from "../../../variables";
import { api } from "../../variables";

// Chakra-UI Imports
import { useToast } from "@chakra-ui/react";

// Custom Component Imports
import AdminHeader from "../../components/Admin/General/AdminHeader";
import ChangePassword from "../../components/User/ChangePassword";
import Header from "../../components/General/Header";
import Spinner from "../../components/General/Spinner";

export default function ChangePasswordPage() {
	const toast = useToast();

	// Misc useStates
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(`${api}/user/getUserInfo`, {
				withCredentials: true,
			});

			if (response.status === 200) {
				setIsAdmin(response.data.isAdmin);
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

	return isLoading ? (
		<Spinner />
	) : (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Change Password | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			{isAdmin ? <AdminHeader /> : <Header />}
			<ChangePassword />
		</>
	);
}
