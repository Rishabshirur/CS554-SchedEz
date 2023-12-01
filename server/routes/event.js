import {Router} from 'express';
import {eventData} from '../data/index.js'
import { ObjectId } from "mongodb";
import validations from '../validation.js'


const router = Router();

router.post("/", async (req, res) => {
    const newEvent = req.body;
  
    try {
      // newEvent.userId = validations.checkId(newEvent.userId, "userId");
      // newEvent.event_name = validations.checkString(newEvent.event_name, "Event Name");
      // newEvent.start_datetime = validations.checkDateTime(newEvent.start_datetime, "Start Date and Time");
      // newEvent.end_datetime = validations.checkDateTime(newEvent.end_datetime, "End Date and Time");
      // newEvent.color_code = validations.checkString(newEvent.color_code, "Color Code");
      // newEvent.classification = validations.checkString(newEvent.classification, "Classification");
      console.log(newEvent)
      const createdEvent = await eventData.createEvent(newEvent.userId,newEvent.obj);
      console.log(createdEvent)
      return res.json({ event: createdEvent });
    } catch (e) {
      const msg = e?.[1] || e?.message;
      return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }
  });
  

  router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const userEvents = await eventData.getEventsByUser(userId);
  
      return res.json({ events: userEvents });
    } catch (e) {
      const msg = e?.[1] || e?.message;
      return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }
  });

  router.get("/detail/:id", async (req, res) => {
    const userId = req.params.id;
  
    try {
      const userEvents = await eventData.getEventById(userId);
  
      return res.status(200).json({ events: userEvents });
    } catch (e) {
      const msg = e?.[1] || e?.message;
      return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }
  });
  

  router.patch("/:eventId", async (req, res) => {
    const eventId = req.params.eventId;
    const updatedData = req.body;
  
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
    const eventId = req.params.eventId;
  
    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
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

  router.get('/filter/colorCode/:colorCode', async (req, res) => {
    try {
      const colorCode = req.params.colorCode;
      const events = await eventData.getEventsByColorCode(colorCode);
      res.json({ events });
    } catch (error) {
      console.error('Error filtering events by color code:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/:userId/filter/colorCode/:colorCode', async (req, res) => {
    try {
      const userId = req.params.userId;
      const colorCode = req.params.colorCode;
  
      const events = await eventData.getEventsByColorCodeperUser(userId, colorCode);
      res.json({ events });
    } catch (error) {
      console.error('Error filtering events by color code:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/filter/startDate/:startDate', async (req, res) => {
    try {
      const startDate = req.params.startDate;
      const events = await eventData.getEventsByStartDate(startDate);
      res.json({ events });
    } catch (error) {
      console.error('Error filtering events by start date:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.get('/filter/endDate/:endDate', async (req, res) => {
    try {
      const endDate = req.params.endDate;
      const events = await eventData.getEventsByEndDate(endDate);
      res.json({ events });
    } catch (error) {
      console.error('Error filtering events by end date:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.get('/filter/classification/:classification', async (req, res) => {
    try {
      const classification = req.params.classification;
      const events = await eventData.getEventsByClassification(classification);
      res.json({ events });
    } catch (error) {
      console.error('Error filtering events by classification:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/:userId/filter/classification/:classification', async (req, res) => {
    try {
      const userId = req.params.userId;
      const classification = req.params.classification;
  
      const events = await eventData.getEventsByClassificationByUser(userId, classification);
      res.json({ events });
    } catch (error) {
      console.error('Error filtering events by color code:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default router