// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Variable Imports
import { VET_NAME } from "../../utils/constants";

// Custom Component Imports
import Header from "../../components/General/Header";
import EditOwner from "../../components/Owner/EditOwner";

export default function EditOwnerPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Edit Owner | {VET_NAME}</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<EditOwner />
		</>
	);
}
