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
        console.log(currentUserInfo.data.events);
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
    <div style={styles.container}>
      <h2 style={styles.heading}>Event List</h2>
      <div style={styles.eventContainer}>
        {filteredEvents.events.map((event) => (
          <div key={event._id} style={styles.eventBox}>
            <Link to={`/event/${event._id}`} style={styles.link}>
              <strong>{event.event_name}</strong> - {formatDate(event.start_datetime)}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    margin: '20px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  eventContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  eventBox: {
    marginBottom: '15px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    width: '80vw',
    boxSizing: 'border-box',
    background: '#f9f9f9',
  },
  link: {
    textDecoration: 'none',
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: '16px',
  },
};

export default EventList;
