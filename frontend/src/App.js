import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import AdminHomePage from "./pages/Home/AdminHome";
import HomePage from "./pages/Home/Home";
import LoginPage from "./pages/General/Login";
import SearchOwnerPage from "./pages/Owner/SearchOwner";
import OwnerTablePage from "./pages/Owner/OwnerTable";
import PetDetailsPage from "./pages/Pet/PetDetails";

import SearchPetPage from "./pages/Pet/SearchPet";
import PetTablePage from "./pages/Pet/PetTable";

import AddOwnerPage from "./pages/Owner/AddOwner";
import AddPetPage from "./pages/Pet/AddPet";

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
						<Route path='/search-pet' element={<SearchPetPage />} />
						<Route path='/owner-table' element={<OwnerTablePage />} />
						<Route path='/pet-table' element={<PetTablePage />} />
						<Route path='/pet-details/:petId' element={<PetDetailsPage />} />

						<Route path='/add-owner' element={<AddOwnerPage />} />
						<Route path='/add-pet' element={<AddPetPage />} />
					</Routes>
				</Router>
			</ChakraProvider>
		</>
	);
}

export default App;
