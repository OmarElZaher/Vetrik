// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Variable Imports
import { VET_NAME as vet_name } from "../../../utils/constants";

// Custom Component Imports
import CreateUser from "../../../components/Admin/User/CreateUser";
import PageLayout from "../../../components/Layout/PageLayout";

export default function CreateUserPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Create User | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<PageLayout>
				<CreateUser />
			</PageLayout>
		</>
	);
}
