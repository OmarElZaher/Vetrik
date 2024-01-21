import React from "react";

import { Helmet, HelmetProvider } from "react-helmet-async";

import AdminHeader from "../../../components/Admin/General/AdminHeader";
import CreateUser from "../../../components/Admin/User/CreateUser";

export default function CreateUserPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Create User</title>
				</Helmet>
			</HelmetProvider>

			<AdminHeader />
			<CreateUser />
		</>
	);
}
