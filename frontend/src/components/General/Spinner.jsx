import { Flex, Spinner as ChakraSpinner, Text } from "@chakra-ui/react";

const Spinner = ({ message = "جارٍ التحميل..." }) => {
	return (
		<Flex
			height='60vh'
			direction='column'
			align='center'
			justify='center'
			gap={4}
		>
			<ChakraSpinner
				thickness='4px'
				speed='0.65s'
				emptyColor='gray.200'
				color='blue.500'
				size='xl'
			/>
			<Text fontSize='lg' color='gray.600'>
				{message}
			</Text>
		</Flex>
	);
};

export default Spinner;
