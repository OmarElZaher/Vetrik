// React Imports
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Chakra UI Imports
import { ChakraProvider } from "@chakra-ui/react";

// Admin Imports {
import AdminHomePage from "./pages/Admin/General/AdminHome";

import SearchUsersPage from "./pages/Admin/User/SearchUsers";
import UsersTablePage from "./pages/Admin/User/UsersTable";
import UserDetailsPage from "./pages/Admin/User/UserDetails";

import CreateUserPage from "./pages/Admin/User/CreateUser";
import CreateAdminPage from "./pages/Admin/User/CreateAdmin";
// }

// General Imports {
import HomePage from "./pages/Home/Home";
import LoginPage from "./pages/General/Login";
import NotFoundPage from "./pages/General/NotFound";
import SendFeedbackPage from "./pages/General/SendFeedback";

import EditProfilePage from "./pages/User/EditProfile";
import ChangePasswordPage from "./pages/User/ChangePassword";
import ForgotUsernamePage from "./pages/User/ForgotUsername";

import RequestOTPPage from "./pages/User/RequestOTP";
import VerifyOTPPage from "./pages/User/VerifyOTP";
import ResetPasswordPage from "./pages/User/ResetPassword";
// }

// Owner Imports {
import SearchOwnerPage from "./pages/Owner/SearchOwner";
import OwnerTablePage from "./pages/Owner/OwnerTable";
import OwnerDetailsPage from "./pages/Owner/OwnerDetails";
import EditOwnerPage from "./pages/Owner/EditOwner";

import AddOwnerPage from "./pages/Owner/AddOwner";
// }

// Pet Imports {
import PetDetailsPage from "./pages/Pet/PetDetails";
import EditPetPage from "./pages/Pet/EditPet";
import SearchPetPage from "./pages/Pet/SearchPet";
import PetTablePage from "./pages/Pet/PetTable";

import AddPetPage from "./pages/Pet/AddPet";

import PetVaccinationPage from "./pages/Pet/PetVaccination";
import PetHealthRecordsPage from "./pages/Pet/PetHealthRecords";
// }

import theme from "./theme";

function App() {
	return (
		<>
			<ChakraProvider theme={theme}>
				<Router>
					<Routes>
						{/* General Routes */}
						<Route path='/' element={<HomePage />} />
						<Route path='/login' element={<LoginPage />} />
						<Route path='/send-feedback' element={<SendFeedbackPage />} />

						<Route path='/change-password' element={<ChangePasswordPage />} />
						<Route path='/edit-user' element={<EditProfilePage />} />
						<Route path='/forgot-username' element={<ForgotUsernamePage />} />

						<Route path='/forgot-password' element={<RequestOTPPage />} />
						<Route path='/verify-otp' element={<VerifyOTPPage />} />
						<Route path='/reset-password' element={<ResetPasswordPage />} />

						{/* User Routes */}
						<Route path='/search-owner' element={<SearchOwnerPage />} />
						<Route path='/search-pet' element={<SearchPetPage />} />

						<Route path='/owner-table' element={<OwnerTablePage />} />
						<Route path='/pet-table' element={<PetTablePage />} />

						<Route path='/pet-details/:petId' element={<PetDetailsPage />} />
						<Route
							path='/owner-details/:ownerId'
							element={<OwnerDetailsPage />}
						/>

						<Route path='/edit-owner/:ownerId' element={<EditOwnerPage />} />
						<Route path='/edit-pet/:petId' element={<EditPetPage />} />

						<Route
							path='/pet-vaccination/:petId'
							element={<PetVaccinationPage />}
						/>
						<Route
							path='/pet-records/:petId'
							element={<PetHealthRecordsPage />}
						/>

						<Route path='/add-owner' element={<AddOwnerPage />} />
						<Route path='/add-pet' element={<AddPetPage />} />

						{/* Admin Routes */}
						<Route path='/admin' element={<AdminHomePage />} />
						<Route path='/admin/search-users' element={<SearchUsersPage />} />
						<Route path='/admin/users-table' element={<UsersTablePage />} />
						<Route path='/admin/create-user' element={<CreateUserPage />} />
						<Route path='/admin/create-admin' element={<CreateAdminPage />} />
						<Route
							path='/admin/user-details/:userId'
							element={<UserDetailsPage />}
						/>

						{/* Not Found Routes */}
						<Route path='*' element={<NotFoundPage />} />
					</Routes>
				</Router>
			</ChakraProvider>
		</>
	);
}

export default App;
