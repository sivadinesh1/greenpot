import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Image from 'next/image';

export default function DeleteDialog(props) {
	const descriptionElementRef = React.useRef(null);

	useEffect(() => {
		console.log('object....in delete blog.' + props.open);
	});

	return (
		<div>
			<Dialog open={props.open} onClose={props.handleClose}>
				<DialogContent style={{ width: '500px' }}>
					<div className='dialog_pop'>
						<div style={{ fontSize: '20px' }}>{props.windowTitle}</div>
						<div style={{ cursor: 'pointer' }}>
							<Image src='/static/images/close.svg' alt='edit' width='16px' height='16px' onClick={props.handleClose} />
						</div>
					</div>

					<div>
						<p>
							You are about to delete <b>{props.title}</b>.
						</p>
						<p>{props.deleteMessage}</p>
					</div>

					<div className='action_btns'>
						<Button onClick={props.handleClose} disableFocusRipple disableElevation style={{ margin: '6px 10px' }}>
							Cancel
						</Button>
						<Button
							variant='contained'
							style={{ margin: '6px 10px', backgroundColor: '#af0404', color: '#fff' }}
							onClick={props.confirmDelete}
							type='button'
							// className={styles.submit_button}
							disableFocusRipple
							disableElevation>
							Yes, delete it
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
