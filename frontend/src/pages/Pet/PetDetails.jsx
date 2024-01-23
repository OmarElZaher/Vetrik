// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Custom Component Imports
import Header from "../../components/General/Header";
import PetDetails from "../../components/Pet/PetDetails";

export default function PetDetailsPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Pet Details | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<PetDetails />
		</>
	);
}
