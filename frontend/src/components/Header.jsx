import React from "react";

import { Box, Grid, GridItem } from "@chakra-ui/react";

import MyDrawer from "./MyDrawer";

const Header = () => {
	return (
		<Box
			as='nav'
			bg='#121211'
			width='100%'
			height='50px'
			position='sticky'
			top={0}
			color='#FFFFFF'
			zIndex={10}
		>
			<Grid
				width='100%'
				height='100%'
				templateColumns='repeat(3, 1fr)'
				gap={5}
				px='5px'
				fontWeight='bold'
				fontSize='2xl'
			>
				<GridItem px='10px' bg='#121211'>
					<MyDrawer />
				</GridItem>
				<GridItem px='10px' pt='6px' bg='#121211' alignItems='left'>
					HELLO
				</GridItem>
				<GridItem px='10px' pt='6px' bg='#121211'>
					HEY
				</GridItem>
			</Grid>
		</Box>
	);
};

export default Header;
