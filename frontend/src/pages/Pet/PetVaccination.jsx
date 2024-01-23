import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import Header from "../../components/General/Header";
import PetVaccination from "../../components/Pet/PetVaccination";

export default function PetVaccinationPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Vaccination | Pet</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<PetVaccination />
		</>
	);
}
