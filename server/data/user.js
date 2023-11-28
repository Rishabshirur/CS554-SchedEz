import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";
import validation from '../validation.js'
import { errorType, errorObject } from '../badInputs.js'

const create = async(
    uid,
    firstName,
    lastName,
    username,
    email,
    password,
    gender,
    age
) => {

    //validating the request body
  let errors = [];
  try {
    firstName = validation.validateName(firstName, "Firstname");
  } catch (e) {
    errors.push(e?.message);
  }

  try {
    lastName = validation.validateName(lastName, "Lastname");
  } catch (e) {
    errors.push(e?.message);
  }

  try {
    username = validation.checkUsername(username);
  } catch (e) {
    errors.push(e?.message);
  }

  try {
    email = validation.checkMailID(email);
  } catch (e) {
    errors.push(e?.message);
  }

  try {
    password = validation.checkPassword(password);
  } catch (e) {
    errors.push(e?.message);
  }

  try {
    age = validation.checkAge(age);
  } catch (e) {
    errors.push(e?.message);
  }

  try {
    gender = validation.checkGender(gender)
  } catch (e) {
    errors.push(e?.message)
  }

  const userCollection = await users();
  const userNameExits = await userCollection.findOne({ username }, { projection:{ password: 0 } });
  const emailExits = await userCollection.findOne({email}, { projection:{ password: 0 } });
  if (userNameExits) {
    throw [400, "Error: username already used"];
  }

  if (emailExits) {
    throw [400, "Error: email already used"];
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  
  // Create a new user object with the hashed password
  const newUser = {
    uid,
    firstName,
    lastName,
    username,
    email,
    password : hashedPassword,
    gender,
    age,
    events: { attending: [], organizing: []},
    isActive: true
  };

  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw [404, "Could not create new user"];

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
      throw [404, "Users not found"];
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
  
     if (!ObjectId.isValid(id)){
      throw new Error ('invalid object ID');
     } 
     const userCollection = await users();
  
     const user = await userCollection.findOne({_id: new ObjectId(id)},{projection:{_id:1,firstName:1}});
     
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