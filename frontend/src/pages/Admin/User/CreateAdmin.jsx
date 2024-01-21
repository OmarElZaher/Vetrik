import React from "react";

import { Helmet, HelmetProvider } from "react-helmet-async";

import AdminHeader from "../../../components/Admin/General/AdminHeader";
import CreateAdmin from "../../../components/Admin/User/CreateAdmin";

export default function CreateAdminPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Create Admin</title>
				</Helmet>
			</HelmetProvider>

			<AdminHeader />
			<CreateAdmin />
		</>
	);
}
