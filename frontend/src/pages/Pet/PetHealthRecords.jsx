// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Variable Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import PetHealthRecords from "../../components/Pet/PetHealthRecords";
import PageLayout from "../../components/Layout/PageLayout";

export default function PetHealthRecordsPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Health Records | {vet_name}</title>
				</Helmet>
			</HelmetProvider>
			<PageLayout>
				<PetHealthRecords />
			</PageLayout>
		</>
	);
}
