// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Custom Component Imports
import { vet_name } from "../../variables";

// Custom Component Imports
import RequestOTP from "../../components/User/RequestOTP";

export default function RequestOTPPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Request OTP | {vet_name}</title>
				</Helmet>
			</HelmetProvider>
			<RequestOTP />
		</>
	);
}
