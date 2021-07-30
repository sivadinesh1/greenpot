import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const SnackBar = (props) => {
	function Alert(props) {
		return <MuiAlert elevation={6} variant='filled' {...props} />;
	}

	return (
		<>
			<Snackbar open={props.open} autoHideDuration={3000} onClose={props.handleClose}>
				<Alert onClose={props.handleClose} severity='success'>
					{props.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default SnackBar;
