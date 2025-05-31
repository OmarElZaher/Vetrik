// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Variable Imports
import { VET_NAME as vet_name } from "../../../utils/constants";

// Custom Component Imports
import UsersTable from "../../../components/Admin/User/UsersTable";
import PageLayout from "../../../components/Layout/PageLayout";

export default function UsersTablePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Users Table | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<PageLayout>
				<UsersTable />
			</PageLayout>
		</>
	);
}
