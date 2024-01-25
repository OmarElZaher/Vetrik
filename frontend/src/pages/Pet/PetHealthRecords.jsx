// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import Header from "../../components/General/Header";
import PetHealthRecords from "../../components/Pet/PetHealthRecords";

export default function PetHealthRecordsPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Health Records | Pet</title>
				</Helmet>
				<Header />
			</HelmetProvider>

			<PetHealthRecords />
		</>
	);
}
