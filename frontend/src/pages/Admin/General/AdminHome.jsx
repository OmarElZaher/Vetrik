// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Chakra UI Imports
import { Box } from "@chakra-ui/react";

// Custom Component Imports
import AdminHeader from "../../../components/Admin/General/AdminHeader";
import Footer from "../../../components/General/Footer";

export default function AdminHomePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Admin Home | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<AdminHeader />
			<Box
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				bg={"#F3F3F3"}
				height={"87vh"}
			/>
			<Footer />
		</>
	);
}
