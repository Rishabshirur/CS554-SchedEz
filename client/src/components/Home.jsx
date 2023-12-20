// import {useContext,useEffect,useState} from 'react';
// import {AuthContext} from '../context/AuthContext';
// import {useSelector, useDispatch} from 'react-redux';
// import {getAuth} from 'firebase/auth';
// import axios from 'axios'
// import actions from '../actions'
// import '../App.css';
// import EventForm from './EventForm';
// import { Link } from 'react-router-dom';
// // import Event from '../../../server/data/event';
// import EventCalendar from './EventCalendar';

// function Home() {
//   const {currentUser} = useContext(AuthContext);
//   const dispatch = useDispatch();
//   let auth = getAuth();
//   let currentUserState = useSelector((state) => state.userInfo.currentUser);
//   let currentUserInfo;
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };


//   useEffect(()=>{
//     const getUserInfo = async () => {

//       try{
//       currentUserInfo = await axios.get(`http://localhost:3000/user/${auth.currentUser.uid}`); 
//       if(currentUserInfo){
//         dispatch(actions.setUser(currentUserInfo.data.user.uid, currentUserInfo.data.user.name, currentUserInfo.data.user.email ,currentUserInfo.data.user.events ,currentUserInfo.data.user.isActive)) 
//         }
//       }
//       catch(e){
//         console.error(e);
//       }
//     }

//     getUserInfo();
//   },[])

//   return (
//     <div className='card'>
//       <h2>
//         Hello {currentUser && currentUser.displayName}, this is the Protected
//         Home page
//         Name: {currentUserState?.name}
//         Email: {currentUserState?.email}
//       </h2>
//       <Link to="/all-events">View My All Events</Link>
//       <br/>
//       <Link to="/events-today">View Today's Events</Link>
//       <br/>
//       <EventCalendar/>
//       <button onClick={openModal}>Open Event Form</button>
//       {isModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <span className="close" onClick={closeModal}>
//               &times;
//             </span>
//             <EventForm />
//           </div>
//         </div>
//       )}


//     </div>
//   );
// }

// export default Home;
import {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../context/AuthContext';
import {useSelector, useDispatch} from 'react-redux';
import {getAuth} from 'firebase/auth';
import axios from 'axios'
import actions from '../actions'
import '../App.css';
import EventForm from './EventForm';
import ScheduleForm from './ScheduleForm';
import { Link } from 'react-router-dom';
// import Event from '../../../server/data/event';
import EventCalendar from './EventCalendar';
import RequestModal from './requestModal';

function Home() {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [shouldUpdateCalendar, setShouldUpdateCalendar] = useState(false);

  

  const handleUpdateCalendar = () => {
    setShouldUpdateCalendar(!shouldUpdateCalendar);
  };

  const openEventModal = () => {
    setIsEventModalOpen(true);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
  };

  const openScheduleModal = () => {
    setIsScheduleModalOpen(true);
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
  };


  const {currentUser} = useContext(AuthContext);
  const dispatch = useDispatch();
  let auth = getAuth();
  let currentUserState = useSelector((state) => state.userInfo.currentUser);
  let currentUserInfo;
  useEffect(()=>{
    const getUserInfo = async () => {

      try{
      currentUserInfo = await axios.get(`http://localhost:3000/user/${auth.currentUser.uid}`); 
      if(currentUserInfo){
        dispatch(actions.setUser(currentUserInfo.data.user.uid, currentUserInfo.data.user.name, currentUserInfo.data.user.email ,currentUserInfo.data.user.events ,currentUserInfo.data.user.isActive)) 
        }
      }
      catch(e){
        console.error(e);
      }
    }

    getUserInfo();
  },[])

  return (
    <div className='card'>
      <h2>
        Hello {currentUser && currentUser.displayName}, this is the Protected
        Home page
        Name: {currentUserState?.name}
        Email: {currentUserState?.email}
      </h2>
      
      
    
      <Link to="/all-events">View My All Events</Link>
      <br/>
      <Link to="/events-today">View Today's Events</Link>
      <Link to="/invites">View invites</Link>
      <br/>
      <button onClick={openEventModal}>Open Event Form</button>
      {isEventModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close" onClick={closeEventModal}>
              &times;
            </span>
            <EventForm />
          </div>
        </div>
      )}
      <button onClick={openScheduleModal}>Add Schedule</button>
      {isScheduleModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close" onClick={closeScheduleModal}>
              &times;
            </span>
            <ScheduleForm onUpdateCalendar={handleUpdateCalendar} />
          </div>
        </div>
      )}
      <RequestModal/>
      <EventCalendar shouldUpdateCalendar={shouldUpdateCalendar}/>
    </div>
  );
}

export default Home;