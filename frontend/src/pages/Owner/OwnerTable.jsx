// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Custom Component Imports
import Header from "../../components/General/Header";
import OwnerTable from "../../components/Owner/OwnerTable";

export default function OwnerTablePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Owner Table | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<OwnerTable />
		</>
	);
}
