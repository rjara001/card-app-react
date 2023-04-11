import { makeStyles } from '@material-ui/styles';
import { Divider, Typography } from '@mui/material';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    margin: 2,
  },
  divider: {
    flexGrow: 1,
    height: '1px',
    // backgroundColor: theme.palette.text.primary,
    margin: '0px 1px',
  },
  text: {
    // color: theme.palette.text.primary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
}));

export const Separator = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Divider className={classes.divider} />
      <Typography className={classes.text} variant="body1">or</Typography>
      <Divider className={classes.divider} />
    </div>
  );
};