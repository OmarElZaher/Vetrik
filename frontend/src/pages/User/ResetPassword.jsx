// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Custom Component Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import ResetPassword from "../../components/User/ResetPassword";

export default function ResetPasswordPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Verify OTP | {vet_name}</title>
				</Helmet>
			</HelmetProvider>
			<ResetPassword />
		</>
	);
}
