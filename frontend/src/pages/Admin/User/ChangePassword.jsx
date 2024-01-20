import React from "react";

import { Helmet, HelmetProvider } from "react-helmet-async";

import Header from "../../components/General/Header";
import ChangePassword from "../../components/User/ChangePassword";

export default function ChangePasswordPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Change Password | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<ChangePassword />
		</>
	);
}
