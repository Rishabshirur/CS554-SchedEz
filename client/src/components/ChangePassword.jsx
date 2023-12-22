import {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../context/AuthContext';
import {doChangePassword} from '../firebase/FirebaseFunctions';
import {updateUserProfile} from '../firebase/FirebaseFunctions';
import axios from 'axios';
import '../App.css';

function ChangePassword() {
  const {currentUser} = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');
  const [userName,setUserName] = useState(currentUser.displayName);
  const [file, setFile] = useState(null);
  console.log(currentUser);


  const submitChangePasswordForm = async (event) => {
    event.preventDefault();
    const {currentPassword, newPasswordOne, newPasswordTwo} =
      event.target.elements;

    if (newPasswordOne.value !== newPasswordTwo.value) {
      setPwMatch('New Passwords do not match, please try again');
      return false;
    }

    try {
      await doChangePassword(
        currentUser.email,
        currentPassword.value,
        newPasswordOne.value
      );
      alert('Password has been changed, you will now be logged out');
    } catch (error) {
      alert(error);
    }
  };

  function handleChange(e) {
    setFile(e.target.files[0]);
}

  const submitChangeProfileForm = async (event) => {
    event.preventDefault();
    const {username} = event.target.elements
    let obj = {
        username: username.value
    }
    try{

        console.log(username.value)
        await updateUserProfile(username.value)
        
        const response = await axios.put(`http://localhost:3000/user/${currentUser.uid}`, {
          userId: currentUser.uid,
          obj,
        });
        console.log(currentUser)
        setUserName(currentUser.displayName);
      }
      catch(e){
        console.error(e);
      }
}
useEffect(() => {},[userName])
  if (currentUser.providerData[0].providerId === 'password') {
    return (
      <div>
        {pwMatch && <h4 className='error'>{pwMatch}</h4>}
        <h2>Hi {userName}, You can view and update your Profile here</h2>
        <form onSubmit={submitChangeProfileForm}>
          <div className='form-group'>
            <label>
              Username:
              <input
                className='form-control'
                name='username'
                id='username'
                type='text'
                defaultValue={userName}
              />
            </label>
          </div>
          <br />
          <button className='button' type='submit'>
            Update Username
          </button>
        </form>
        <form onSubmit={submitChangePasswordForm}>
          <div className='form-group'>
            <label>
              Current Password:
              <input
                className='form-control'
                name='currentPassword'
                id='currentPassword'
                type='password'
                placeholder='Current Password'
                autoComplete='off'
                required
              />
            </label>
          </div>

          <div className='form-group'>
            <label>
              New Password:
              <input
                className='form-control'
                name='newPasswordOne'
                id='newPasswordOne'
                type='password'
                placeholder='Password'
                autoComplete='off'
                required
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Confirm New Password:
              <input
                className='form-control'
                name='newPasswordTwo'
                id='newPasswordTwo'
                type='password'
                placeholder='Confirm Password'
                autoComplete='off'
                required
              />
            </label>
          </div>

          <button className='button' type='submit'>
            Change Password
          </button>
        </form>
    
       
        <br />
      </div>
    );
  } else {
    return (
      <div>
        <h2>
          {currentUser.displayName}, You are signed in using a Social Media
          Provider, You cannot change your password
        </h2>
      </div>
    );
  }
}

export default ChangePassword;