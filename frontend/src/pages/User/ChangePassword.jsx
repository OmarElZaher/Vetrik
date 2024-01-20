import React, { useEffect, useState } from "react";
import axios from "axios";

import { Helmet, HelmetProvider } from "react-helmet-async";

import { useToast } from "@chakra-ui/react";

import Header from "../../components/General/Header";
import AdminHeader from "../../components/Admin/General/AdminHeader";
import ChangePassword from "../../components/User/ChangePassword";
import Spinner from "../../components/General/Spinner";

export default function ChangePasswordPage() {
	const toast = useToast();
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

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
					<title>Change Password | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			{isAdmin ? <AdminHeader /> : <Header />}
			<ChangePassword />
		</>
	);
}
