import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useParams } from 'react-router-dom';

const EventDetail = ({ event }) => {
const [eventDetail, setEventDetail] = useState([]);

const {eventId} = useParams();
  let auth = getAuth();

  const formatDate = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const currentUserInfo = await axios.get(`http://localhost:3000/event/detail/${eventId}`);
        setEventDetail(currentUserInfo.data.events[0]);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2>{eventDetail.event_name}</h2>
      <p>
        <strong>Start Date and Time:</strong> {formatDate(eventDetail.start_datetime)}
      </p>
      <p>
        <strong>End Date and Time:</strong> {formatDate(eventDetail.end_datetime)}
      </p>
      <p>
        <strong>Color Code:</strong> {eventDetail.color_code}
      </p>
      <p>
        <strong>Classification:</strong> {eventDetail.classification}
      </p>
    </div>
  );
};

export default EventDetail;
