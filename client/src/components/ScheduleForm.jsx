import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../actions';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import * as React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; 
import timezone from 'dayjs/plugin/timezone'; 
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


dayjs.extend(utc); 
dayjs.extend(timezone); 
function ScheduleForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const [scheduleName, setScheduleName] = useState('');

  let currentUserState = useSelector((state) => state.userInfo.currentUser);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(scheduleName)

    try{
      const response = await axios.post('http://localhost:3000/schedule', {
        userId: currentUserState.id,
        scheduleName: scheduleName
      });

      console.log("before dispatch",currentUserState)

    } catch (e) {
      console.error(e);
    }
      setErrorMessage('');
  };

  return (
    <div>
      <h2>Create Schedule</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleFormSubmit}>
        <TextField
          type="text"
          name="scheduleName"
          label="Schedule Name"
          value={scheduleName}
          onChange={(newValue) => setScheduleName(newValue.target.value)}
        />
        <button type="submit">Create Schedule</button>
      </form>
    </div>
  );
}

export default ScheduleForm;


