// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Variable Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import Header from "../../components/General/Header";
import AddOwner from "../../components/Owner/AddOwner";

export default function AddOwnerPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Add Owner | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<AddOwner />
		</>
	);
}
