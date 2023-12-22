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
import Button from '@mui/material/Button';
import { getAuth } from 'firebase/auth';

dayjs.extend(utc); 
dayjs.extend(timezone); 
function ScheduleForm({ onUpdateCalendar }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [scheduleName, setScheduleName] = useState('');

  let currentUserState = useSelector((state) => state.userInfo.currentUser);
  let auth = getAuth();
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if(typeof scheduleName !== "string" ){
      setErrorMessage('Schedule name must be a string')
      return;
    }

    if(scheduleName.trim().length === 0){
      setErrorMessage('Schedule name must be a non-empty string.')
      return;
    }

    if (!/^[A-Za-z0-9\s]*$/.test(scheduleName.trim())) {
      setErrorMessage('Schedule name must be a alphanumeric with spaces.' );
      return;
    }

    try{
      const response1 = await axios.get(`http://localhost:3000/schedule/${auth.currentUser.uid}`);
      const existingSchedules = response1.data.schedules;
      const existingScheduleNames = existingSchedules.map(schedule => schedule.schedule_name);

      if(existingScheduleNames.includes(scheduleName.trim())){
        setErrorMessage('A Schedule with the same Name already exists')
        return
      }
      console.log('exiting Schedules',existingSchedules)
      const response = await axios.post('http://localhost:3000/schedule', {
        userId: currentUserState.id,
        scheduleName: scheduleName.trim()
      });

      console.log("before dispatch",currentUserState)
      onUpdateCalendar();
    } catch (e) {
      console.error(e);
    }
      setErrorMessage('');
  };

  return (
    <div style={styles.container}>
      <h2>Create Schedule</h2>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      <form onSubmit={handleFormSubmit} style={styles.form}>
        <TextField
          type="text"
          name="scheduleName"
          label="Schedule Name"
          value={scheduleName}
          onChange={(newValue) => setScheduleName(newValue.target.value)}
          variant="outlined"
          style={styles.input}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={styles.button}
        >
          Create Schedule
        </Button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  input: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
  error: {
    color: 'red',
  },
};

export default ScheduleForm;


