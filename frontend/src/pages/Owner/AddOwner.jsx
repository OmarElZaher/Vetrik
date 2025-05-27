// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Variable Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import AddOwner from "../../components/Owner/AddOwner";
import PageLayout from "../../components/Layout/PageLayout";

export default function AddOwnerPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Add Owner | {vet_name}</title>
				</Helmet>
			</HelmetProvider>
			<PageLayout>
				<AddOwner />
			</PageLayout>
		</>
	);
}
