import '../App.css';
import {useContext, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import {updateUserProfile} from '../firebase/FirebaseFunctions';
import axios from 'axios'
import {
    getAuth,
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

function UpdateProfile() {

  const {currentUser} = useContext(AuthContext);
  let auth = getAuth();
  const {currentUserInfo,setCurrentUserInfo} = useState(null);
  const [file, setFile] = useState(null);
  
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         console.log(currentUser.uid)
//         console.log("Taher")
//         const currentUserInfo = await axios.get(`http://localhost:3000/user/${currentUser.uid}`);
//         console.log(currentUserInfo)
//         setCurrentUserInfo(currentUserInfo.data);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//       }
//     };
    
//     fetchEvents();
//   }, []);

function handleChange(e) {
    setFile(e.target.files[0]);
}
  const submitForm = async (event) => {
    console.log(event)
    event.preventDefault();
    console.log("taher")
    const {username,email} = event.target.elements
    console.log(email.value)
    console.log(username.value);
    let obj = {
        email: email.value,
        username: username.value
    }
    try{


        // await updateEmail(auth.currentUser, email)
        // await updateProfile(auth.currentUser, {displayName: username})
        console.log(email.value)
        console.log(username.value)
        await updateUserProfile(email.value,username.value)
        
        const response = await axios.put(`http://localhost:3000/user/${auth.currentUser.uid}`, {
          userId: currentUser.uid,
          obj,
        });
        console.log(file)
        let { data } = await axios.post(`http://localhost:3000/user/${auth.currentUser.uid}/photo`, {file: file,userId: currentUser.uid}, {
			headers: {
				'Content-Type': `multipart/form-data;`
			}
		});
      }
      catch(e){
        console.error(e);
      }
}

  return (
<div>
        <h4 className='error'></h4>
        <h2>Hi {currentUser.displayName}, You can view and update your Profile here</h2>
        <form onSubmit={submitForm}>
          <div className='form-group'>
            <label>
              User:
              <input
                className='form-control'
                name='username'
                id='username'
                type='text'
                defaultValue={currentUser.displayName}
              />
            </label>
          </div>

          <div className='form-group'>
            <label>
              Email:
              <input
                className='form-control'
                name='email'
                id='email'
                type='text'
                defaultValue={currentUser.email}
                
              />
            </label>
          </div>
          <div className='form-group'>
          <img
					// src={
					// 	userData.imageUrl
					// 		? userData.imageUrl
					// 		: 'https://via.placeholder.com/400.jpg?text=Profile+Image'
					// }
					alt="profile-picture"
					className="profile-img"
				/>
				<input
					type="file"
					onChange={handleChange}
					accept="image/jpeg, image/png, .jpeg, .jpg, .png"
					className="image-input"
				/>
				{/* {loading ? <Spin /> : null} */}

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