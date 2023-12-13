import {Router} from 'express';
import {eventData} from '../data/index.js'
import { ObjectId } from "mongodb";
import validations from '../validation.js'
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
    newEvent.startDateTime = newEvent.startDateTime.trim();
    newEvent.endDateTime = newEvent.endDateTime.trim()
    newEvent.color = validations.checkString(newEvent.color, "Color Code");
    newEvent.desc = validations.checkString(newEvent.desc, "Classification");
  } catch (error) {
    return res.status(400).json({error: 'Bad Input'})
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
    const eventId = req.params.eventId;
    const updatedData = req.body;
  
    // try {
    //   req.body.userId = validations.checkString(req.body.userId, "userId");
    //   newEvent.eventName = validations.checkString(newEvent.eventName, "Event Name");
    //   validations.checkDate(newEvent.startDateTime, "Start Date and Time");
    //   validations.checkDate(newEvent.endDateTime, "End Date and Time");
    //   newEvent.startDateTime = newEvent.startDateTime.trim();
    //   newEvent.endDateTime = newEvent.endDateTime.trim()
    //   newEvent.color = validations.checkString(newEvent.color, "Color Code");
    //   newEvent.desc = validations.checkString(newEvent.desc, "Classification");
    // } catch (error) {
    //   return res.status(400).json({error: 'Bad Input'})
    // }
    try {
      eventId = validations.checkId(eventId, "eventId");
  
      const success = await eventData.updateEvent(eventId, updatedData);
  
      if (success) {
        return res.json({ message: "Event updated successfully" });
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