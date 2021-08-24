import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

export default ColorButton = withStyles(() => ({
    root: {
        color: '#000',
        backgroundColor: '#fff',
        '&:hover': {
            backgroundColor: '#f0f0ff',
        },
    },
}))(Button);