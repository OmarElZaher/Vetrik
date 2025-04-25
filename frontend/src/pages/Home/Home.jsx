// React Imports
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Vet Name Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import Header from "../../components/General/Header";
import Home from "../../components/General/Home";
import Footer from "../../components/General/Footer";

export default function HomePage() {
	const navigate = useNavigate();

	useEffect(() => {
		// Check if the user is logged in
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
		}
	}, [navigate]);
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
