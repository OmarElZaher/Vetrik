// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Vet Name Imports
import { VET_NAME as vet_name } from "../../../utils/constants";

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
					<title>Admin Home | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<AdminHeader />
			<Box
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				bg={"#F3F3F3"}
				height={"88vh"}
			/>
			<Footer />
		</>
	);
}
