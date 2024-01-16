import React from "react";

import { HelmetProvider, Helmet } from "react-helmet-async";

import Header from "../../components/General/Header";
import PetTable from "../../components/Pet/PetTable";

export default function PetTablePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Pet Table | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<PetTable />
		</>
	);
}
