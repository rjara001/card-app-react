import MeetingRoomOutlinedIcon from '@material-ui/icons/MeetingRoomOutlined';
import { Button } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../../context/context.user';
import { User } from '../../models/User';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
    button: {
      margin: '1px',
    },
  }));
  
export const GoogleButtonLogout = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const { updateValue, userInfo } = useContext(UserContext);


    const handleLogoutSuccess = ()=>{
        updateValue(User.LoginClean(userInfo));

        navigate('/');
    }
    return (


        <Button onClick={handleLogoutSuccess}
            variant="contained"
            className={classes.button}
            startIcon={<MeetingRoomOutlinedIcon />}
        >
            Logout
        </Button>
    )
}