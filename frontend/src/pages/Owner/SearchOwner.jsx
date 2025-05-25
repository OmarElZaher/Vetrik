// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Vet Name Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import SearchOwner from "../../components/Owner/SearchOwner";
import PageLayout from "../../components/Layout/PageLayout";

export default function SearchOwnerPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Search Owner | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<PageLayout>
				<SearchOwner />
			</PageLayout>
		</>
	);
}
