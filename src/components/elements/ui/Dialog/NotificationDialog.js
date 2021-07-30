import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function NotificationDialog(props) {
    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (props.open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [props.open]);

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                scroll='paper'
                aria-labelledby='scroll-dialog-title'
                aria-describedby='scroll-dialog-description'>
                <DialogTitle id='scroll-dialog-title'>{props.title}</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>
                        {props.children}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color='primary'>
						Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
