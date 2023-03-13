import { CardContent, Typography, CardActions, Button, Box, Card, TextField, Grid, Badge, Divider, Stack, Chip } from "@mui/material";
import React, { createContext, FC, useContext } from "react";
import { useGlobalStyles } from "../../global.style";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import StarIcon from '@mui/icons-material/Star';
import { IWord, IWordProps } from "../../interfaces/IWord";
import { ofuscator } from "../../util/util";

import { PlayContext } from "../../context/context.create";

const Score = () => {
    const { summary } = useContext(PlayContext);

    return <Stack spacing={2} direction="row" style={{
        width: '100%', display: 'flex',
        justifyContent: 'space-between',
    }}>

        <div>
            <Stack spacing={2} direction="row">
                <Badge badgeContent={summary.Summary.ok} color="primary">
                    <ThumbUpAltIcon color="action" style={{ paddingBottom: '5px' }} />
                </Badge>
                <Badge badgeContent={summary.Summary.bad} color="warning">
                    <ThumbDownAltIcon color="action" style={{ paddingBottom: '5px' }} />
                </Badge>
            </Stack>

        </div>

        <div>
            <Badge badgeContent={summary.Learned} color="success">
                    <StarIcon color="action" style={{ paddingBottom: '5px' }} />
            </Badge>

        </div>


    </Stack>
};


const Text = (word: IWord) => <Box>
    <Typography variant="h6" component="div" style={{ paddingTop: '10px' }}>
        {word.name}
    </Typography>
    <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {word.reveled && word.value}
        {!word.reveled && ofuscator(word.value)}
    </Typography>
</Box>;
const Actions = (next: any, revel: any, correct: any) => <div style={{
    width: '100%', display: 'flex',
    justifyContent: 'space-between',
}}>

    <div>
        <Button size="small" onClick={() => {
            next();
        }}>Next</Button>
        <Button size="small" onClick={() => {
            revel();
        }}>Reveal</Button>
    </div>

    <div>
        <Button size="small" onClick={() => {
            correct();
        }}>Correct</Button>
    </div>
</div>;
const card = (word: IWord, next: any, revel: any, correct: any) => (
    <React.Fragment>
        <CardContent>
            <>
                {Score()}
                <Divider />
                {Text(word)}
            </>

        </CardContent>

        {Actions(next, revel, correct)}

    </React.Fragment>
);

export const Play: FC<IWordProps> = ({ word, next, revel, correct }): JSX.Element => {
    const classes = useGlobalStyles();

    return (
        <>

            <Grid className={classes.p10}>
                <Box sx={{ minWidth: 275 }}>
                    <Card variant="outlined">{card(word, next, revel, correct)}</Card>
                </Box>

            </Grid>
        </>
    );
}