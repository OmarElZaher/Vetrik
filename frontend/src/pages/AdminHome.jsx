import React from "react";

import { HelmetProvider, Helmet } from "react-helmet-async";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AdminHomePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Admin Home | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<Footer />
		</>
	);
}
