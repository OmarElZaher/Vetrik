import React from "react";

import { HelmetProvider, Helmet } from "react-helmet-async";

import { Box } from "@chakra-ui/react";

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
				height={"87vh"}
				bg={"#F3F3F3"}
			/>
			<Footer />
		</>
	);
}
