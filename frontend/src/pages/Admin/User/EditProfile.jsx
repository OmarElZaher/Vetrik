import React from "react";

import { Helmet, HelmetProvider } from "react-helmet-async";

import Header from "../../components/General/Header";
import EditProfile from "../../components/User/EditProfile";

export default function EditProfilePage() {
	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>Edit Profile | Modern Vet</title>
				</Helmet>
			</HelmetProvider>

			<Header />
			<EditProfile />
		</>
	);
}
