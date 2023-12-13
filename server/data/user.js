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
  id = validation.checkString(id,"Firebase User Id")
  username = validation.checkUsername(username,"username")
  email = validation.checkMailID(email,"email");
  console.log('Data route');
  const userCollection = await users();
  const userIdExist = await userCollection.findOne({uid: id})
  const userNameExits = await userCollection.findOne({name: username } );
  const emailExits = await userCollection.findOne({email});
  if (userNameExits) {
    throw "Error: username already used";
  }

  if (emailExits) {
    throw "Error: email already used";
  }
  if(userIdExist){
    throw "Error: uid already exist"
  }

  
  // Create a new user object with the hashed password
  const newUser = {
    name: username,
    email: email,
    uid: id,
    // password : user.password,
    events: { attending: [], organizing: []},
    isActive: true
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
    if(queryParams.isActive !== 'true' && queryParams.isActive !== 'false'){
      throw "Query Parameter isActive is set wrong";
    }
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

    // if (!id || typeof id !== "string" || id.trim().length === 0) {
    //   throw new Error("Invalid id");
    // }
    //  id = id.trim();

    console.log(typeof id)
    id = validation.checkString(id,"Firebase User Id");
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
    const db = await users();
  
    id = validation.checkString(id)
    const user = await db.findOne({ uid: id});
    if (!user) {
      throw new Error("user not found");
    }
  
    await db.deleteOne({ uid: id });
  
    const message = user.name + " has been successfully deleted!";
    return message;
  };

  const update = async(id, userObj) => {
    const userId = validation.checkId(id)
    let userInfo = validateUpdateUser(userObj)
    delete userInfo._id
  
    const usersCol = await users();
    if (userInfo.password) {
      const newPassword = await bcrypt.hash(userInfo.password, 10);
      userInfo = { ...userInfo, password: newPassword }
    }
    
    const updatedInfo = await usersCol.findOneAndUpdate({ _id: new ObjectId(userId) }, {
      $set: userInfo
    }, {returnDocument: 'after'});
    if (updatedInfo.lastErrorObject.n === 0) {
      throw errorObject(errorType.BAD_INPUT, 'Failed to update the profile');
    }
    updatedInfo.value._id = updatedInfo.value._id.toString();
    
    const user = updatedInfo.value
    delete user.password
    return user;
  };

  export default {create, getAllUsers, get, remove, update}