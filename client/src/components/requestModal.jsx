import React, { useState ,useEffect} from 'react';
import axios from 'axios'
import {getAuth} from 'firebase/auth';
function requestModal(props) {

    const [requests, setRequests]= useState(null);
    let auth = getAuth();
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:3000/requests/${auth.currentUser.email}`);
            console.log(response.data)
            setRequests(response.data.requests);
          } catch (error) {
            console.error('Error fetching requests:', error);
          }
        };
    
        fetchData();
      }, []);
    return (
        <div>
            { requests && requests.map((req)=>{
                return <div>
                  {req.sender_email}{req.event.event_name}{req.event.classification}{req.event.start_datetime}{req.event.end_datetime}
                </div>
            })}
        </div>
    );
}

export default requestModal;