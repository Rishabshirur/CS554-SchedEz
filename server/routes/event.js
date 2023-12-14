import {Router} from 'express';
import {eventData} from '../data/index.js'
import { ObjectId } from "mongodb";
import validations from '../validation.js'
import { errorType, errorObject } from "../badInputs.js";
import user from '../data/user.js';


const router = Router();

router.post("/", async (req, res) => {
    var newEvent = req.body.obj;
    console.log(req.body.obj);
  try {
    req.body.userId = validations.checkString(req.body.userId, "userId");
    newEvent.eventName = validations.checkString(newEvent.eventName, "Event Name");
    validations.checkDate(newEvent.startDateTime, "Start Date and Time");
    validations.checkDate(newEvent.endDateTime, "End Date and Time");
    var checStartDatetime = new Date(newEvent.startDateTime)
    var checkEndDatetime = new Date(newEvent.endDateTime)
    if(checStartDatetime>=checkEndDatetime){
      throw errorObject(errorType.BAD_INPUT, `Start Datetime cannot be greater than or equal to End Datetime`);
    }
    newEvent.startDateTime = newEvent.startDateTime.trim();
    newEvent.endDateTime = newEvent.endDateTime.trim()
    newEvent.color = validations.checkString(newEvent.color, "Color Code");
    newEvent.desc = validations.checkString(newEvent.desc, "Classification");
  } catch (error) {
    return res.status(400).json({error: error.message})
  }

    try {
      console.log(newEvent)
      const createdEvent = await eventData.createEvent(req.body.userId,newEvent);
      console.log(createdEvent)
      return res.json({ event: createdEvent });
    } catch (e) {
      console.log(e)
      const msg = e?.[1] || e?.message;
      return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }
  });
  

  router.get("/:userId", async (req, res) => {
    var userId = req.params.userId;
    try {
      userId = validations.checkString(userId); 
    } catch (error) {
      return res.status(400).json({error: 'Bad Input'})
    }
    try {
      const userEvents = await eventData.getEventsByUser(userId);
  
      return res.json({ events: userEvents });
    } catch (e) {
      const msg = e?.[1] || e?.message;
      return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }
  });

  router.get("/detail/:id", async (req, res) => {
    var id = req.params.id;
    try {
      id = validations.checkString(id,"Event ID") 
      if (!ObjectId.isValid(id)) {
        throw new Error("invalid event ID");
      }
    } catch (error) {
      return res.status(400).json({error: 'Bad Input'})
    }
    try {
      const userEvents = await eventData.getEventById(id);
  
      return res.status(200).json({ events: userEvents });
    } catch (e) {
      const msg = e?.[1] || e?.message;
      return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }
  });
  

  router.patch("/:eventId", async (req, res) => {
    var eventId = req.params.eventId;
    var updatedData = req.body;
    try {
      eventId = validations.checkString(eventId, "event Id");
      if(!ObjectId.isValid(eventId)){
        throw errorObject(errorType.BAD_INPUT, `Event ID is invalid`)
      }
      if(Object.keys(updatedData).length===0){
        throw errorObject(errorType.NOT_FOUND,"No data found in req body")
      }
      if(updatedData.eventName!==undefined){
      updatedData.eventName = validations.checkString(updatedData.eventName, "Event Name"); 
    }
      if(updatedData.startDateTime!==undefined){
      validations.checkDate(updatedData.startDateTime, "Start Date and Time"); 
      updatedData.startDateTime = updatedData.startDateTime.trim();
    }
    if(updatedData.endDateTime!==undefined){
      validations.checkDate(updatedData.endDateTime, "End Date and Time");
      updatedData.endDateTime = updatedData.endDateTime.trim() }
      if(updatedData.color!==undefined){
      updatedData.color = validations.checkString(updatedData.color, "Color Code"); 
    }
    if(updatedData.desc!==undefined){
      updatedData.desc = validations.checkString(updatedData.desc, "Classification"); 
    }
    } catch (error) {
      return res.status(400).json({error: error.message})
    }
    try {
  
      const success = await eventData.updateEvent(eventId, updatedData);
  
      if (success) {
        return res.status(200).json({ message: "Event updated successfully" });
      } else {
        return res.status(404).json({ message: `Event not found with id ${eventId}` });
      }
    } catch (e) {
      const msg = e?.[1] || e?.message;
      return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }
  });
  

  router.delete("/:eventId", async (req, res) => {
    var eventId = req.params.eventId;
  
    try {
      eventId = validations.checkString(eventId)
      if (!ObjectId.isValid(eventId)) {
        throw "Invalid eventId"
      } 
    } catch (error) {
      return res.status(400).json({error: 'Bad Input'})
    }
  
    try {
      const success = await eventData.removeEvent(eventId);
  
      if (!success) {
        return res.status(404).json({ message: `Event not found with id ${eventId}` });
      }
  
      return res.json({ eventId: eventId, deleted: true });
    } catch (e) {
      const msg = e?.[1] || e?.message;
      return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }
  });

export default router