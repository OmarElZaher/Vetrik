import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import AdminHomePage from "./pages/AdminHome";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import SearchOwnerPage from "./pages/SearchOwner";
import OwnerTablePage from "./pages/OwnerTable";

import theme from "./theme";

function App() {
	return (
		<>
			<ChakraProvider theme={theme}>
				<Router>
					<Routes>
						<Route path='/' element={<HomePage />} />
						<Route path='/login' element={<LoginPage />} />
						<Route path='/admin' element={<AdminHomePage />} />
						<Route path='/search-owner' element={<SearchOwnerPage />} />
						<Route path='/owner-table' element={<OwnerTablePage />} />
					</Routes>
				</Router>
			</ChakraProvider>
		</>
	);
}

export default App;
