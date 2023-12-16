import {Router} from 'express';
import {scheduleData} from '../data/index.js'
import { ObjectId } from "mongodb";
import validations from '../validation.js'


const router = Router();

router.post("/", async (req, res) => {
    let scheduleInfo = req.body;
    let errors = [];
    try {
      scheduleInfo.userId = validations.checkId(scheduleInfo.userId, "userId");
    } catch (e) {
      console.log(e);
      errors.push(e?.message);
    }
  
    try {
      scheduleInfo.scheduleName = validations.checkString(
        scheduleInfo.scheduleName,
        "schedule name"
      );
    } catch (e) {
      console.log(e);
      console.error(e);
      errors.push(e?.message);
    }
  console.log("error check",errors)
    if (errors.length > 0) {
      return res.status(400).send(errors.message);
    }
  
    try {
      const result = await scheduleData.createSchedule(
        scheduleInfo.userId,
        scheduleInfo.scheduleName
      );
      return res.json(result);
    } catch (e) {
      console.error(e);
      const msg = e?.[1] || e?.message;
      return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      let userId = req.params.id;
      let errors = [];
      try {
        userId = validations.checkId(userId, "userId");
      } catch (e) {
        console.log(e);
        errors.push(e?.message);
      }
      if (errors.length > 0) {
        return res.status(400).send(errors);
      }
  
      const schedules = await scheduleData.getScheduleByUser(userId);
      return res.json({ schedules });
    } catch (e) {
      const msg = e?.[1] || e?.message;
      return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }
  });

  router.delete("/:id", async (req, res) => {
    const id = req.params.id;
  
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid schedule ID" });
    }
  
    try {
      const success = await scheduleData.removeSchedule(id);
      if (!success) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      return res.json({ scheduleId: id, deleted: true });
    } catch (e) {
      const msg = e?.[1] || e?.message;
      return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }
  });

  router.patch("/:id", async (req, res) => {
    const scheduleId = req.params.id;
    const updatedData = req.body;
  
    try {
      scheduleId = validations.checkId(scheduleId, "scheduleId");
  
      const success = await scheduleData.updateSchedule(scheduleId, updatedData);
  
      if (success) {
        return res.json({ message: "Schedule updated successfully" });
      } else {
        return res.status(404).json({ message: `Schedule not found with id ${scheduleId}` });
      }
    } catch (e) {
      const msg = e?.[1] || e?.message;
      return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }
  });

  export default router;