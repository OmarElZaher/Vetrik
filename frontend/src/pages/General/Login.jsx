// React Imports
import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// Vet Name Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import LoginCard from "../../components/General/LoginCard";

export default function LoginPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Login | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<LoginCard />
		</>
	);
}
