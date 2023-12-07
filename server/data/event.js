import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import { schedules } from "../config/mongoCollections.js";
import { events } from "../config/mongoCollections.js";
import validations from '../validation.js'
import redis from 'redis';

const client = redis.createClient();

(async () => {
  await client.connect();
})();


const createEvent = async (userId, eventData) => {
// const createEvent = async (userId, scheduleId, eventData) => {
    let errors = [];
  
    try {
      // userId = validations.checkId(userId, "userId");
      // scheduleId = validations.checkId(scheduleId, "scheduleId");
    } catch (e) {
      errors.push(e?.message);
    }
  
    try {
    //   validations.checkString(eventData.eventName, "Event Name");
    //  //do validation for other inputs
    //   validations.checkString(eventData.classification, "Classification");
    } catch (e) {
      errors.push(e?.message);
    }
  
    if (errors.length > 0) {
      throw [400, errors];
    }
  
    
    console.log("in data events")
    // if (!user) {
    //   throw [404, "User not found with this userId"];
    // }
  
    const eventsCollection = await events();
    const newEvent = {
      // userId: new ObjectId(userId),
      userId: userId,
      // scheduleId: new ObjectId(scheduleId),
      event_name: eventData.eventName,
      // start_datetime: new Date(eventData.start_datetime),
      // end_datetime: new Date(eventData.end_datetime),
      start_datetime: eventData.startDateTime,
      end_datetime: eventData.endDateTime,
      color_code: eventData.color,
      classification: eventData.desc,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
  
    const insert = await eventsCollection.insertOne(newEvent);
    if (!insert.acknowledged || !insert.insertedId) {
      throw [404, "Could not create new event"];
    }
    const userCollection = await users();
    let user = await userCollection.findOne(
      { uid: userId}
    );
    
    console.log(user)
    user.events.organizing.push(insert.insertedId.toString())
    const updatedInfo = await userCollection.findOneAndUpdate({ uid: userId }, {
      $set: user
    }, {returnDocument: 'after'});
    if (updatedInfo.lastErrorObject.n === 0) {
      throw  'Failed to update the user collection';
    }
    
  
    const insertedId = insert.insertedId.toString();
    return { eventId: insertedId };
  };

  const getEventById = async (id) => {
    console.log(id)
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      throw new Error("Invalid id");
    }
    id = id.trim();
  
    if (!ObjectId.isValid(id)) {
      throw new Error("invalid object ID");
    }
  
    try {
      // Check if the event with the given ID exists in the Redis cache
      const existEvent = await client.exists(`event:${id}`);
      if (existEvent) {
        const cachedEvent = await client.get(`event:${id}`);
        return JSON.parse(cachedEvent);
      }
  
      // Fetch event details from MongoDB if not found in the cache
      const eventsCollection = await events();
      const eventDetail = await eventsCollection.find({ _id: new ObjectId(id) }).toArray();
  
      if (eventDetail.length === 0) {
        throw new Error("No schedule with that id");
      }
  
      // Cache the event fetched from the database in Redis
      await client.set(`event:${id}`, JSON.stringify(eventDetail));
  
      return eventDetail || [];
    } catch (error) {
      throw new Error(error.message || "Error fetching event details by ID");
    }
  };
  
  

  const getEventsByUser = async (userId) => {
    try {
      const existEvents = await client.exists(`user:${userId}`);
      if (existEvents) {
        const cachedEvents = await client.get(`user:${userId}`);
        return JSON.parse(cachedEvents);
      }
  
      // Fetch events from MongoDB if not found in the cache
      const eventsCollection = await events();
      const eventsList = await eventsCollection.find({ userId: userId }).toArray();
  
      if (eventsList.length === 0) {
        throw [404, "No events found for this user"];
      }
  
      // Cache the events fetched from the database in Redis
      await client.set(`user:${userId}`, JSON.stringify(eventsList));
  
      return eventsList;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by user");
    }
  };

  const removeEvent = async (eventId) => {
    try {
      const eventsCollection = await events();
      const deletionInfo = await eventsCollection.findOneAndDelete({
        _id: new ObjectId(eventId),
      });
      if (deletionInfo.deletedCount === 0) {
        throw `Could not delete event with id ${eventId}`;
      }
      return true;
    } catch (error) {
      console.error(`Error occurred while deleting event: ${error}`);
      return false;
    }
  };


  const updateEvent = async (eventId, updatedData) => {
    console.log("Updated Data:", updatedData);

    let errors = [];
  
    try {
      // Perform any validations if needed
      // validations.checkString(updatedData.eventName, "Event Name");
      // validations.checkString(updatedData.classification, "Classification");
      // Add validations for other fields if necessary
    } catch (e) {
      errors.push(e?.message);
    }
  
    if (errors.length > 0) {
      throw [400, errors];
    }
  
    const eventsCollection = await events(); // Assuming this function fetches the events collection
  
    try {
      // Get the existing event data from the database
      const existingEvent = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
  
      if (!existingEvent) {
        throw [404, "Event not found"];
      }
  
      // Prepare an object to store the updated fields
      const updatedFields = {};
  
      // Check each field in updatedData and update if it exists
      if (updatedData.userId) {
        updatedFields.userId = updatedData.userId;
      }
      if (updatedData.eventName) {
        updatedFields.event_name = updatedData.eventName;
      }
      if (updatedData.eventName) {
        updatedData.event_name = updatedData.eventName;
      }
      console.log("Updated Data with Assigned Name:", updatedData); // Log to confirm the assignment
      
      if (updatedData.startDateTime) {
        updatedFields.start_datetime = updatedData.startDateTime;
      }
      if (updatedData.endDateTime) {
        updatedFields.end_datetime = updatedData.endDateTime;
      }
      if (updatedData.color) {
        updatedFields.color_code = updatedData.color;
      }
      if (updatedData.desc) {
        updatedFields.classification = updatedData.desc;
      }
  
      // Add the updated_at field
      updatedFields.updated_at = new Date();
  
      // Log the update query being executed
     
  
      // Update the event in the database by converting eventId to ObjectId
      const updatedResult = await eventsCollection.findOneAndUpdate(
        { _id: new ObjectId(eventId) },
        { $set: updatedFields },
        { returnDocument: "after" }
      );

      console.log("Update Query:", { _id: new ObjectId(eventId) }, { $set: updatedFields });
  
      // Log the updated result
      console.log("Updated Result:", updatedResult);
  
      if (!updatedResult.value) {
        throw [404, "Event not found"];
      }
  
      return updatedResult.value;
    } catch (error) {
      console.error("Error updating event:", error);
      throw [500, "Error updating event"];
    }
  };
  

  const getEventsBySchedule = async (scheduleId) => {
    let errors = [];
  
    try {
      scheduleId = validations.checkId(scheduleId, "scheduleId");
    } catch (e) {
      errors.push(e?.message);
    }
  
    if (errors.length > 0) {
      throw [400, errors];
    }
  
    try {
      // Check if events for the schedule exist in the Redis cache
      const existEvents = await client.exists(`schedule:${scheduleId}`);
      if (existEvents) {
        const cachedEvents = await client.get(`schedule:${scheduleId}`);
        return JSON.parse(cachedEvents);
      }
  
      // Fetch events from MongoDB if not found in the cache
      const eventsCollection = await events();
      const events = await eventsCollection.find({ scheduleId: new ObjectId(scheduleId) }).toArray();
  
      if (events.length === 0) {
        throw [404, "No events found for this schedule"];
      }
  
      // Cache the events fetched from the database in Redis
      await client.set(`schedule:${scheduleId}`, JSON.stringify(events));
  
      return events;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by schedule");
    }
  };
  
  
  const checkEventAvailability = async (scheduleId, startDateTime, endDateTime) => {
    let errors = [];
  
    try {
      scheduleId = validations.checkId(scheduleId, "scheduleId");
  
      // Perform validation for startDateTime and endDateTime
      const startTime = new Date(startDateTime);
      const endTime = new Date(endDateTime);
  
      if (startTime >= endTime) {
        throw new Error("Start Date and Time must be before End Date and Time.");
      }
    } catch (e) {
      errors.push(e?.message);
    }
  
    if (errors.length > 0) {
      throw [400, errors];
    }
  
    const cacheKey = `eventAvailability:${scheduleId}:${startDateTime}:${endDateTime}`;
  
    try {
      // Check if event availability is cached in Redis
      const isCached = await client.exists(cacheKey);
      if (isCached) {
        const cachedAvailability = await client.get(cacheKey);
        return JSON.parse(cachedAvailability);
      }
  
      // Fetch event availability from MongoDB if not found in the cache
      const eventsCollection = await events();
      const overlappingEvents = await eventsCollection.find({
        scheduleId: new ObjectId(scheduleId),
        $or: [
          {
            start_datetime: { $lt: new Date(endDateTime) },
            end_datetime: { $gt: new Date(startDateTime) }
          }
        ]
      }).toArray();
  
      const isAvailable = overlappingEvents.length === 0;
  
      // Cache the event availability in Redis
      await client.set(cacheKey, JSON.stringify(isAvailable));
  
      return isAvailable;
    } catch (error) {
      throw new Error(error.message || "Error checking event availability");
    }
  };
  
  
  const getEventsByDateRange = async (scheduleId, startDate, endDate) => {
    let errors = [];
  
    try {
      scheduleId = validations.checkId(scheduleId, "scheduleId");
      // Perform validation for startDate and endDate
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);
  
      if (startDateTime >= endDateTime) {
        throw new Error("Start Date must be before End Date.");
      }
    } catch (e) {
      errors.push(e?.message);
    }
  
    if (errors.length > 0) {
      throw [400, errors];
    }
  
    try {
      // Check if events within the date range are cached in Redis
      const isCached = await client.exists(`eventsDateRange:${scheduleId}:${startDate}:${endDate}`);
      if (isCached) {
        const cachedEvents = await client.get(`eventsDateRange:${scheduleId}:${startDate}:${endDate}`);
        return JSON.parse(cachedEvents);
      }
  
      // Fetch events within the date range from MongoDB if not found in the cache
      const eventsCollection = await events();
      const eventsWithinDateRange = await eventsCollection.find({
        scheduleId: new ObjectId(scheduleId),
        start_datetime: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }).toArray();
  
      // Cache the events within the date range in Redis
      await client.set(`eventsDateRange:${scheduleId}:${startDate}:${endDate}`, JSON.stringify(eventsWithinDateRange));
  
      return eventsWithinDateRange;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by date range");
    }
  };
  
  


  const getEventsByColorCode = async (colorCode) => {
    const eventsCollection = await events();
  
    try {
      // Check if events by color code are cached in Redis
      const isCached = await client.exists(`eventsByColorCode:${colorCode}`);
      if (isCached) {
        const cachedEvents = await client.get(`eventsByColorCode:${colorCode}`);
        return JSON.parse(cachedEvents);
      }
  
      // Fetch events by color code from MongoDB if not found in the cache
      const eventsByColorCode = await eventsCollection.find({
        color_code: colorCode,
      }).toArray();
  
      // Cache the events by color code in Redis
      await client.set(`eventsByColorCode:${colorCode}`, JSON.stringify(eventsByColorCode));
  
      return eventsByColorCode;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by color code");
    }
  };
  

  const getEventsByColorCodeperUser = async (userId, colorCode) => {
    const eventsCollection = await events();
  
    try {
      // Check if events by color code per user are cached in Redis
      const isCached = await client.exists(`eventsByColorCodePerUser:${userId}:${colorCode}`);
      if (isCached) {
        const cachedEvents = await client.get(`eventsByColorCodePerUser:${userId}:${colorCode}`);
        return JSON.parse(cachedEvents);
      }
  
      // Fetch events by color code per user from MongoDB if not found in the cache
      const eventsByColorCode = await eventsCollection.find({
        userId: userId,
        color_code: colorCode,
      }).toArray();
  
      // Cache the events by color code per user in Redis
      await client.set(`eventsByColorCodePerUser:${userId}:${colorCode}`, JSON.stringify(eventsByColorCode));
  
      return eventsByColorCode;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by color code per user");
    }
  };
  

  const getEventsByStartDate = async (startDate) => {
    const eventsCollection = await events();
  
    try {
      // Check if events by start date are cached in Redis
      const isCached = await client.exists(`eventsByStartDate:${startDate}`);
      if (isCached) {
        const cachedEvents = await client.get(`eventsByStartDate:${startDate}`);
        return JSON.parse(cachedEvents);
      }
  
      // Fetch events by start date from MongoDB if not found in the cache
      const eventsByStartDate = await eventsCollection.find({
        start_datetime: { $gte: new Date(startDate) },
      }).toArray();
  
      // Cache the events by start date in Redis
      await client.set(`eventsByStartDate:${startDate}`, JSON.stringify(eventsByStartDate));
  
      return eventsByStartDate;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by start date");
    }
  };
  


  const getEventsByEndDate = async (endDate) => {
    const eventsCollection = await events();
  
    try {
      // Check if events by end date are cached in Redis
      const isCached = await client.exists(`eventsByEndDate:${endDate}`);
      if (isCached) {
        const cachedEvents = await client.get(`eventsByEndDate:${endDate}`);
        return JSON.parse(cachedEvents);
      }
  
      // Fetch events by end date from MongoDB if not found in the cache
      const eventByEndDate = await eventsCollection.find({
        end_datetime: { $lte: new Date(endDate) },
      }).toArray();
  
      // Cache the events by end date in Redis
      await client.set(`eventsByEndDate:${endDate}`, JSON.stringify(eventByEndDate));
  
      return eventByEndDate;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by end date");
    }
  };
  



  const getEventsByClassification = async (classification) => {
    const eventsCollection = await events();
  
    try {
      // Check if events by classification are cached in Redis
      const isCached = await client.exists(`eventsByClassification:${classification}`);
      if (isCached) {
        const cachedEvents = await client.get(`eventsByClassification:${classification}`);
        return JSON.parse(cachedEvents);
      }
  
      // Fetch events by classification from MongoDB if not found in the cache
      const eventByClassification = await eventsCollection.find({
        classification,
      }).toArray();
  
      // Cache the events by classification in Redis
      await client.set(`eventsByClassification:${classification}`, JSON.stringify(eventByClassification));
  
      return eventByClassification;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by classification");
    }
  };
  

  const getEventsByClassificationByUser = async (userId, classification) => {
    const eventsCollection = await events();
  
    try {
      // Check if events by classification per user are cached in Redis
      const isCached = await client.exists(`eventsByClassificationByUser:${userId}:${classification}`);
      if (isCached) {
        const cachedEvents = await client.get(`eventsByClassificationByUser:${userId}:${classification}`);
        return JSON.parse(cachedEvents);
      }
  
      // Fetch events by classification per user from MongoDB if not found in the cache
      const eventByClassification = await eventsCollection.find({
        userId: userId,
        classification: classification,
      }).toArray();
  
      // Cache the events by classification per user in Redis
      await client.set(`eventsByClassificationByUser:${userId}:${classification}`, JSON.stringify(eventByClassification));
  
      return eventByClassification;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by classification per user");
    }
  };
  



  export default {createEvent,getEventById,getEventsByUser,removeEvent,updateEvent,getEventsBySchedule,
  checkEventAvailability,getEventsByDateRange,getEventsByColorCode,getEventsByStartDate,getEventsByEndDate,getEventsByClassification,getEventsByColorCodeperUser,getEventsByClassificationByUser}