// import { createTheme } from '@material-ui/core/styles';
// check: to supress warning of findDOMNode
import { unstable_createMuiStrictModeTheme as createTheme } from '@material-ui/core';

import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createTheme({
	palette: {
		primary: {
			main: '#556cd6',
		},
		secondary: {
			main: '#19857b',
		},
		error: {
			main: red.A400,
		},
		background: {
			default: '#fff',
		},
	},
});

export default theme;
