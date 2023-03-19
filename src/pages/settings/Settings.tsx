import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import React, { useContext, useState } from 'react';
import { UserContext } from "../../context/context.create";
import { IUserInfo } from '../../interfaces/IUserInfo.js';

export function SettingsPage() {
    const { userInfo, updateValue } = useContext(UserContext);
//   const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    // setIsToggled(!isToggled);
    userInfo.FirstShowed = !userInfo.FirstShowed;
    updateValue(userInfo);
  };

  return (
    <div>
      <h1>Settings</h1>
      <FormControlLabel
        control={<Switch checked={userInfo.FirstShowed} onChange={handleToggle} color="primary" />}
        label="Turn the card"
        labelPlacement="start"
      />

    </div>
  );
};