import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Chip } from "@mui/material"
import InboxIcon from '@mui/icons-material/Inbox';
import { IGlobalSummary } from "../interfaces/IGlobalSummary";
import { IGlobalSummaryProps } from "../interfaces/IWord.js";
import { FC } from "react";

export const GlobalSummary:FC<IGlobalSummaryProps> = ({value}): JSX.Element  => {

    return <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <nav aria-label="main mailbox folders">
            <List>
                <ListItem>

                    <ListItemIcon>
                        <Chip label={value.Unknow} />
                    </ListItemIcon>
                    <ListItemText primary="Unknow" />

                </ListItem>
                <ListItem>

                    <ListItemIcon>
                        <Chip label={value.Learned} />
                    </ListItemIcon>
                    <ListItemText primary="Learned" />

                </ListItem>
                <ListItem>

                    <ListItemIcon>
                        <Chip label={value.Recongnized} />
                    </ListItemIcon>
                    <ListItemText primary="Recongnized" />

                </ListItem>
                <ListItem>

                    <ListItemIcon>
                        <Chip label={value.Known} />
                    </ListItemIcon>
                    <ListItemText primary="Known" />

                </ListItem>
                <ListItem>

                    <ListItemIcon>
                        <Chip label={value.Discovered} />
                    </ListItemIcon>
                    <ListItemText primary="Discovered" />

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