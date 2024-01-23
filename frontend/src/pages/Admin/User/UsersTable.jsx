// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Custom Component Imports
import AdminHeader from "../../../components/Admin/General/AdminHeader";
import UsersTable from "../../../components/Admin/User/UsersTable";

export default function UsersTablePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Users Table | Dashboard</title>
				</Helmet>
			</HelmetProvider>

			<AdminHeader />
			<UsersTable />
		</>
	);
}
