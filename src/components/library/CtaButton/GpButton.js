import { Button } from '@material-ui/core';


const GpButton = (props) => {
    const { label, type, variant, color, width } = props
    if (type === undefined) {
        return (
            <>
                <Button
                    variant={variant === undefined ? "contained" : variant}
                    color={color === undefined ? "primary" : color}
                    style={{
                        width: width === undefined ? '100%' : width,
                        backgroundColor: "red"
                    }}
                >{label}</Button>
            </>

        )
    } else if (type === 'submit') {
        return (
            <>
                <Button
                    variant={variant === undefined ? "contained" : variant}
                    color={color === undefined ? "primary" : color}
                    style={{ width: width === undefined ? '100%' : width }}
                    type="submit"
                >{label}</Button>
            </>

        )
    }



}

export default GpButton;

