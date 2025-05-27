// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Variable Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import PetVaccination from "../../components/Pet/PetVaccination";
import PageLayout from "../../components/Layout/PageLayout";

export default function PetVaccinationPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Vaccination Card | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<PageLayout>
				<PetVaccination />
			</PageLayout>
		</>
	);
}
