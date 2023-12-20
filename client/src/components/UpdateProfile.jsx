// import '../App.css';
// import {useContext, useState} from 'react';
// import {AuthContext} from '../context/AuthContext';
// import {updateUserProfile} from '../firebase/FirebaseFunctions';
// import axios from 'axios'
// import {
//     getAuth,
//     createUserWithEmailAndPassword,
//     signOut,
//     updateProfile,
//     signInWithEmailAndPassword,
//     updatePassword,
//     signInWithPopup,
//     GoogleAuthProvider,
//     sendPasswordResetEmail,
//     EmailAuthProvider,
//     reauthenticateWithCredential,
//     updateEmail
//   } from 'firebase/auth';

// function UpdateProfile() {

//   const {currentUser} = useContext(AuthContext);
//   let auth = getAuth();
//   const {currentUserInfo,setCurrentUserInfo} = useState(null);
//   const [file, setFile] = useState(null);
  
// //   useEffect(() => {
// //     const fetchEvents = async () => {
// //       try {
// //         console.log(currentUser.uid)
// //         console.log("Taher")
// //         const currentUserInfo = await axios.get(`http://localhost:3000/user/${currentUser.uid}`);
// //         console.log(currentUserInfo)
// //         setCurrentUserInfo(currentUserInfo.data);
// //       } catch (error) {
// //         console.error('Error fetching events:', error);
// //       }
// //     };
    
// //     fetchEvents();
// //   }, []);

// function handleChange(e) {
//     setFile(e.target.files[0]);
//     console.log(e.target.files[0]);
// }
//   const submitForm = async (event) => {
//     console.log(event)
//     event.preventDefault();
//     console.log("taher")
//     const {username,email} = event.target.elements
//     console.log(email.value)
//     console.log(username.value);
//     let obj = {
//         email: email.value,
//         username: username.value
//     }
//     try{


//         // await updateEmail(auth.currentUser, email)
//         // await updateProfile(auth.currentUser, {displayName: username})
//         console.log(email.value)
//         console.log(username.value)
//         await updateUserProfile(email.value,username.value)
        
//         // const response = await axios.put(`http://localhost:3000/user/${auth.currentUser.uid}`, {
//         //   userId: currentUser.uid,
//         //   obj,
//         // });
//         console.log(file)
//         let { data } = await axios.post(`http://localhost:3000/image/user/${auth.currentUser.uid}/photo`, {file: file,userId: currentUser.uid}, {
// 			headers: {
// 				'Content-Type': `multipart/form-data;`
// 			}
// 		});
//     console.log(data)
//       }
//       catch(e){
//         console.error(e);
//       }
// }

// console.log('Profile Picture Path:', currentUser.profilePicture);

//   return (
// <div>
//         <h4 className='error'></h4>
//         <h2>Hi {currentUser.displayName}, You can view and update your Profile here</h2>
//         <form onSubmit={submitForm} encType="multipart/form-data">
//           <div className='form-group'>
//             <label>
//               User:
//               <input
//                 className='form-control'
//                 name='username'
//                 id='username'
//                 type='text'
//                 defaultValue={currentUser.displayName}
//               />
//             </label>
//           </div>

//           <div className='form-group'>
//             <label>
//               Email:
//               <input
//                 className='form-control'
//                 name='email'
//                 id='email'
//                 type='text'
//                 defaultValue={currentUser.email}
                
//               />
//             </label>
//           </div>
//           <div className='form-group'>
//           <img
//         src={`http://localhost:3000${currentUser.profilePicture}`} // Assuming localhost:3000 is your server's base URL
//         alt="Profile"
//         style={{ width: '200px', height: '200px' }} // Adjust dimensions as needed
//       />
// 				<input
// 					type="file"
// 					onChange={handleChange}
// 					accept="image/jpeg, image/png, .jpeg, .jpg, .png"
// 					className="image-input"
//           name="file"
// 				/>
// 				{/* {loading ? <Spin /> : null} */}

