/* eslint-disable react-hooks/exhaustive-deps */
// React Imports
import React, { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Axios Import
import axios from "axios";

// Chakra UI Imports
import { useToast } from "@chakra-ui/react";

// Custom Component Imports
import AdminHeader from "../../components/Admin/General/AdminHeader";
import EditProfile from "../../components/User/EditProfile";
import Header from "../../components/General/Header";
import Spinner from "../../components/General/Spinner";

export default function EditProfilePage() {
	const toast = useToast();

	// Misc useStates
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

	return (
		<>
			{" "}
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<HelmetProvider>
						<Helmet>
							<title>Edit Profile | Modern Vet</title>
						</Helmet>
					</HelmetProvider>

					{isAdmin ? <AdminHeader /> : <Header />}
					<EditProfile />
				</>
			)}
		</>
	);
}
