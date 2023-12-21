import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import { schedules } from "../config/mongoCollections.js";
import validations from '../validation.js'


// const client = redis.createClient();

// (async () => {
//   await client.connect();
// })();

const createSchedule = async (userId, scheduleName) => {

    let errors = [];
    try {
      userId = validations.checkId(userId, "userId");
    } catch (e) {
      errors.push(e?.message);
    }

    try {
        scheduleName = validations.checkString(scheduleName, "Schedule Name");
      } catch (e) {
        errors.push(e?.message);
      }
    
      if (errors.length > 0) {
        throw [400, errors];
      }

    const userCollection = await users();
    const user = await userCollection.findOne(
    { uid: userId }
  );
  if (!user) {
    throw [404, "User not found with this userId "];
  }

    const scheduleCollection = await schedules();
    const newSchedule = {
        userId: userId,
        schedule_name: scheduleName,
        created_at: new Date(),
        updated_at: new Date(),
    }
    const insert = await scheduleCollection.insertOne(newSchedule)

    if (!insert.acknowledged || !insert.insertedId)
    throw [404, "Could not create new schedule"];

    const insertedId = insert.insertedId.toString();

     // Cache the newly created schedule in Redis
    // await client.set(`schedule:${insertedId}`, JSON.stringify(newSchedule));

    return { scheduleId: insertedId };
}

const getscheduleById = async (id) => {
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    throw new Error("Invalid id");
  }
  id = id.trim();

  if (!ObjectId.isValid(id)) {
    throw new Error("invalid object ID");
  }

  try {
    // Check if the schedule with the given ID exists in the Redis cache
    // const existSchedule = await client.exists(`schedule:${id}`);
    // if (existSchedule) {
    //   const cachedSchedule = await client.get(`schedule:${id}`);
    //   return JSON.parse(cachedSchedule);
    // }

    // Fetch schedule details from MongoDB if not found in the cache
    const scheduleCollection = await schedules();
    const schedule = await scheduleCollection.find({ userId: id }).toArray();

    if (schedule === null) {
      throw new Error("No schedule with that id");
    }

    // Cache the schedule fetched from the database in Redis
    // await client.set(`schedule:${id}`, JSON.stringify(schedule));

    return schedule || [];
  } catch (error) {
    throw new Error(error.message || "Error fetching schedule details by ID");
  }
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

  try {
    // Check if the schedule for the user exists in the Redis cache
    // const existSchedule = await client.exists(`userSchedule:${userId}`);
    // if (existSchedule) {
    //   const cachedUserSchedule = await client.get(`userSchedule:${userId}`);
    //   return JSON.parse(cachedUserSchedule);
    // }

    // Fetch schedule details from MongoDB if not found in the cache
    const scheduleCollection = await schedules();
    const schedule = await scheduleCollection.find({ userId: userId }).toArray();

    if (schedule.length === 0) {
      throw [404, "No schedules found for this user"];
    }

    // Cache the user's schedule fetched from the database in Redis
    // await client.set(`userSchedule:${userId}`, JSON.stringify(schedule));

    return schedule;
  } catch (error) {
    throw new Error(error.message || "Error fetching schedule details by user ID");
  }
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

    // Clear the corresponding schedule cache in Redis upon successful deletion
    // await client.del(`schedule:${scheduleId}`);

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
  

export default {createSchedule,getscheduleById, getScheduleByUser,removeSchedule,updateSchedule}