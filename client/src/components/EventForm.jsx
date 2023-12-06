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
function EventForm() {
  dayjs.tz.setDefault('America/New_York');
  const [startDateTime, setStartDateTime] = React.useState(dayjs().tz('America/New_York'));
  const [endDateTime, setEndDateTime] = React.useState(dayjs().tz('America/New_York'));
  const [errorMessage, setErrorMessage] = useState('');
  const [eventData, setEventData] = useState({
    eventName: '',
    dateTime: new Date(), // Initialize with the current date and time
    description: '',
  });
  const [desc, setDesc]= React.useState('')
  const [eventName, setEventName]= React.useState('')
  const [color, setColor] = React.useState('');

  const handleChange = (event) => {
    setColor(event.target.value);
  };

  const dispatch = useDispatch();
  let currentUserState = useSelector((state) => state.userInfo.currentUser);

      
 


  // const handleInputChange = (e) => {
  //   setEventData({
  //     ...eventData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleDateTimeChange = (dateTime) => {
  //   setEventData({
  //     ...eventData,
  //     dateTime,
  //   });
  // };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!endDateTime.isAfter(startDateTime)) {
      console.error('End date must be greater than start date');
      setErrorMessage('End date must be strictly greater than start date.');
      return;
    }
    let obj={
      eventName,
      desc,
      startDateTime,
      endDateTime,
      color
    }
    console.log(obj)

    try{
      const response = await axios.post('http://localhost:3000/event', {
        userId: currentUserState.id,
        obj,
      });
    }
    catch(e){
      console.error(e);
    }
    // try {
    //   // Call API to create event
      // const response = await axios.post('http://localhost:3000/events/create', {
      //   userId: currentUser.id,
      //   eventData,
      // });

      // // Update Redux state with the new event
      // dispatch(actions.addEvent(response.data.event));
     
      // Clear form data
      setEventName('');
      setDesc('');
      setStartDateTime(dayjs().tz('America/New_York'));
      setEndDateTime(dayjs().tz('America/New_York'));
      setColor('');
      setErrorMessage('');
      setEventData({
        eventName: '',
        dateTime: '',
        description: '',
      });
    // } catch (error) {
    //   console.error('Error creating event:', error);
    // }
  };

  return (
    <div>
      <h2>Create Event</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleFormSubmit}>
        {/* Form fields for event details */}
        <TextField
          type="text"
          name="eventName"
          label="Event Name"
          value={eventName}
          onChange={(newValue) => setEventName(newValue.target.value)}
        />

        {/* DateTimePicker for date and time */}
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateTimePicker']}>
          <DateTimePicker label="Date and Time"  value={eventData.dateTime}
            onChange={handleDateTimeChange}
            defaultValue={dayjs('2022-04-17T15:30')}
            renderInput={(props) => <TextField {...props}/>}/>
        </DemoContainer>
      </LocalizationProvider> */}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        <DateTimePicker
          label="Controlled picker"
          value={startDateTime}
          onChange={(newValue) => setStartDateTime(newValue)}
        />
      </DemoContainer>
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        <DateTimePicker
          label="Controlled picker"
          value={endDateTime}
          onChange={(newValue) => setEndDateTime(newValue)}
        />
      </DemoContainer>
      </LocalizationProvider>

      <InputLabel id="demo-simple-select-label">Color</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={color}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={"Red"}>Red</MenuItem>
          <MenuItem value={"Blue"}>Blue</MenuItem>
          <MenuItem value={"Yellow"}>Yellow</MenuItem>
        </Select>

        <TextField
          type="text"
          name="description"
          label="Description"
          value={desc}
          onChange={(newValue) => setDesc(newValue.target.value)}
        />

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default EventForm;


