// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Vet Name Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import PetTable from "../../components/Pet/PetTable";
import PageLayout from "../../components/Layout/PageLayout";

export default function PetTablePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Pet Table | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<PageLayout>
				<PetTable />
			</PageLayout>
		</>
	);
}
