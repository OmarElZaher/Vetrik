// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Custom Component Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import OpenCase from "../../components/User/OpenCase";
import PageLayout from "../../components/Layout/PageLayout";

export default function OpenCasePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Open a Case | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<PageLayout>
				<OpenCase />
			</PageLayout>
		</>
	);
}
