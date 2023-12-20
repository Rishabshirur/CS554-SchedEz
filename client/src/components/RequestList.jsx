import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';

const RequestList = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const currentUserState = useSelector((state) => state.userInfo.currentUser);
  const auth = getAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/requests/allRequests/${auth.currentUser.email}`);
        const allRequests = response.data.requests;
        const sent = allRequests.filter((request) => request.sender_email === auth.currentUser.email);
        const received = allRequests.filter((request) => request.receiver_email === auth.currentUser.email);

        setSentRequests(sent);
        setReceivedRequests(received);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [currentUserState.uid]);

  const renderRequestList = (requests, isSentRequests) => {
    return (
        <div>
          {requests.map((request) => (
            <div key={request._id} style={styles.listItem}>
              <strong>Status:</strong> {request.status}
              <br />
              <strong>Event Name:</strong> {request.event.event_name}
              <br />
              <strong>Start Date:</strong> {new Date(request.event.start_datetime).toLocaleString()}
              <br />
              <strong>End Date:</strong> {new Date(request.event.end_datetime).toLocaleString()}
              {isSentRequests ? (
                <div>
                  <strong>Sent to:</strong> {request.receiver_email}
                </div>
              ) : (
                <div>
                  <strong>Received from:</strong> {request.sender_email}
                </div>
              )}
            </div>
          ))}
        </div>
      );
  };

  const styles = {
    listItem: {
      marginBottom: '20px',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      background: '#f9f9f9',
    },
  };

  return (
    <div>
      <h2>Sent Requests</h2>
      {renderRequestList(sentRequests, true)}

      <h2>Received Requests</h2>
      {renderRequestList(receivedRequests, false)}
    </div>
  );
};

export default RequestList;
