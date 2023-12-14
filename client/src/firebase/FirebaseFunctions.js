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
  import axios from 'axios'
  import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import {useSelector, useDispatch} from 'react-redux';
import actions from '../actions.js'
  
//   async function doCreateUserWithEmailAndPassword(email, password, displayName) {
//     const auth = getAuth();
//     await createUserWithEmailAndPassword(auth, email, password).then((userID)=> {
//       console.log(userID.user.uid);
//     axios.post("http://localhost:3000/user/all-users",{id: userID.user.uid, username: userID.user.displayName, email: userID.user.email}).then((response)=> {
//       console.log(response);
//     }).catch((error)=> {
//       console.log(error);
//   })
// })
//     await updateProfile(auth.currentUser, {displayName: displayName});

//   }

async function doCreateUserWithEmailAndPassword(email, password, displayName) {
  const auth = getAuth();

  try {
    // Create the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile
    await updateProfile(auth.currentUser, { displayName });

    // Post user data to your server
    await axios.post("http://localhost:3000/user/all-users", {
      id: user.uid,
      username: user.displayName,
      email: user.email
    });

    console.log("User created and profile updated successfully.");
    await doSignOut();
  } catch (error) {
    console.error("Error creating user:", error.message);
  }
}

async function updateUserProfile(displayName) {
  const auth = getAuth();

  try {
    // Update user profile
    await updateProfile(auth.currentUser, { displayName});
    //await updateEmail(auth.currentUser, email);

    // // Post user data to your server
    // await axios.post("http://localhost:3000/user/all-users", {
    //   id: user.uid,
    //   username: user.displayName,
    //   email: user.email
    // });

    console.log("User profile updated successfully.");
  } catch (error) {
    console.error("Error creating user:", error.message);
  }
}

  async function doChangePassword(email, oldPassword, newPassword) {
    const auth = getAuth();
    let credential = EmailAuthProvider.credential(email, oldPassword);
    console.log(credential);
    await reauthenticateWithCredential(auth.currentUser, credential);
  
    await updatePassword(auth.currentUser, newPassword);
    await doSignOut();
  }
  
  async function doSignInWithEmailAndPassword(email, password) {
    let auth = getAuth();
    var uuid;
    await signInWithEmailAndPassword(auth, email, password).then((userID)=> {
        uuid = userID.user.uid;
        console.log(uuid);
    });
  }
  
  async function doSocialSignIn() {
    let auth = getAuth();
    let socialProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, socialProvider);
  }
  
  async function doPasswordReset(email) {
    let auth = getAuth();
    await sendPasswordResetEmail(auth, email);
  }
  
  async function doSignOut() {
    let auth = getAuth();
    await signOut(auth);
  }
  
  export {
    doCreateUserWithEmailAndPassword,
    doSocialSignIn,
    doSignInWithEmailAndPassword,
    doPasswordReset,
    doSignOut,
    doChangePassword,
    updateUserProfile
  };