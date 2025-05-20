// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Vet Name Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import VetHome from "../../components/General/VetHome";
import PageLayout from "../../components/Layout/PageLayout";

export default function VetHomePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Home | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<PageLayout>
				<VetHome />
			</PageLayout>
		</>
	);
}
