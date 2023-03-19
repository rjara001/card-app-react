import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AnimationIcon from '@mui/icons-material/Animation';
import HomeIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { makeStyles } from '@material-ui/styles';
import { useNavigate } from 'react-router-dom';
import { MENU } from '../constants/menu';

interface Props {
    value: number;
}

const useStyles = makeStyles({
    teste: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        width: '100%',
    },
    geral: {
        "margin-top": "30px"
    }
});

export const MainMenu = (props: Props) => {
    const classes = useStyles();
    const navigate = useNavigate();


    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        // navigate to the appropriate route based on the selected Bottom Navigation item
        switch (newValue) {
            case MENU.Home:
                navigate('/');
                break;
            case MENU.Play:
                navigate('/play');
                break;
            case MENU.Groups:
                navigate('/groups');
                break;
            case MENU.Settings:
                navigate('/settings');
                break;
        }

    };

    return (
        <Box sx={{ width: 500 }}>
            <BottomNavigation
                showLabels
                className={classes.teste}
                value={props.value}
                onChange={handleChange}
            >
                <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction label="Jugar" icon={<PlayArrowIcon />} />
                <BottomNavigationAction label="Groups" icon={<AnimationIcon />} />
                <BottomNavigationAction label="Settings" icon={<LocationOnIcon />} />
            </BottomNavigation>
        </Box>
    );
}