import { makeStyles } from '@material-ui/styles';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Login } from '../components/Login';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: 4,
    textAlign: 'center'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
    position: 'fixed',
    top: '10px'
  },
  description: {
    fontSize: '1.5rem',
    textAlign: 'center',
    marginBottom: 4,
  },
  button: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    padding: `2px 4px`,
    borderRadius: '50px',
  },
}));

export const MainPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h1" className={classes.title}>
        FladyCard
      </Typography>
      <Typography variant="h4" className={classes.description}>
        Login
      </Typography>
      <Typography variant="body1" className={classes.description}>
        {/* Expand your vocabulary by learning, memorizing, and playing */}
      </Typography>

      <Login></Login>
    </div>
  );
}