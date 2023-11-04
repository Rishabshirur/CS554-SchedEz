import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import { schedules } from "../config/mongoCollections.js";
import validations from '../../validation.js'

const createSchedule = async (userId, scheduleName) => {

    let errors = [];
    try {
      userId = validations.checkId(userId, "userId");
    } catch (e) {
      errors.push(e?.message);
    }

    try {
        message = validations.checkString(scheduleName, "Schedule Name");
      } catch (e) {
        errors.push(e?.message);
      }
    
      if (errors.length > 0) {
        throw [400, errors];
      }

    const userCollection = await users();
    const user = await userCollection.findOne(
    { _id: new ObjectId(userId) },
    { password: 0 }
  );
  if (!user) {
    throw [404, "User not found with this userId "];
  }

    const scheduleCollection = await schedules();
    const newSchedule = {
        user_id: ObjectId(userId),
        schedule_name: scheduleName,
        created_at: new Date(),
        updated_at: new Date(),
    }
    const insert = await scheduleCollection.insert(newSchedule)

    if (!insert.acknowledged || !insert.insertedId)
    throw [404, "Could not create new schedule"];

    const insertedId = insert.insertedId.toString();
    return { scheduleId: insertedId };
}

const getschedule = async (id) => {
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      throw new Error("Invalid id");
    }
    id = id.trim();
  
    if (!ObjectId.isValid(id)) {
      throw new Error("invalid object ID");
    }
  
    const scheduleCollection = await schedules();
    const schedules = await scheduleCollection.find({ userId: id }).toArray();
    if (schedules === null) {
      throw new Error("No schedule with that id");
    }
    return schedules || [];
  };

const getScheduleByUser = async (userId) => {
    let errors = [];
    try {
      userId = validations.checkId(userId, "userId");
    } catch (e) {
      errors.push(e?.message);
    }
  
    if (errors.length > 0) {
      throw [400, errors];
    }
  
    const scheduleCollection = await schedules();
    const schedules = await scheduleCollection.find({ userId: userId }).toArray();
  
    if (schedules.length === 0) {
      throw [404,"No schedules found for this user"];
    }
    return schedules;
  };

  const remove = async (scheduleId) => {
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
  

export {createSchedule,getschedule, getScheduleByUser,remove,updateSchedule}