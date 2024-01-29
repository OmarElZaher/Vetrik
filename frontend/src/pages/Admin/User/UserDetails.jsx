// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Vet Name Imports
import { VET_NAME as vet_name } from "../../../utils/constants";

// Custom Component Imports
import AdminHeader from "../../../components/Admin/General/AdminHeader";
import UserDetails from "../../../components/Admin/User/UserDetails";

export default function UserDetailsPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>User Details | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<AdminHeader />
			<UserDetails />
		</>
	);
}
