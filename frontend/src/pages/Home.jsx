import React from "react";

import { HelmetProvider, Helmet } from "react-helmet-async";

import Header from "../components/General/Header";
import Footer from "../components/General/Footer";

export default function HomePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Home | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<Footer />
		</>
	);
}
