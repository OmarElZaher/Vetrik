import React from "react";

import { HelmetProvider, Helmet } from "react-helmet-async";

import Header from "../../components/General/Header";
import AddOwner from "../../components/Owner/AddOwner";

export default function AddOwnerPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Add Owner | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<AddOwner />
		</>
	);
}
