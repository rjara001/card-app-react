import { useState } from 'react';
import { Grid, TextareaAutosize, Button } from '@mui/material';
import { makeStyles } from '@material-ui/styles';

interface IEditBatchProps {
  handleSaveBatchClick: (text: string) => void;
}

const useStyles = makeStyles({
  rigthButton: {
      textAlign: 'right'
  },
});

const EditBatch: React.FC<IEditBatchProps> = ({ handleSaveBatchClick }) => {
  const [textBatch, setTextBatch] = useState('');
  const classes = useStyles();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextBatch(e.target.value);
  };

  return (
    <Grid>
      <TextareaAutosize
        maxRows={100}
        aria-label="maximum height"
        placeholder="Word1;Word2&#10;Word1;Word2"
        defaultValue=""
        onChange={handleChange}
        value={textBatch}
        style={{ height: '400px', width: '100%' }}
      />
      <Grid item className={classes.rigthButton}>
        <Button onClick={()=>handleSaveBatchClick(textBatch)}>Save</Button>
      </Grid>
    </Grid>
  );
};

export default EditBatch;
