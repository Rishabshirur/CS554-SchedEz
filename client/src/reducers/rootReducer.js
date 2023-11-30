import {combineReducers} from '@reduxjs/toolkit';
import userInfo from './userInfo.js';
const rootReducer = combineReducers({
  userInfo: userInfo
});

export default rootReducer;