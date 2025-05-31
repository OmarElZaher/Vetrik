// React Imports
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Custom Component Imports
import NotFound from "../../components/General/NotFound";
import PageLayout from "../../components/Layout/PageLayout";

export default function NotFoundPage() {
	return (
		<PageLayout>
			<HelmetProvider>
				<Helmet>
					<title>404 - Page Not Found</title>
				</Helmet>
			</HelmetProvider>

			<NotFound />
		</PageLayout>
	);
}
