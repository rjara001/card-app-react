import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Avatar } from '@mui/material';
import { AccountCircle, ArrowBack } from '@mui/icons-material';

interface Props {
  title: string;
  hasBack?: boolean;
}

const Header: React.FC<Props> = ({ title, hasBack }) => {
    const navigate = useNavigate();

  const handleBackClick = () => {
   
    navigate(-1);
    
  };

  return (
    <><AppBar position="static">
   
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Avatar sx={{ width: 50, height: 50, position: 'relative',left: '-20px' }}>
              <AccountCircle  style={{ fontSize: 58 }}/>
            </Avatar>
              <IconButton edge="start" color="inherit" onClick={handleBackClick} sx={{ marginRight: 2 }}>
                  {hasBack===true && <ArrowBack />}
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                  {title}
              </Typography>

          </Toolbar>

      </AppBar><div style={{ height: 30 }} /></>
  );
}

Header.defaultProps = {
    hasBack: false
  };

export default Header;
