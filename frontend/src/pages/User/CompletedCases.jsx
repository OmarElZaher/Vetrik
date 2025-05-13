// React Imports
import { Helmet, HelmetProvider } from "react-helmet-async";

// Custom Component Imports
import { VET_NAME as vet_name } from "../../utils/constants";

// Custom Component Imports
import Header from "../../components/General/Header";
import CompletedCases from "../../components/User/CompletedCases";

export default function CompletedCasesPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Completed Cases | {vet_name}</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<CompletedCases />
		</>
	);
}
