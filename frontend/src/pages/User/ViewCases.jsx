// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Custom Component Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import ViewCases from "../../components/User/ViewCases";
import PageLayout from "../../components/Layout/PageLayout";

export default function ViewCasesPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Pending Cases | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<PageLayout>
				<ViewCases />
			</PageLayout>
		</>
	);
}
