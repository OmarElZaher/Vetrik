// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Vet Name Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import Header from "../../components/General/Header";
import VetHome from "../../components/General/VetHome";
import Footer from "../../components/General/Footer";

export default function VetHomePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Home | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<VetHome />
			<Footer />
		</>
	);
}
