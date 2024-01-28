// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Vet Name Imports
import { vet_name } from "../../variables";

// Custom Component Imports
import Header from "../../components/General/Header";
import Home from "../../components/General/Home";
import Footer from "../../components/General/Footer";

export default function HomePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Home | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<Home />
			<Footer />
		</>
	);
}
