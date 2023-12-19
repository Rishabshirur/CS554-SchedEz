// import React, { useState, useEffect } from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import { getAuth } from 'firebase/auth';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import axios from 'axios';
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import { useSelector } from 'react-redux';

// const localizer = momentLocalizer(moment);

// const EventDetails = ({ event, onClose }) => (
//   <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '10px', backgroundColor: 'white', borderTop: '1px solid #ccc' }}>
//     <h2>{event.title}</h2>
//     <p>Start: {event.start.toString()}</p>
//     <p>End: {event.end.toString()}</p>
//     {/* Add more event details as needed */}
//     <button onClick={onClose} style={{ padding: '8px', background: 'blue', color: 'white', cursor: 'pointer' }}>
//       Close
//     </button>
//   </div>
// );

// const EventCalendar = ({ shouldUpdateCalendar }) => {
//   const [events, setEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [checkboxOptions, setCheckboxOptions] = useState(null);
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   var currentUser = useSelector((state) => state.userInfo.currentUser);
//   let auth = getAuth();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/event/${auth.currentUser.uid}`);
//         setEvents(response.data.events);

//         const response1 = await axios.get(`http://localhost:3000/schedule/${auth.currentUser.uid}`);
//         setCheckboxOptions(response1.data.schedules);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//       }
//     };

//     fetchData();
//   }, [auth.currentUser.uid, currentUser, shouldUpdateCalendar]);

//   const formatEvents = (events) => {
//     const filteredEvents = events.filter((event) => {
//       if (selectedOptions.length === 0) return true;
//       return selectedOptions.some((option) =>
//         event?.schedule_name?.toLowerCase().includes(option.toLowerCase())
//       );
//     });

//     return filteredEvents.map((event) => ({
//       title: event.event_name,
//       start: new Date(event.start_datetime),
//       end: new Date(event.end_datetime),
//       color: event.color_code,
//       classification: event.classification,
//     }));
//   };

//   const handleSelectEvent = (event) => {
//     setSelectedEvent(event);
//   };

//   const closeEventDetails = () => {
//     setSelectedEvent(null);
//   };

//   const handleCheckboxChange = (event) => {
//     const value = event.target.value;
//     setSelectedOptions((prev) => {
//       if (prev.includes(value)) {
//         return prev.filter((option) => option !== value);
//       } else {
//         return [...prev, value];
//       }
//     });
//   };

//   return (
//     <div>
//       {checkboxOptions &&
//         checkboxOptions.map((option) => (
//           <FormControlLabel
//             key={option.schedule_name}
//             control={
//               <Checkbox
//                 checked={selectedOptions.includes(option.schedule_name)}
//                 onChange={handleCheckboxChange}
//                 value={option.schedule_name}
//                 style={{ color: option.color }} // Set checkbox color based on schedule color
//               />
//             }
//             label={option.schedule_name}
//           />
//         ))}
//       <Calendar
//         localizer={localizer}
//         events={formatEvents(events)}
//         startAccessor="start"
//         endAccessor="end"
//         eventPropGetter={(event) => ({
//           style: {
//             backgroundColor: event.color,
//             borderRadius: '5px',
//             opacity: 0.8,
//             color: 'white',
//             border: '0px',
//             display: 'block',
//             cursor: 'pointer',
//           },
//         })}
//         style={{ height: 500, margin: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}
//         onSelectEvent={handleSelectEvent}
//       />
//       {selectedEvent && <EventDetails event={selectedEvent} onClose={closeEventDetails} />}
//     </div>
//   );
// };

// export default EventCalendar;



import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { getAuth } from 'firebase/auth';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSelector } from 'react-redux';

const localizer = momentLocalizer(moment);

const EventDetails = ({ event, onClose }) => (
  <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '10px', backgroundColor: '#f8f8f8', borderTop: '1px solid #ccc' }}>
    <h2 style={{ color: '#333', marginBottom: '10px' }}>{event.title}</h2>
    <p style={{ color: '#555', marginBottom: '5px' }}>Start: {event.start.toString()}</p>
    <p style={{ color: '#555', marginBottom: '10px' }}>End: {event.end.toString()}</p>
    
    <button onClick={onClose} style={{ padding: '8px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
      Close
    </button>
  </div>
);

const EventCalendar = ({ shouldUpdateCalendar }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [checkboxOptions, setCheckboxOptions] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  var currentUser = useSelector((state) => state.userInfo.currentUser);
  let auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/event/${auth.currentUser.uid}`);
        setEvents(response.data.events);

        const response1 = await axios.get(`http://localhost:3000/schedule/${auth.currentUser.uid}`);
        setCheckboxOptions(response1.data.schedules);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchData();
  }, [auth.currentUser?.uid, currentUser, shouldUpdateCalendar]);

  const formatEvents = (events) => {
    const filteredEvents = events.filter((event) => {
      if (selectedOptions.length === 0) return true;
      return selectedOptions.some((option) => event?.schedule_name?.toLowerCase().includes(option.toLowerCase()));
    });

    return filteredEvents.map((event) => ({
      title: event.event_name,
      start: new Date(event.start_datetime),
      end: new Date(event.end_datetime),
      color: event.color_code,
      classification: event.classification,
    }));
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedOptions((prev) => {
      if (prev.includes(value)) {
        return prev.filter((option) => option !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>Event Calendar</h2>
      <div style={{ marginBottom: '20px' }}>
        {checkboxOptions &&
          checkboxOptions.map((option) => (
            <FormControlLabel
              key={option.schedule_name}
              control={
                <Checkbox
                  checked={selectedOptions.includes(option._id)}
                  onChange={handleCheckboxChange}
                  value={option._id}
                  style={{ color: option.color, marginRight: '5px' }}
                />
              }
              label={option.schedule_name}
            />
          ))}
      </div>
      <Calendar
        localizer={localizer}
        events={formatEvents(events)}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block',
            cursor: 'pointer',
          },
        })}
        style={{ height: 500, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}
        onSelectEvent={handleSelectEvent}
      />
      {selectedEvent && <EventDetails event={selectedEvent} onClose={closeEventDetails} />}
    </div>
  );
};

export default EventCalendar;
