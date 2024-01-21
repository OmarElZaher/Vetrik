import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import AdminHomePage from "./pages/Admin/General/AdminHome";
import HomePage from "./pages/Home/Home";
import LoginPage from "./pages/General/Login";
import SearchOwnerPage from "./pages/Owner/SearchOwner";
import OwnerTablePage from "./pages/Owner/OwnerTable";
import PetDetailsPage from "./pages/Pet/PetDetails";
import OwnerDetailsPage from "./pages/Owner/OwnerDetails";

import SearchPetPage from "./pages/Pet/SearchPet";
import PetTablePage from "./pages/Pet/PetTable";

import AddOwnerPage from "./pages/Owner/AddOwner";
import AddPetPage from "./pages/Pet/AddPet";

import EditProfilePage from "./pages/User/EditProfile";

import NotFoundPage from "./pages/General/NotFound";

import ChangePasswordPage from "./pages/User/ChangePassword";

import SearchUsersPage from "./pages/Admin/User/SearchUsers";
import UsersTablePage from "./pages/Admin/User/UsersTable";
import UserDetailsPage from "./pages/Admin/User/UserDetails";

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
						<Route
							path='/owner-details/:ownerId'
							element={<OwnerDetailsPage />}
						/>

						<Route path='/change-password' element={<ChangePasswordPage />} />

						<Route path='/add-owner' element={<AddOwnerPage />} />
						<Route path='/add-pet' element={<AddPetPage />} />
						<Route path='/edit-user' element={<EditProfilePage />} />

						<Route path='/admin/search-users' element={<SearchUsersPage />} />
						<Route path='/admin/users-table' element={<UsersTablePage />} />
						<Route
							path='/admin/user-details/:userId'
							element={<UserDetailsPage />}
						/>

						<Route path='*' element={<NotFoundPage />} />
					</Routes>
				</Router>
			</ChakraProvider>
		</>
	);
}

export default App;
