import React from "react";

import { HelmetProvider, Helmet } from "react-helmet-async";

import Header from "../components/Header";
import OwnerTable from "../components/OwnerTable";

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
