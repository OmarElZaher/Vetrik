// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Custom Component Imports
import { VET_NAME as vet_name } from "../../utils/constants";

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
