// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Custom Component Imports
import Header from "../../components/General/Header";
import SearchPet from "../../components/Pet/SearchPet";

export default function SearchPetPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Search Pet | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<SearchPet />
		</>
	);
}
