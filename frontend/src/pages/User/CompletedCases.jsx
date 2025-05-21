// React Imports
import { Helmet, HelmetProvider } from "react-helmet-async";

// Custom Component Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import CompletedCases from "../../components/User/CompletedCases";
import PageLayout from "../../components/Layout/PageLayout";

export default function CompletedCasesPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Completed Cases | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<PageLayout>
				<CompletedCases />
			</PageLayout>
		</>
	);
}
