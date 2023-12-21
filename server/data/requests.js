import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import { requests } from "../config/mongoCollections.js";
import validations from '../validation.js'

const createRequest = async (sender_email, receiver_email, event) => {

    let errors = [];
    try {
        sender_email = validations.checkMailID(sender_email, "sender email");
        receiver_email = validations.checkMailID(receiver_email, "receiver email");
    } catch (e) {
      errors.push(e?.message);
    }
    
      if (errors.length > 0) {
        throw [400, errors];
      }

    const userCollection = await users();
    const user = await userCollection.findOne(
    { email: receiver_email }
  );
  if (!user) {
    throw [404, "User not found with this emailId "];
  }

    const requestCollection = await requests();
    const newRequest = {
        sender_email: sender_email,
        receiver_email: receiver_email,
        event: event,
        status: "pending"
    }
    const insert = await requestCollection.insertOne(newRequest)

    if (!insert.acknowledged || !insert.insertedId)
    throw [404, "Could not add new request"];

    const insertedId = insert.insertedId.toString();
    return { requestId: insertedId };
}

const getRequestById = async (id) => {
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      throw new Error("Invalid id");
    }
    id = id.trim();
  
    if (!ObjectId.isValid(id)) {
      throw new Error("invalid object ID");
    }
  
    const scheduleCollection = await schedules();
    const schedule = await scheduleCollection.find({ userId: id }).toArray();
    if (schedule === null) {
      throw new Error("No schedule with that id");
    }
    return schedule || [];
  };

  const getAllRequestsByEmail = async (email) => {
    let errors = [];
    try {
      email = validations.checkMailID(email, "emailId");
    } catch (e) {
      errors.push(e?.message);
    }
  
    if (errors.length > 0) {
      throw [400, errors];
    }
  
    const requestCollection = await requests();
    const requestList = await requestCollection.find({
      $or: [{ sender_email: email }, { receiver_email: email }]
    }).sort({ "event.created_at": -1 }).toArray();
  
    if (requestList.length === 0) {
      throw [404,"No requests found for this user"];
    }
    return requestList;
  };


const getRequestsByEmail = async (receiver_email) => {
    let errors = [];
    try {
        receiver_email = validations.checkMailID(receiver_email, "receiver emailId");
    } catch (e) {
      errors.push(e?.message);
    }
  
    if (errors.length > 0) {
      throw [400, errors];
    }
  
    const requestCollection = await requests();
    const requestList = await requestCollection.find({ receiver_email: receiver_email, status: "pending" })
    .sort({ "event.created_at": -1 }).toArray();
  
    return requestList;
  };

  const removeSchedule = async (scheduleId) => {
    try {
      const scheduleCollection = await schedules();
      const deletionInfo = await scheduleCollection.findOneAndDelete({
        _id: new ObjectId(scheduleId),
      });
      if (deletionInfo.deletedCount === 0) {
        throw `Could not delete schedule with id ${scheduleId}`;
      }
      return true;
    } catch (error) {
      console.error(`Error occurred while deleting schedule: ${error}`);
      return false;
    }
  };

  const updateSchedule = async (scheduleId, updatedData) => {
    try {
      scheduleId = validations.checkId(scheduleId, "scheduleId");
  
      const scheduleCollection = await schedules();
      const existingSchedule = await scheduleCollection.findOne({ _id: new ObjectId(scheduleId) });
  
      if (!existingSchedule) {
        throw new Error(`Schedule not found with id ${scheduleId}`);
      }
  
      const updatedSchedule = {
        ...existingSchedule,
        ...updatedData,
        updated_at: new Date(),
      };
  
      const result = await scheduleCollection.updateOne(
        { _id: new ObjectId(scheduleId) },
        { $set: updatedSchedule }
      );
  
      if (result.modifiedCount === 0) {
        throw new Error(`Failed to update schedule with id ${scheduleId}`);
      }
  
      return true;
    } catch (error) {
      console.error(`Error occurred while updating schedule: ${error}`);
      return false;
    }
  };
  

export default {createRequest, getRequestsByEmail, getAllRequestsByEmail}