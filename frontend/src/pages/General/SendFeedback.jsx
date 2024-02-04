// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Variable Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import Header from "../../components/General/Header";
import SendFeedback from "../../components/General/SendFeedback";

export default function SendFeedbackPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Send Feedback | {vet_name}</title>
				</Helmet>
			</HelmetProvider>
			<Header />
			<SendFeedback />
		</>
	);
}
