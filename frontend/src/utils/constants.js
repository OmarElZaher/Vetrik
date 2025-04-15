const VET_NAME = "Modern Vet";
const API_URL =
	process.env.NODE_ENV === "production"
		? process.env.REACT_APP_API_URL
		: "http://localhost:4000";

export { VET_NAME, API_URL };
