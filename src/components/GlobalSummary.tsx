import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Chip } from "@mui/material"
import AdjustIcon from '@mui/icons-material/Adjust';
import { IGlobalSummary } from "../interfaces/IGlobalSummary";
import { IGlobalSummaryProps } from "../interfaces/IWord";
import { FC } from "react";

export const GlobalSummary: FC<IGlobalSummaryProps> = ({ value, currentCycle }): JSX.Element => {

    return <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <nav aria-label="main mailbox folders">
            <List>
                <ListItem>

                    <ListItemIcon>
                        <Chip label={value.Unknow} />
                    </ListItemIcon>
                    <ListItemText primary="Unknow" />
                    {currentCycle == 0 && <AdjustIcon />}
                </ListItem>

                <ListItem>

                    <ListItemIcon>
                        <Chip label={value.Recongnized} />
                    </ListItemIcon>
                    <ListItemText primary="Recongnized" />
                    {currentCycle == 1 && <AdjustIcon />}
                </ListItem>
                <ListItem>

                    <ListItemIcon>
                        <Chip label={value.Known} />
                    </ListItemIcon>
                    <ListItemText primary="Known" />
                    {currentCycle == 2 && <AdjustIcon />}
                </ListItem>
                <ListItem>

                    <ListItemIcon>
                        <Chip label={value.Discovered} />
                    </ListItemIcon>
                    <ListItemText primary="Discovered" />
                    {currentCycle == 3 && <AdjustIcon />}
                </ListItem>
                <Divider />
                <ListItem>

                    <ListItemIcon>
                        <Chip label={value.Learned} />
                    </ListItemIcon>
                    <ListItemText primary="Learned" />

                </ListItem>
                <ListItem>

                    <ListItemIcon>
                        <Chip label={value.Total} />
                    </ListItemIcon>
                    <ListItemText primary="Total" />

                </ListItem>
            </List>
        </nav>

    </Box>
}