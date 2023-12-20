import {combineReducers} from '@reduxjs/toolkit';
import {userInfo,image} from './userInfo.js';
const rootReducer = combineReducers({
  userInfo: userInfo,
  image: image
});

export default rootReducer;