//                 </div>
//           <button className='button' type='submit'>
//             Update
//           </button>
//         </form>
//         <br />
//       </div>
//   );
// }

// export default UpdateProfile;


// import '../App.css';
// import { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { updateUserProfile } from '../firebase/FirebaseFunctions';
// import axios from 'axios';
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signOut,
//   updateProfile,
//   signInWithEmailAndPassword,
//   updatePassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   sendPasswordResetEmail,
//   EmailAuthProvider,
//   reauthenticateWithCredential,
//   updateEmail,
// } from 'firebase/auth';

// function UpdateProfile() {
//   const { currentUser } = useContext(AuthContext);
//   const auth = getAuth();
//   const [currentUserInfo, setCurrentUserInfo] = useState(null);
//   const [file, setFile] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/user/${currentUser.uid}`);
//         setCurrentUserInfo(response.data);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchUserData();
//   }, [currentUser.uid]);

//   function handleChange(e) {
//     setFile(e.target.files[0]);
//   }

//   const submitForm = async (event) => {
//     event.preventDefault();

//     const { username, email } = event.target.elements;
//     const obj = {
//       email: email.value,
//       username: username.value,
//     };

//     try {
//       await updateUserProfile(email.value, username.value);

//       const { data } = await axios.post(
//         `http://localhost:3000/image/user/${auth.currentUser.uid}/photo`,
//         { file: file, userId: currentUser.uid },
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       console.log(data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <div>
//       <h4 className="error"></h4>
//       <h2>Hi {currentUser.displayName}, You can view and update your Profile here</h2>
//       <form onSubmit={submitForm} encType="multipart/form-data">
//         <div className="form-group">
//           <label>
//             User:
//             <input
//               className="form-control"
//               name="username"
//               id="username"
//               type="text"
//               defaultValue={currentUserInfo?.username || currentUser.displayName}
//             />
//           </label>
//         </div>

//         <div className="form-group">
//           <label>
//             Email:
//             <input
//               className="form-control"
//               name="email"
//               id="email"
//               type="text"
//               defaultValue={currentUserInfo?.email || currentUser.email}
//             />
//           </label>
//         </div>
//         <div className="form-group">
//           <img
//             src={
//               currentUserInfo?.profilePicture
//                 ? currentUserInfo.profilePicture
//                 : 'https://via.placeholder.com/400.jpg?text=Profile+Image'
//             }
//             alt="profile-picture"
//             className="profile-img"
//           />
//           <input
//             type="file"
//             onChange={handleChange}
//             accept="image/jpeg, image/png, .jpeg, .jpg, .png"
//             className="image-input"
//             name="file"
//           />
//         </div>
//         <button className="button" type="submit">
//           Update
//         </button>
//       </form>
//       <br />
//     </div>
//   );
// }

// export default UpdateProfile;


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

  // const submitForm = async (event) => {
  //   event.preventDefault();
  //   const { username, email } = event.target.elements;
  //   let obj = {
  //     email: email.value,
  //     username: username.value
  //   };
  //   try {
  //     await updateUserProfile(email.value, username.value);
  //     console.log(file);
  //     let { data } = await axios.post(
  //       `http://localhost:3000/image/user/${currentUser.uid}/photo`,
  //       { file: file, userId: currentUser.uid },
  //       {
  //         headers: {
  //           'Content-Type': `multipart/form-data;`
  //         }
  //       }
  //     );
  //     console.log(data);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const submitForm = async (event) => {
    event.preventDefault();
    // const { username, email } = event.target.elements;
  
    const formData = new FormData();
    formData.append('file', file);
    // formData.append('userId', currentUser.uid);
  
    // formData.append('username', username.value);
    // formData.append('email', email.value);
  
    try {
      // await updateUserProfile(email.value, username.value);
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
          {/* <label>
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
          </label> */}
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
