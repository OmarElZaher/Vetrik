// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Custom Component Imports
import Header from "../../components/General/Header";
import AddPet from "../../components/Pet/AddPet";

export default function AddPetPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Add Pet | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<AddPet />
		</>
	);
}
