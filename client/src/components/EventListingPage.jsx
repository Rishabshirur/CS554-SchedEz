import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import EventList from './EventList';
import { getAuth } from 'firebase/auth';

function EventListingPage() {
  const currentUser = useSelector((state) => state.userInfo.currentUser);
  const userId = currentUser.userId;
  let auth = getAuth();

  const [colorCodeFilter, setColorCodeFilter] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all'); 

  const handleFilterChange = async () => {
    try {
      let response;
      if (selectedFilter === 'all') {
        response = await axios.get(`http://localhost:3000/event/${auth.currentUser.uid}`);
      } else if (selectedFilter === 'colorCode') {
        if (colorCodeFilter) {
          response = await axios.get(`http://localhost:3000/event/${auth.currentUser.uid}/filter/colorCode/${colorCodeFilter}`);
        } else {
          response = await axios.get(`http://localhost:3000/event/${auth.currentUser.uid}`);
        }
      } else if (selectedFilter === 'classification') {
        if (classificationFilter) {
          response = await axios.get(`http://localhost:3000/event/${auth.currentUser.uid}/filter/classification/${classificationFilter}`);
        } else {
          response = await axios.get(`http://localhost:3000/event/${auth.currentUser.uid}`);
        }
      }
  
      setFilteredEvents(response.data.events);
    } catch (error) {
      console.error('Error filtering events:', error);
    }
  };

  useEffect(() => {
    handleFilterChange();
  }, [colorCodeFilter, classificationFilter, selectedFilter]);

  return (
    <div>
      <h1>Event Listing Page</h1>

      <label htmlFor="filterType">Filter by:</label>
      <select
        id="filterType"
        name="filterType"
        value={selectedFilter}
        onChange={(e) => setSelectedFilter(e.target.value)}
      >
        <option value="all">All Events</option>
        <option value="colorCode">Color Code</option>
        <option value="classification">Classification</option>
      </select>

      {selectedFilter === 'colorCode' && (
        <div>
          <label htmlFor="colorCodeFilter">Filter by Color Code:</label>
          <select
            id="colorCodeFilter"
            name="colorCodeFilter"
            value={colorCodeFilter}
            onChange={(e) => setColorCodeFilter(e.target.value)}
          >
            <option value="">All Colors</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
          </select>
        </div>
      )}

      {selectedFilter === 'classification' && (
        <div>
          <label htmlFor="classificationFilter">Filter by Classification:</label>
          <input
            type="text"
            id="classificationFilter"
            name="classificationFilter"
            value={classificationFilter}
            onChange={(e) => setClassificationFilter(e.target.value)}
          />
        </div>
      )}

      <EventList events={filteredEvents} />
    </div>
  );
}

export default EventListingPage;
