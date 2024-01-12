import React from "react";

import { HelmetProvider, Helmet } from "react-helmet-async";

import LoginCard from "../../components/General/LoginCard";

export default function LoginPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Login | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<LoginCard />
		</>
	);
}
