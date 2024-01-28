// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Vet Name Imports
import { vet_name } from "../../variables";

// Custom Component Imports
import Header from "../../components/General/Header";
import PetDetails from "../../components/Pet/PetDetails";

export default function PetDetailsPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Pet Details | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<PetDetails />
		</>
	);
}
