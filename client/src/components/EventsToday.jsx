import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';

function EventsToday() {
  const [events, setEvents] = useState([]);
  let currentUserState = useSelector((state) => state.userInfo.currentUser);
  let currentUserInfo;
  let auth = getAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        currentUserInfo = await axios.get(`http://localhost:3000/event/${auth.currentUser.uid}`);
        const todayEvents = currentUserInfo.data.events.filter((event) =>
        isEventActiveToday(event)
        );
        setEvents(todayEvents);
        console.log(todayEvents);
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

  // to check if event is active today
  const isEventActiveToday = (event) => {
    const today = new Date();
    const startDate = new Date(event.start_datetime);
    const endDate = new Date(event.end_datetime);

    // to check if event is active only
    // return today >= startDate && today <= endDate;
    return (
        (today.getFullYear() === startDate.getFullYear() &&
          today.getMonth() === startDate.getMonth() &&
          today.getDate() === startDate.getDate()) ||
        (today.getFullYear() === endDate.getFullYear() &&
          today.getMonth() === endDate.getMonth() &&
          today.getDate() === endDate.getDate()) ||
        (today >= startDate && today <= endDate)
      );
  };

  return (
    <div>
      <h2>Today's Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <Link to={`/event/${event._id}`}>
              <strong>{event.event_name}</strong> - {formatDate(event.start_datetime)}
              {' to '}
              {formatDate(event.end_datetime)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsToday;
