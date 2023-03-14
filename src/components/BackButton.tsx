import { makeStyles } from '@material-ui/styles';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React from 'react';

const useStyles = makeStyles({
  button: {
    margin: '8px',
  },
});

const BackButton = (): JSX.Element => {
  const classes = useStyles();

  const handleClick = (): void => {
    window.history.back();
  };

  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.button}
      startIcon={<ArrowBackIcon />}
      onClick={handleClick}
    >
      Back
    </Button>
  );
};

export default BackButton;