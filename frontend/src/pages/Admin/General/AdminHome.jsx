// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Vet Name Imports
import { VET_NAME as vet_name } from "../../../utils/constants";

// Custom Component Imports
import PageLayout from "../../../components/Layout/PageLayout";
import AdminHome from "../../../components/Admin/General/AdminHome";

export default function AdminHomePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Admin Home | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<PageLayout>
				<AdminHome />
			</PageLayout>
		</>
	);
}
