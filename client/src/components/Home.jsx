import {useContext,useEffect} from 'react';
import {AuthContext} from '../context/AuthContext';
import {useSelector, useDispatch} from 'react-redux';
import {getAuth} from 'firebase/auth';
import axios from 'axios'
import actions from '../actions.js'
import '../App.css';

function Home() {
  const {currentUser} = useContext(AuthContext);
  const dispatch = useDispatch();
  let auth = getAuth();
  let currentUserState = useSelector((state) => state.currentUser);
  // dispatch(actions.setUser(currentUserInfo.id, currentUserInfo.name, currentUserInfo.email ,currentUserInfo.events ,currentUserInfo.isActive))
  // console.log(currentUser);
  // console.log(currentUser.currentUserInfo)

  useEffect(()=>{
    let currentUserInfo;
    async function getUserInfo(params) {
      currentUserInfo = await axios.get(`http://localhost:3000/user/${auth.currentUser.uid}`); 
      // console.log(currentUserInfo);
    }
    getUserInfo();
    if(currentUserInfo){
    dispatch(actions.setUser(currentUserInfo.id, currentUserInfo.name, currentUserInfo.email ,currentUserInfo.events ,currentUserInfo.isActive)) }
    console.log("cheking the state")
    console.log(currentUserState)
  },[])

  return (
    <div className='card'>
      <h2>
        Hello {currentUser && currentUser.displayName}, this is the Protected
        Home page
        Name: {currentUser.currentUserInfo}
      </h2>
    </div>
  );
}

export default Home;