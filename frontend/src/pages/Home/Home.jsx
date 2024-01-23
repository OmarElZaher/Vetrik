// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Custom Component Imports
import Header from "../../components/General/Header";
import Home from "../../components/General/Home";
import Footer from "../../components/General/Footer";

export default function HomePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Home | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<Home />
			<Footer />
		</>
	);
}
