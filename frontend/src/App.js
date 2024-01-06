import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";

import theme from "./theme";

function App() {
	return (
		<>
			<ChakraProvider theme={theme}>
				<Router>
					<Routes>
						<Route path='/' element={<HomePage />} />
						<Route path='/login' element={<LoginPage />} />
					</Routes>
				</Router>
			</ChakraProvider>
		</>
	);
}

export default App;
