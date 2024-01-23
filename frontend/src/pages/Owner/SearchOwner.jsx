// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Custom Component Imports
import Header from "../../components/General/Header";
import SearchOwner from "../../components/Owner/SearchOwner";

export default function SearchOwnerPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Search Owner | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<SearchOwner />
		</>
	);
}
