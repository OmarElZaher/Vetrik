import React from "react";

import { HelmetProvider, Helmet } from "react-helmet-async";

import Header from "../../components/General/Header";
import Footer from "../../components/General/Footer";

export default function OwnerDetailsPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Owner Details | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<Footer />
		</>
	);
}
