import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { getAuth } from 'firebase/auth';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

  
const localizer = momentLocalizer(moment);

const EventDetails = ({ event, onClose }) => (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '10px', backgroundColor: 'white', borderTop: '1px solid #ccc' }}>
      <h2>{event.title}</h2>
      <p>Start: {event.start.toString()}</p>
      <p>End: {event.end.toString()}</p>
      {/* Add more event details as needed */}
      <button onClick={onClose}>Close</button>
    </div>
  );

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  console.log("1",events)
  var currentUser = useSelector((state) => state.userInfo.currentUser);
  console.log("currentuser",currentUser)
  // var events = currentUser.events.organizing;
  let auth = getAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/event/${auth.currentUser.uid}`); // Replace with your actual API endpoint
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchData();
  }, [auth.currentUser.uid,currentUser]);

  const formatEvents = (events) => {
    console.log("2",events)
    return events.map((event) => ({
    //   id: event._id,
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


  return (
    <div>
      <Calendar
        localizer={localizer}
        events={formatEvents(events)}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color,
              borderRadius: '0px',
              opacity: 0.8,
              color: 'black',
              border: '0px',
              display: 'block',
            },
          })}
          style={{ height: 500 }}
          onSelectEvent={handleSelectEvent}
      />

    {selectedEvent && (
        <EventDetails event={selectedEvent} onClose={closeEventDetails} />
      )}
    </div>
  );
};

export default EventCalendar;


// import React from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// const localizer = momentLocalizer(moment);

// const events = [
//   {
//     title: 'Meeting',
//     start: new Date('2023-12-18T20:55:00.000Z'),
//     end: new Date('2023-12-19T21:55:00.000Z'),
//     location: 'Conference Room A',
//     organizer: 'John Doe',
//     description: 'Discuss project updates and plan for the future',
//     color: 'blue', // custom field for event color
//   },
//   {
//     title: 'Lunch',
//     start: new Date('2023-12-19T12:30:00.000Z'),
//     end: new Date('2023-12-19T13:30:00.000Z'),
//     location: 'Cafeteria',
//     organizer: 'Jane Smith',
//     description: 'Casual lunch with team members',
//     color: 'green', // custom field for event color
//   },
//   // Add more events with additional fields as needed
// ];

// const MyCalendar = () => (
//   <div style={{ height: '500px' }}>
//     <Calendar
//       localizer={localizer}
//       events={events}
//       startAccessor="start"
//       endAccessor="end"
//       style={{ width: '100%' }}
//     />
//   </div>
// );

// export default MyCalendar;
