// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Variable Imports
import { vet_name } from "../../variables";

// Custom Components Imports
import ForgotUsername from "../../components/User/ForgotUsername";

export default function ForgotUsernamePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Forgot Username | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<ForgotUsername />
		</>
	);
}
