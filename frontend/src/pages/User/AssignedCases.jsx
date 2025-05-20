// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Custom Component Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import AssignedCases from "../../components/User/AssignedCases";
import PageLayout from "../../components/Layout/PageLayout";

export default function AssignedCasesPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Assigned Cases | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<PageLayout>
				<AssignedCases />
			</PageLayout>
		</>
	);
}
