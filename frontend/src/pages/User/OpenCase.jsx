// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Custom Component Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import Header from "../../components/General/Header";
import OpenCase from "../../components/User/OpenCase";

export default function OpenCasePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Open a Case | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<OpenCase />
		</>
	);
}
