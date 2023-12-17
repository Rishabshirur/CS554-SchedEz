import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";
import validation from '../validation.js'
import { errorType, errorObject } from '../badInputs.js'
import {
  getAuth
} from 'firebase/auth';

const create = async(
  id, username, email
) => {

    //validating the request body
  // let errors = [];
  // try {
  //   name = validation.validateName(name, "Name");
  // } catch (e) {
  //   errors.push(e?.message);
  // }

  // try {
  //   email = validation.checkMailID(email);
  // } catch (e) {
  //   errors.push(e?.message);
  // }

  // try {
  //   password = validation.checkPassword(password);
  // } catch (e) {
  //   errors.push(e?.message);
  // }
  // const auth = getAuth();
  // const user = await auth.getUser(id)
  // const user = await auth.currentUser
  // console.log(user);
  console.log('Data route');
  const userCollection = await users();
  const userNameExits = await userCollection.findOne({ username } );
  const emailExits = await userCollection.findOne({email});
  if (userNameExits) {
    throw "Error: username already used";
  }

  if (emailExits) {
    throw "Error: email already used";
  }


  
  // Create a new user object with the hashed password
  const newUser = {
    name: username,
    email: email,
    uid: id,
    // password : user.password,
    events: { attending: [], organizing: []},
    isActive: true,
    profilePicture: ""
  };

  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    // throw [404, "Could not create new user"];
    throw new Error("User Not Found");

  let userId = insertInfo.insertedId;
  let res = {};
  res = await userCollection.findOne({ _id: userId });
  res._id = res._id.toString();
  return res;
};

const getAllUsers = async (queryParams) => {
    const userCollection = await users();
    queryParams.isActive = queryParams.isActive === 'true';
    const usersResponse = await userCollection.find(queryParams).project({ password: 0 }).toArray();
    if (!usersResponse?.length) {
      // throw [404, "Users not found"];
      throw new Error("User Not Found");
    };
    usersResponse?.forEach((item) => {
      item._id = item._id.toString();
    });
    return usersResponse;
  };

  const get = async (id) => {

    if (!id || typeof id !== "string" || id.trim().length === 0) {
      throw new Error("Invalid id");
    }
     id = id.trim();
  
    //  if (!ObjectId.isValid(id)){
    //   throw new Error ('invalid object ID');
    //  } 
     const userCollection = await users();
  
     const user = await userCollection.findOne({uid: id});
     
     if(user === null){
      throw new Error("No user with that id");
     }
  
     user._id = user._id.toString();
     return user
  }

  const remove = async (id) => {
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      throw new Error("Invalid ID provided");
    }
    id = id.trim();
  
    if (!ObjectId.isValid(id)){
      throw new Error ('invalid object ID');
     } 
  
    const db = await users();
  
    const user = await db.findOne({ _id: new ObjectId(id) }, { projection:{ password: 0 } });
    if (!user) {
      throw new Error("user not found");
    }
  
    await db.deleteOne({ _id: new ObjectId(id) });
  
    const message = user.name + " has been successfully deleted!";
    return message;
  };

  const update = async(id, userObj) => {
    const userId = id
    let userInfo = validation.validateUpdateUser(userObj)
    const usersCol = await users();
    const myUserInfo = await usersCol.findOne({uid: userId})
    myUserInfo.name = userInfo.username
    // myUserInfo.email = userInfo.email
    const updatedInfo = await usersCol.findOneAndUpdate({ uid: userId }, {
      $set: myUserInfo
    }, {returnDocument: 'after'});
    if (updatedInfo.lastErrorObject.n === 0) {
      throw errorObject(errorType.BAD_INPUT, 'Failed to update the profile');
    }
    updatedInfo.value._id = updatedInfo.value._id.toString();
    
    const user = updatedInfo.value
    
    return user;
  };

  export default {create, getAllUsers, get, remove, update}