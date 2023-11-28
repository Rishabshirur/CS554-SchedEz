// import React from 'react';
import {doSignOut} from '../firebase/FirebaseFunctions';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../actions'

const SignOutButton = () => {

const dispatch = useDispatch();

const signOutRedux = () => {
  dispatch(actions.unsetUser())
  doSignOut();
}

  return (
    <button className='button' type='button' onClick={signOutRedux}>
      Sign Out
    </button>
  );
};

export default SignOutButton;