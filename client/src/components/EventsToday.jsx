import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';

function EventsToday() {
  const [events, setEvents] = useState([]);
  const currentUserState = useSelector((state) => state.userInfo.currentUser);
  let currentUserInfo;
  const auth = getAuth();

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

  const isEventActiveToday = (event) => {
    const today = new Date();
    const startDate = new Date(event.start_datetime);
    const endDate = new Date(event.end_datetime);


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
    <div style={styles.container}>
      <h2 style={styles.heading}>Today's Events</h2>
      <ul style={styles.eventList}>
        {events.map((event) => (
          <li key={event._id} style={styles.eventBox}>
            <Link to={`/event/${event._id}`} style={styles.link}>
              <strong>{event.event_name}</strong> - {formatDate(event.start_datetime)} to{' '}
              {formatDate(event.end_datetime)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    margin: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  eventList: {
    listStyle: 'none',
    padding: 0,
  },
  eventBox: {
    marginBottom: '15px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: '#f9f9f9',
    width: '80vw', 
    textAlign: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: '16px',
  },
};


export default EventsToday;
