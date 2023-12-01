import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';

function EventList(filteredEvents) {
  const [events, setEvents] = useState([]);
  
  let currentUserState = useSelector((state) => state.userInfo.currentUser);
  let currentUserInfo;
  let auth = getAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        currentUserInfo = await axios.get(`http://localhost:3000/event/${auth.currentUser.uid}`);
        setEvents(currentUserInfo.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [currentUserState.uid]);

  const formatDate = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div>
      <h2>Event List</h2>
      <ul>
        {filteredEvents.events.map((event) => (
          <li key={event._id}>
            <Link to={`/event/${event._id}`}>
              <strong>{event.event_name}</strong> - {formatDate(event.start_datetime)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default EventList;
