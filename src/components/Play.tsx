import { CardContent, Typography, CardActions, Button, Box, Card, TextField, Grid, Badge, Divider, Stack, Chip, IconButton, AlertColor } from "@mui/material";
import React, { createContext, FC, useContext, useEffect, useState } from "react";
import { useGlobalStyles } from "../global.style";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import StarIcon from '@mui/icons-material/Star';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { IWord, IWordProps } from "../interfaces/IWord";
import { ofuscator } from "../util/util";

import { PlayContext, UserContext } from "../context/context.create";
import { Word } from "../models/Word";
import { makeStyles } from "@material-ui/styles";
import { MessageDialog } from "../elements/Messages/MessageDialog";

const useStyles = makeStyles({
    button: {
        margin: '8px 8px 8px 0'
        , textAlign: 'right'
    },

    list: {
        maxWidth: 'none'
    }
});

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


const Text = (word: Word) => {
    const { userInfo } = useContext(UserContext);

    return (<Box>
        <Typography variant="h6" component="div" style={{ paddingTop: '10px' }}>
            {word.getName(userInfo.FirstShowed)}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {word.Reveled && word.getValue(userInfo.FirstShowed)}
            {!word.Reveled && ofuscator(word.getValue(userInfo.FirstShowed))}
        </Typography>
    </Box>)
};
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
                {Text(Word.newWord(word))}
            </>

        </CardContent>

        {Actions(next, revel, correct)}

    </React.Fragment>
);

export const Play: FC<IWordProps> = ({ word, next, revel, correct }): JSX.Element => {
    const global = useGlobalStyles();
    const classes = useStyles();
    const [textMatch, setTextMatch] = useState('')
    const { userInfo } = useContext(UserContext);
    const [messageMatch, setMessageMatch] = useState('');
    const [openMessageMatch, setOpenMessageMatch] = useState<boolean>(false);
    const [severity, setSeverity] = useState<AlertColor>('success');
    const handleMatchClick = () => {
  
        const similarity = Word.similarity(textMatch, word.getName(!userInfo.FirstShowed));

        if (similarity>=0.75)
            {
                setMessageMatch(`Good!, you got a ${Math.round(similarity*100).toString()} and attain 75% waiting`);
                correct(word);
                setSeverity('success');
                setTextMatch('');
            }
        else
           {
             setMessageMatch(`You weren't able to attain an ${Math.round(similarity*100).toString()}`);
             setSeverity('warning');
            }
        
            setOpenMessageMatch(true);
    }

    return (
        <>
            <MessageDialog open={openMessageMatch} message={messageMatch} onClose={()=>setOpenMessageMatch(false)} severity={severity}></MessageDialog>

            <Grid className={global.p10}>
                <Box sx={{ minWidth: 275 }}>
                    <Card variant="outlined">{card(word, next, revel, correct)}</Card>
                    <div style={{ paddingTop: '10px' }}>
                        <Grid container>
                            <Grid xs={10} sm={10}>
                                <TextField style={{ width: "100%" }} value={textMatch} onChange={(e)=>setTextMatch(e.target.value)}></TextField>
                            </Grid>
                            <Grid xs={2} sm={2}>
                                <IconButton aria-label="add" size="large" color="success" disabled={word.Reveled}>
                                    <ArrowCircleRightIcon fontSize="inherit" sx={{ fontSize: 40 }} onClick={handleMatchClick} />
                                </IconButton>
                            </Grid>
                        </Grid>

                        <div className={classes.button}>

                        </div>
                    </div>

                </Box>
            </Grid>
        </>
    );
}