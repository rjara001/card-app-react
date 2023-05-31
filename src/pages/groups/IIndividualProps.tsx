import * as Yup from 'yup';
import { IIndividualProps } from "./IndividualType";
import { Grid, TextField, Button, Chip } from "@mui/material";
import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useEffect, useState } from "react";
import { Word } from '../../models/Word';
import { group } from 'console';
import { userInfo } from 'os';

const useStyles = makeStyles({
  rigthButton: {
    textAlign: 'right'
  },
});

export const IndividualEdit: React.FC<IIndividualProps> = ({ word, userInfo, filter, handleWorldChanged, handleSaveClick }) => {
  const classes = useStyles();
  const [name, setName] = useState(word.Name);
  const [value, setValue] = useState(word.Value);
  const [filterActive, setFilterActive] = useState(false);

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
    handleWorldChanged(event.target.value, 'Name');
  }, []);

  const handleChangeValue = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    handleWorldChanged(event.target.value, 'Value');
  }, []);

  const handleDelete = () => {

    setFilterActive(false);
  };

  useEffect(() => {
    if (filter.length > 0) {
      setFilterActive(true);
      if (filter.length>0)
        if (userInfo.FirstShowed)
          setName(filter);
        else
          setValue(filter);
    }

  }, [])
  return (

    <Grid container spacing={3}>
      <Grid container item spacing={1} direction="column" justifyContent="center">
 
        <Grid item>
          <TextField
            sx={{ width: '100%' }}
            placeholder="Text"
            onChange={handleChangeName}
            value={name}
            id="Name"
            size="small"
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
            size="small"
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
