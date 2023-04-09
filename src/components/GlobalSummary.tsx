import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Chip } from "@mui/material"
import AdjustIcon from '@mui/icons-material/Adjust';
import { IGlobalSummary } from "../interfaces/IGlobalSummary";
import { IGlobalSummaryProps } from "../interfaces/IWord";
import { FC } from "react";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
    listItem: {
      paddingTop: '2px',
      paddingBottom: '2px',
      paddingLeft: '6px'
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
                    <Chip label={value.Unknow} />

                </ListItem>}
                {value.Discovered + value.Unknow > 0 &&  <ListItem className={classes.listItem}>

                    <ListItemIcon>
                        {currentCycle == 1 && <AdjustIcon />}
                    </ListItemIcon>
                    <ListItemText primary="Discovered" />
                    <Chip label={value.Discovered} />
                </ListItem>}
                {value.Recongnized + value.Discovered + value.Unknow > 0 &&  <ListItem className={classes.listItem}>

                    <ListItemIcon>
                        {currentCycle == 2 && <AdjustIcon />}
                    </ListItemIcon>
                    <ListItemText primary="Recongnized" />
                    <Chip label={value.Recongnized} />
                </ListItem>}
                {value.Known + value.Recongnized + value.Discovered + value.Unknow >0 &&  <ListItem className={classes.listItem}>

                    <ListItemIcon>
                        {currentCycle == 3 && <AdjustIcon />}
                    </ListItemIcon>
                    <ListItemText primary="Known" />

                    <Chip label={value.Known} />
                </ListItem>}

                <Divider />
                 <ListItem className={classes.listItem}>

                    <ListItemIcon>

                    </ListItemIcon>
                    <ListItemText primary="Learned" />
                    <Chip label={value.Learned} />
                </ListItem>
                 <ListItem className={classes.listItem}>

                    <ListItemIcon>

                    </ListItemIcon>
                    <ListItemText primary="Total" />
                    <Chip label={value.Total} />
                </ListItem>
            </List>
        </nav>

    </Box>
}