import { makeStyles } from "@material-ui/styles";
import { Typography } from "@mui/material";
import { ReactNode } from "react";

interface TitleProps {
    children: ReactNode;
}

const useStyles = makeStyles({
    titleContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
});



const Title: React.FC<TitleProps> = ({ children }): JSX.Element => {
    const classes = useStyles();


    return (
        <div className={classes.titleContainer}>
            <Typography variant="h5" component="h1" gutterBottom>
                {children}
            </Typography>
        </div>
    );
};

export default Title;