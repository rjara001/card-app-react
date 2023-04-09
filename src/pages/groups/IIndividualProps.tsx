import * as Yup from 'yup';
import { IIndividualProps } from "./IndividualType";
import { Grid, TextField, Button } from "@mui/material";
import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useState } from "react";
import { Word } from '../../models/Word';

const useStyles = makeStyles({
    rigthButton: {
        textAlign: 'right'
    },
});

export const IndividualEdit: React.FC<IIndividualProps> = ({ word, handleSaveClick }) => {
  const classes = useStyles();
  const [name, setName] = useState(word.Name);
  const [value, setValue] = useState(word.Value);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Value must be at least 3 characters')
      .required('Name is required'),
    value: Yup.string()
      .min(3, 'Value must be at least 3 characters')
      .required('Value is required'),
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formValues = {
      name,
      value,
    };
    validationSchema
      .validate(formValues, { abortEarly: false })
      .then(() => {
        // Validation passed, call handleSaveClick
        handleSaveClick(Word.newWord2(name, value));
      })
      .catch((errors) => {
        // Validation failed, handle errors
        console.log(errors);
      });
  };

  const handleChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  const handleChangeValue = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  return (
  
      <Grid container spacing={3} id="paso1">
        <Grid container item spacing={1} direction="column" justifyContent="center">
          <Grid item>
            <TextField
              sx={{ width: '100%' }}
              placeholder="Text"
              onChange={handleChangeName}
              value={name}
              id="Name"
              name="Name"
              label="Word Name"
              variant="outlined"
            />
          </Grid>

          <Grid item>
            <TextField
              sx={{ width: '100%' }}
              placeholder="Value"
              onChange={handleChangeValue}
              value={value}
              id="Value"
              name="Value"
              label="Word Value"
              variant="outlined"
            />
          </Grid>

          {/* Save button */}
          <Grid item className={classes.rigthButton}>
            <Button onClick={handleSubmit}>Save</Button>
          </Grid>
        </Grid>
      </Grid>
  );
};
