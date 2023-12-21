import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EventDetail = () => {
  const [eventDetail, setEventDetail] = useState({});
  const [editedEvent, setEditedEvent] = useState({});
  const [initialEventDetail, setInitialEventDetail] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shareEventEmails, setShareEventEmails] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);  const [userCount,setUserCount] = useState(1);


  const { eventId } = useParams();
  let auth = getAuth();
  const navigate = useNavigate();

  const formatDate = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', options);
  };

  const formatDateForInput = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const pad = (num) => (num < 10 ? `0${num}` : num);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/event/detail/${eventId}`);
      const event = response.data.events[0];
      setEventDetail(event);
      setInitialEventDetail(event);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const fetchEventUserCount = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/event/${eventId}/user-count`);
      setUserCount(response.data.userCount);
    } catch (error) {
      console.error('Error fetching event user count:', error);
    }
  };

  useEffect(() => {
    fetchEventDetails();
    fetchEventUserCount();
  }, [eventId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/event/${eventId}`);
      navigate('/all-events');
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (new Date(editedEvent.end_datetime) < new Date(editedEvent.start_datetime)) {
      setErrorMessage('End date cannot be before start date');
      return;
    }
    try {
      await axios.patch(`http://localhost:3000/event/${eventId}`, editedEvent);
      fetchEventDetails();
      setIsEditing(false);
      setShowModal(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Error editing event:', error);
    }
  };

  const handleCloseModal = () => {
    console.log('Closing modal...');
    setEventDetail(initialEventDetail);
    setIsEditing(false);
    setErrorMessage('');
    setShowModal(false);
    setShowShareModal(false);
  };

  const handleEditClick = () => {
    const { start_datetime, end_datetime, ...otherDetails } = eventDetail;
    const formattedStartDate = start_datetime ? formatDateForInput(start_datetime) : '';
    const formattedEndDate = end_datetime ? formatDateForInput(end_datetime) : '';

    setEditedEvent({
      ...otherDetails,
      start_datetime: formattedStartDate,
      end_datetime: formattedEndDate,
    });

    setIsEditing(true);
    setShowModal(true);
  };

  const handleShareClick = () => {
    setIsSharing((prevIsSharing) => !prevIsSharing);
    setShowShareModal((prevShowShareModal) => !prevShowShareModal);
  };

  const handleShareEvent = async () => {
    // Add logic to send emails to the backend or any other desired action
    console.log('Sharing event with emails:', shareEventEmails);
    setShareEventEmails('');
    setIsSharing((prevIsSharing) => !prevIsSharing);
    setShowShareModal((prevShowShareModal) => !prevShowShareModal); 
  };

  return (
    <div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {!isEditing ? (
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
          <p>
            <strong>People attending:</strong> {userCount}
          </p>
          <button onClick={handleEditClick}>Edit Event</button>
          <button onClick={handleDelete}>Delete Event</button>
          <button onClick={handleShareClick}>Share Event</button>
          {isSharing && (
            <div>
              <label>
                Emails (comma-separated):
                <input
                  type="text"
                  value={shareEventEmails}
                  onChange={(e) => setShareEventEmails(e.target.value)}
                />
              </label>
              <button onClick={handleShareEvent}>Share</button>
            </div>
          )}
        </div>
      ) : (
        showModal && (
          <div className={`modal ${showModal ? 'active' : ''}`}>
            <button onClick={handleCloseModal}>Close Modal</button>
            <h2>Edit Event</h2>
            <form onSubmit={handleEdit}>
              <label>
                Event Name:
                <input
                  type="text"
                  value={editedEvent.event_name || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, event_name: e.target.value })}
                />
              </label>
              <label>
                Start Date and Time:
                <input
                  type="datetime-local"
                  value={editedEvent.start_datetime || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, start_datetime: e.target.value })}
                />
              </label>
              <label>
                End Date and Time:
                <input
                  type="datetime-local"
                  value={editedEvent.end_datetime || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, end_datetime: e.target.value })}
                />
              </label>
              <label>
                Color Code:
                <input
                  type="text"
                  value={editedEvent.color_code || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, color_code: e.target.value })}
                />
              </label>
              <label>
                Classification:
                <input
                  type="text"
                  value={editedEvent.classification || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, classification: e.target.value })}
                />
              </label>
              <button type="submit">Save Changes</button>
            </form>
          </div>
        )
      )}

      
    </div>
  );
};

export default EventDetail;
