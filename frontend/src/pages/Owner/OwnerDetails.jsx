import React from "react";

import { HelmetProvider, Helmet } from "react-helmet-async";

import Header from "../../components/General/Header";
import OwnerDetails from "../../components/Owner/OwnerDetails";

export default function OwnerDetailsPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Pet Details | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<OwnerDetails />
		</>
	);
}
