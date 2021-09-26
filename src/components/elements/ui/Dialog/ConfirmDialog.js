import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ConfirmDialog(props) {
	const descriptionElementRef = React.useRef(null);

	return (
		<div>
			<Dialog open={props.open} onClose={props.handleClose} scroll='paper'>
				<DialogContent dividers={true}>
					<div>{props.title}</div>
					<DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>
						{props.children}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={props.handleClose} color='primary'>
						Cancel
					</Button>
					<Button onClick={props.handleConfirm} color='primary'>
						Continue
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
