// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Variable Imports
import { VET_NAME as vet_name } from "../../../utils/constants";

// Custom Component Imports
import AdminHeader from "../../../components/Admin/General/AdminHeader";
import CreateAdmin from "../../../components/Admin/User/CreateAdmin";

export default function CreateAdminPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Create Admin | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<AdminHeader />
			<CreateAdmin />
		</>
	);
}
