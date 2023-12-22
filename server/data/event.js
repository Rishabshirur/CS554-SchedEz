import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import { schedules } from "../config/mongoCollections.js";
import { events } from "../config/mongoCollections.js";
import requestData from './requests.js'
import validations from '../validation.js'

// const client = redis.createClient();

// (async () => {
//   await client.connect();
// })();

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
    
  
    const eventsCollection = await events();
    const newEvent = {
      
      userId: userId,
      event_name: eventData.eventName,
      start_datetime: eventData.startDateTime,
      end_datetime: eventData.endDateTime,
      color_code: eventData.color,
      classification: eventData.desc,
      schedule_name: eventData.schedule,
      created_at: new Date(),
      updated_at: new Date(),
    };


  
    const userCollection = await users();
    let user = await userCollection.findOne(
      { uid: userId}
    );
    if (!user) {
      throw [404, "User not found with this userId"];
    }

    let receivers;
    if (eventData.shareEvent) {
      receivers = eventData.shareEvent.split(',').map(email => email.trim());
      console.log(receivers);
      for (let receiver_emailId of receivers) {
          let receiver = await userCollection.findOne({ email: receiver_emailId });
          if (!receiver) {
              throw [404, `No user exists with emailId: ${receiver_emailId}`];
          }
      }  
    }
    const insert = await eventsCollection.insertOne(newEvent);
    if (!insert.acknowledged || !insert.insertedId) {
      throw [404, "Could not create new event"];
    }

    if (eventData.shareEvent) {
      for (let receiver_emailId of receivers) {
          let receiverInsertInfo = await requestData.createRequest(user.email, receiver_emailId, newEvent);
          if (!receiverInsertInfo.requestId) {
              throw [404, "Could not add new request"];
          }
      }
    }
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
      const eventsCollection = await events();
      const eventDetail = await eventsCollection.find({ _id: new ObjectId(id) }).toArray();
  
      if (eventDetail.length === 0) {
        throw new Error("No schedule with that id");
      }
      return eventDetail || [];
    } catch (error) {
      throw new Error(error.message || "Error fetching event details by ID");
    }
  };
  
  const eventUserCount = async (id) => {

    console.log(id)
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      throw new Error("Invalid id");
    }
    id = id.trim();
  
    if (!ObjectId.isValid(id)) {
      throw new Error("invalid object ID");
    }
  
    try {
      const eventsCollection = await events();
      const myEvent = await eventsCollection.findOne({ _id: new ObjectId(id) });

      const userCollection = await users();
      const allusers = await userCollection.find().toArray();
      let userCount = 1;
      allusers.forEach((element) => {
        console.log(element.events.attending)
        if(element.events.attending){
          if(element.events.attending.includes(id)){
            userCount++;
          }
        }
      });
  
  
      return userCount;
    } catch (error) {
      throw new Error(error.message || "Error fetching event details by ID");
    }
  };

  const getEventsByUser = async (userId) => { 
    const eventsCollection = await events();
    const usersCollection = await users();
    const user = await usersCollection.findOne({ uid: userId });

    if (!user) {
      throw [404, "User not found"];
    }

    const { attending, organizing } = user.events;
    const allEventIds = [...attending, ...organizing];

    if (allEventIds.length === 0) {
      throw [404, "No events found for this user"];
    }


    const eventsList = await eventsCollection.find({
      "_id": { $in: allEventIds.map(id =>new ObjectId(id)) }
    }).toArray();

    if (eventsList.length === 0) {
      throw [404, "No events found for this user"];
    }
    return eventsList;
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
  
      // Clear the corresponding event cache in Redis upon successful deletion
      // await client.del(`event:${eventId}`);
  
      return true;
    } catch (error) {
      console.error(`Error occurred while deleting event: ${error}`);
      return false;
    }
  };
  

  const updateEvent = async (eventId, updatedData) => {
    try {
      eventId = validations.checkId(eventId, "eventId");
  
      const eventsCollection = await events();
      const existingEvent = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
  
      if (!existingEvent) {
        throw new Error(`Event not found with id ${eventId}`);
      }
     
      let updatedEvent = {};

      (updatedData.event_name) ? (updatedEvent.event_name = updatedData.event_name) : (updatedEvent.event_name = existingEvent.event_name);
      (updatedData.start_datetime) ? (updatedEvent.start_datetime = updatedData.start_datetime) : (updatedEvent.start_datetime = existingEvent.start_datetime);
      (updatedData.end_datetime) ? (updatedEvent.end_datetime = updatedData.end_datetime) : (updatedEvent.end_datetime = existingEvent.end_datetime);
      (updatedData.color_code) ? (updatedEvent.color_code = updatedData.color_code) : (updatedEvent.color_code = existingEvent.color_code);
      (updatedData.classification) ? (updatedEvent.classification = updatedData.classification) : (updatedEvent.classification = existingEvent.classification);
      
      if(updatedEvent){
        updatedEvent.updated_at = new Date()
      }
      const result = await eventsCollection.updateOne(
        { _id: new ObjectId(eventId) },
        { $set: updatedEvent }
      );

      if (result.modifiedCount === 0) {
        throw new Error(`Failed to update event with id ${eventId}`);
      }
  
      return true;
    } catch (error) {
      console.error(`Error occurred while updating event: ${error}`);
      return false;
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
      // const existEvents = await client.exists(`schedule:${scheduleId}`);
      // if (existEvents) {
      //   const cachedEvents = await client.get(`schedule:${scheduleId}`);
      //   return JSON.parse(cachedEvents);
      // }
  
      // Fetch events from MongoDB if not found in the cache
      const eventsCollection = await events();
      const events = await eventsCollection.find({ scheduleId: new ObjectId(scheduleId) }).toArray();
  
      if (events.length === 0) {
        throw [404, "No events found for this schedule"];
      }
  
      // Cache the events fetched from the database in Redis
      // await client.set(`schedule:${scheduleId}`, JSON.stringify(events));
  
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
      // const isCached = await client.exists(cacheKey);
      // if (isCached) {
      //   const cachedAvailability = await client.get(cacheKey);
      //   return JSON.parse(cachedAvailability);
      // }
  
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
      // await client.set(cacheKey, JSON.stringify(isAvailable));
  
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
      // const isCached = await client.exists(`eventsDateRange:${scheduleId}:${startDate}:${endDate}`);
      // if (isCached) {
      //   const cachedEvents = await client.get(`eventsDateRange:${scheduleId}:${startDate}:${endDate}`);
      //   return JSON.parse(cachedEvents);
      // }
  
      // Fetch events within the date range from MongoDB if not found in the cache
      const eventsCollection = await events();
      const eventsWithinDateRange = await eventsCollection.find({
        scheduleId: new ObjectId(scheduleId),
        start_datetime: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }).toArray();
  
      // Cache the events within the date range in Redis
      // await client.set(`eventsDateRange:${scheduleId}:${startDate}:${endDate}`, JSON.stringify(eventsWithinDateRange));
  
      return eventsWithinDateRange;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by date range");
    }
  };

  const getEventsByColorCode = async (colorCode) => {
    const eventsCollection = await events();
  
    try {
      // Check if events by color code are cached in Redis
      // const isCached = await client.exists(`eventsByColorCode:${colorCode}`);
      // if (isCached) {
      //   const cachedEvents = await client.get(`eventsByColorCode:${colorCode}`);
      //   return JSON.parse(cachedEvents);
      // }
  
      // Fetch events by color code from MongoDB if not found in the cache
      const eventsByColorCode = await eventsCollection.find({
        color_code: colorCode,
      }).toArray();
  
      // Cache the events by color code in Redis
      // await client.set(`eventsByColorCode:${colorCode}`, JSON.stringify(eventsByColorCode));
  
      return eventsByColorCode;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by color code");
    }
  };


   const getEventsByColorCodeperUser = async (userId, colorCode) => {
    const eventsCollection = await events();
  
    try {
      // Check if events by color code per user are cached in Redis
      // const isCached = await client.exists(`eventsByColorCodePerUser:${userId}:${colorCode}`);
      // if (isCached) {
      //   const cachedEvents = await client.get(`eventsByColorCodePerUser:${userId}:${colorCode}`);
      //   return JSON.parse(cachedEvents);
      // }
  
      // Fetch events by color code per user from MongoDB if not found in the cache
      const eventsByColorCode = await eventsCollection.find({
        userId: userId,
        color_code: colorCode,
      }).toArray();
  
      // Cache the events by color code per user in Redis
      // await client.set(`eventsByColorCodePerUser:${userId}:${colorCode}`, JSON.stringify(eventsByColorCode));
  
      return eventsByColorCode;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by color code per user");
    }
  };
  
  const getEventsByStartDate = async (startDate) => {
    const eventsCollection = await events();
  
    try {
      // Check if events by start date are cached in Redis
      // const isCached = await client.exists(`eventsByStartDate:${startDate}`);
      // if (isCached) {
      //   const cachedEvents = await client.get(`eventsByStartDate:${startDate}`);
      //   return JSON.parse(cachedEvents);
      // }
  
      // Fetch events by start date from MongoDB if not found in the cache
      const eventsByStartDate = await eventsCollection.find({
        start_datetime: { $gte: new Date(startDate) },
      }).toArray();
  
      // Cache the events by start date in Redis
      // await client.set(`eventsByStartDate:${startDate}`, JSON.stringify(eventsByStartDate));
  
      return eventsByStartDate;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by start date");
    }
  };
  
  
  const getEventsByEndDate = async (endDate) => {
    const eventsCollection = await events();
  
    try {
      // Check if events by end date are cached in Redis
      // const isCached = await client.exists(`eventsByEndDate:${endDate}`);
      // if (isCached) {
      //   const cachedEvents = await client.get(`eventsByEndDate:${endDate}`);
      //   return JSON.parse(cachedEvents);
      // }
  
      // Fetch events by end date from MongoDB if not found in the cache
      const eventByEndDate = await eventsCollection.find({
        end_datetime: { $lte: new Date(endDate) },
      }).toArray();
  
      // Cache the events by end date in Redis
      // await client.set(`eventsByEndDate:${endDate}`, JSON.stringify(eventByEndDate));
  
      return eventByEndDate;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by end date");
    }
  };
  
  
  
  const getEventsByClassification = async (classification) => {
    const eventsCollection = await events();
  
    try {
      // Check if events by classification are cached in Redis
      // const isCached = await client.exists(`eventsByClassification:${classification}`);
      // if (isCached) {
      //   const cachedEvents = await client.get(`eventsByClassification:${classification}`);
      //   return JSON.parse(cachedEvents);
      // }
  
      // Fetch events by classification from MongoDB if not found in the cache
      const eventByClassification = await eventsCollection.find({
        classification,
      }).toArray();
  
      // Cache the events by classification in Redis
      // await client.set(`eventsByClassification:${classification}`, JSON.stringify(eventByClassification));
  
      return eventByClassification;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by classification");
    }
  };

  const getEventsByClassificationByUser = async (userId, classification) => {
    const eventsCollection = await events();
  
    try {
      // Check if events by classification per user are cached in Redis
      // const isCached = await client.exists(`eventsByClassificationByUser:${userId}:${classification}`);
      // if (isCached) {
      //   const cachedEvents = await client.get(`eventsByClassificationByUser:${userId}:${classification}`);
      //   return JSON.parse(cachedEvents);
      // }
  
      // Fetch events by classification per user from MongoDB if not found in the cache
      const eventByClassification = await eventsCollection.find({
        userId: userId,
        classification: classification,
      }).toArray();
  
      // Cache the events by classification per user in Redis
      // await client.set(`eventsByClassificationByUser:${userId}:${classification}`, JSON.stringify(eventByClassification));
  
      return eventByClassification;
    } catch (error) {
      throw new Error(error.message || "Error fetching events by classification per user");
    }
  };
  
  
  
    export default {createEvent,getEventById,getEventsByUser,removeEvent,updateEvent,getEventsBySchedule,
      checkEventAvailability,eventUserCount,getEventsByDateRange,getEventsByColorCode,getEventsByStartDate,getEventsByEndDate,getEventsByClassification,getEventsByColorCodeperUser,getEventsByClassificationByUser}