import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Chip, Typography } from "@mui/material"
import AdjustIcon from '@mui/icons-material/Adjust';
import { IGlobalSummary } from "../interfaces/IGlobalSummary";
import { IGlobalSummaryProps } from "../interfaces/IWord";
import { FC } from "react";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
    listItem: {
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: '2px'
    },
  }));

export const GlobalSummary: FC<IGlobalSummaryProps> = ({ value, currentCycle }): JSX.Element => {
    const classes = useStyles();
    
    return <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <nav aria-label="main mailbox folders">
            <List>
                {value.Unknow > 0 && <ListItem className={classes.listItem}>

                    <ListItemIcon>
                        {currentCycle == 0 && <AdjustIcon />}
                    </ListItemIcon>
                    <ListItemText primary="Unknow" />
                    <div>{value.Unknow}</div>

                </ListItem>}
                {value.Discovered + value.Unknow > 0 &&  <ListItem className={classes.listItem}>

                    <ListItemIcon>
                        {currentCycle == 1 && <AdjustIcon />}
                    </ListItemIcon>
                    <ListItemText primary="Discovered" />
                    <div>{value.Discovered}</div>
                </ListItem>}
                {value.Recongnized + value.Discovered + value.Unknow > 0 &&  <ListItem className={classes.listItem}>

                    <ListItemIcon>
                        {currentCycle == 2 && <AdjustIcon />}
                    </ListItemIcon>
                    <ListItemText primary="Recongnized" />
                    <div>{value.Recongnized}</div>
                </ListItem>}
                {value.Known + value.Recongnized + value.Discovered + value.Unknow >0 &&  <ListItem className={classes.listItem}>

                    <ListItemIcon>
                        {currentCycle == 3 && <AdjustIcon />}
                    </ListItemIcon>
                    <ListItemText primary="Known" />

                    <div>{value.Known}</div>
                </ListItem>}

                <Divider />
                <ListItem className={classes.listItem}>

                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary={<Typography style={{ color: '#ff6f00' }}>Missing</Typography>} />
                    <div style={{ color: '#ff6f00' }}>{value.Unknow - value.Summary.bad}</div>
                </ListItem>
                 <ListItem className={classes.listItem}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary="Learned" />
                    <div>{value.Learned}</div>
                </ListItem>
                 <ListItem className={classes.listItem}>

                    <ListItemIcon>

                    </ListItemIcon>
                    <ListItemText primary={<Typography style={{ color: '#ff6f00' }}>Total</Typography>} />
                    <div style={{ color: '#ff6f00' }}>{value.Total}</div>
                </ListItem>
            </List>
        </nav>

    </Box>
}