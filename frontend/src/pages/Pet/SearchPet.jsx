// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Vet Name Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import SearchPet from "../../components/Pet/SearchPet";
import PageLayout from "../../components/Layout/PageLayout";

export default function SearchPetPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Search Pet | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<PageLayout>
				<SearchPet />
			</PageLayout>
		</>
	);
}
