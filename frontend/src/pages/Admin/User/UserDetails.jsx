import React from "react";

import { Helmet, HelmetProvider } from "react-helmet-async";

import AdminHeader from "../../../components/Admin/General/AdminHeader";
import UserDetails from "../../../components/Admin/User/UserDetails";

export default function UserDetailsPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>User Details | Modern Vet</title>
				</Helmet>
			</HelmetProvider>
            
			<AdminHeader />
			<UserDetails />
		</>
	);
}
