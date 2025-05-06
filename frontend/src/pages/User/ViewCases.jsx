// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Custom Component Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import Header from "../../components/General/Header";
import ViewCases from "../../components/User/ViewCases";

export default function ViewCasesPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Pending Cases | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<ViewCases />
		</>
	);
}
