// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Variable Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import Header from "../../components/General/Header";
import EditPet from "../../components/Pet/EditPet";

export default function EditPetPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Edit Pet | {vet_name}</title>
				</Helmet>
			</HelmetProvider>
			<Header />
			<EditPet />
		</>
	);
}
