import { makeStyles } from "@material-ui/styles";
import { Typography } from "@mui/material";
import { ReactNode } from "react";


interface SubtitleProps {
  children: ReactNode;
}

const useStyles = makeStyles({
  subtitleContainer: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
    height: '100%',
  },
});

const Subtitle: React.FC<SubtitleProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.subtitleContainer}>
      <Typography variant="subtitle1" gutterBottom>
        {children}
      </Typography>
    </div>
  );
};

export default Subtitle;