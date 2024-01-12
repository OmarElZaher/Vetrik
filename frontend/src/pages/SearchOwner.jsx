import React from "react";

import { HelmetProvider, Helmet } from "react-helmet-async";

import Header from "../components/Header";
import SearchOwner from "../components/SearchOwner";

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
