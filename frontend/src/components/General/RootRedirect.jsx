// React Imports
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// ...existing imports...

// Root redirect component
export default function RootRedirect() {
	const [redirectPath, setRedirectPath] = useState(null);

	useEffect(() => {
		// Get user role from localStorage or your auth context
		const userRole = localStorage.getItem("userRole");

		switch (userRole) {
			case "vet":
				console.log("Vet role detected");
				setRedirectPath("/vet");
				break;
			case "secretary":
				console.log("Secretary role detected");
				setRedirectPath("/secretary");
				break;
			case "admin":
				console.log("Admin role detected");
				setRedirectPath("/admin");
				break;
			default:
				console.log("Unknown role detected");
				// Fallback to login if role is unknown
				setRedirectPath("/login");
		}
	}, []);

	// Show nothing while determining where to redirect
	if (!redirectPath) return null;

	// Redirect to the appropriate page
	return <Navigate to={redirectPath} replace />;
}
