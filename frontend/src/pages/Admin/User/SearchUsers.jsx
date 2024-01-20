import React from "react";

import { Helmet, HelmetProvider } from "react-helmet-async";

import AdminHeader from "../../../components/Admin/General/AdminHeader";
import SearchUsers from "../../../components/Admin/User/SearchUsers";

export default function SearchUsersPage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Search Users | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<AdminHeader />
			<SearchUsers />
		</>
	);
}
