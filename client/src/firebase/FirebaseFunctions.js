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
    reauthenticateWithCredential
  } from 'firebase/auth';
  

  async function doCreateUserWithEmailAndPassword(email, password, displayName) {
    const auth = getAuth();
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const uid = userCredential.user.uid;
      console.log("THE REAL UID",uid);
  
      await updateProfile(auth.currentUser, { displayName });
    } catch (error) {
      console.error(error);
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
    await signInWithEmailAndPassword(auth, email, password).then((userID)=> {
        const uuid = userID.user.uid;
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
    doChangePassword
  };