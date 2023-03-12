import { Card, CardContent, Typography, CardActions, Button, Grid, Box } from "@mui/material";
import { useBoxShadowsStyles } from "./BoxShadows.styles";

type Props = {
    children: string | JSX.Element | JSX.Element[]
}

export const BoxShadow = ({ children }: Props) => {
    const classes = useBoxShadowsStyles();

    return (
        <Grid container className={classes.root}>
            <Box>
                {children} </Box>
        </Grid>
    );
}   