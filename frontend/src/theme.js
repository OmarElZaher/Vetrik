// theme.ts
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const customTheme = extendTheme({
	config: {
		initialColorMode: "light",
		useSystemColorMode: true,
	},
	fonts: {
		heading: `'Inter', sans-serif`,
		body: `'Inter', sans-serif`,
	},
	styles: {
		global: (props) => ({
			body: {
				bg: mode("gray.50", "gray.900")(props),
				color: mode("gray.800", "gray.200")(props),
			},
		}),
	},
	colors: {
		brand: {
			50: "#EBF5FF",
			100: "#D6EFFF",
			500: "#2F80ED",
			600: "#1C6DD0",
		},
	},
});
export default customTheme;
