import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

function App() {
	return (
		<>
			<ChakraProvider theme={theme}>
				<Router>
					<Routes>
						<Route />
					</Routes>
				</Router>
			</ChakraProvider>
		</>
	);
}

export default App;
