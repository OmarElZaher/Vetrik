// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Vet Name Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import AddPet from "../../components/Pet/AddPet";
import PageLayout from "../../components/Layout/PageLayout";

export default function AddPetPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Add Pet | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<PageLayout>
				<AddPet />
			</PageLayout>
		</>
	);
}
