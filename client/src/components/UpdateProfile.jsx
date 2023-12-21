import '../App.css';
import {updateUserProfile, updateUserProfilePhoto} from '../firebase/FirebaseFunctions';
import {
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    signInWithEmailAndPassword,
    updatePassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updateEmail
  } from 'firebase/auth';

import { useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import actions from '../actions';

function UpdateProfile() {
  const { currentUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [userData, setUserData] = useState(null);
  const image = useSelector((state) => state.image.image);
  const dispatch = useDispatch();
  console.log("imageName",image)
  useEffect(() => {
    console.log("useEffect running")
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${currentUser.uid}`);
        console.log("response", response)
        setUserData(response.data); 
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const submitForm = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('file', file);
   
    try {
      await updateUserProfilePhoto(userData?.user?.profilePicture)
      let { data } = await axios.post(
        `http://localhost:3000/image/user/${currentUser.uid}/photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(file.name)
      console.log(data);
      dispatch(actions.setImage(file.name))
    } catch (e) {
      console.error(e);
    }
  };
  

  console.log("prf", userData?.profilePicture)

  return (
    <div>
      <h4 className='error'></h4>
      <h2>Hi {currentUser.displayName}, You can view and update your Profile here</h2>
      <form onSubmit={submitForm} encType="multipart/form-data">
        <div className='form-group'>
        </div>
        <div className='form-group'>
        {userData && userData.user.profilePicture && (
          <img
            src={`http://localhost:3000${userData.user.profilePicture}?${image}`}
            alt="Profile"
            style={{ width: '200px', height: '200px' }}
          />
        )}
        <input
          type="file"
          onChange={handleChange}
          accept="image/jpeg, image/png, .jpeg, .jpg, .png"
          className="image-input"
          name="file"
        />
      </div>
        <button className='button' type='submit'>
          Update
        </button>
      </form>
      <br />
    </div>
  );
}

export default UpdateProfile;
