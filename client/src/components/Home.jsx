import {useContext,useEffect} from 'react';
import {AuthContext} from '../context/AuthContext';
import {useSelector, useDispatch} from 'react-redux';
import {getAuth} from 'firebase/auth';
import axios from 'axios'
import actions from '../actions'
import '../App.css';

function Home() {
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
    </div>
  );
}

export default Home;