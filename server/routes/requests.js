import {Router} from 'express';
import {requestData} from '../data/index.js'
import { ObjectId } from "mongodb";
import validations from '../validation.js'
import { users, requests } from '../config/mongoCollections.js';


const router = Router();

router.post("/", async (req, res) => {
    let requestInfo = req.body;
    let errors = [];
    try {
        requestInfo.sender_email = validations.checkId(requestInfo.sender_email, "userId");
    } catch (e) {
      console.log(e);
      errors.push(e?.message);
    }
  
    try {
        requestInfo.scheduleName = validations.checkString(
            requestInfo.scheduleName,
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
      const result = await requestData.createRequest(
        requestInfo.userId,
        requestInfo.scheduleName
      );
      return res.json(result);
    } catch (e) {
      console.error(e);
      const msg = e?.[1] || e?.message;
      return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }
  });

  router.get("/:emailId", async (req, res) => {
    try {
      let receiver_email = req.params.emailId;
      let errors = [];
      try {
        receiver_email = validations.checkMailID(receiver_email, "receiver emailId");
      } catch (e) {
        console.log(e);
        errors.push(e?.message);
      }
      if (errors.length > 0) {
        return res.status(400).send(errors);
      }
  
      const requests = await requestData.getRequestsByEmail(receiver_email);
      return res.json({ requests });
    } catch (e) {
      const msg = e?.[1] || e?.message;
      return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }
  });

  router.post("/accept", async (req, res) => {
    let requestInfo = req.body;
    let errors = [];
    try {
        requestInfo.requestId = validations.checkId(requestInfo.requestId, "requestId");
        requestInfo.userId = validations.checkId(requestInfo.userId, "userId");
        requestInfo.eventId = validations.checkId(requestInfo.eventId, "eventId");
    } catch (e) {
      console.log(e);
      errors.push(e?.message);
    }
    const userCollection= await users();
    let result;
    try {
        
        result = await userCollection.updateOne(
            { "uid": requestInfo.userId }, 
            {
              $push: { "events.attending": requestInfo.eventId }
            }
          );
        if (result.modifiedCount === 0) {
            return res.status(404).send({ errors: ["Event not added"] });
        }  
        
    } catch (e) {
        console.error(e);
        const msg = e?.[1] || e?.message;
        return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }

    try {
        const requestCollection = await requests();
        const result1 = await requestCollection.updateOne(
          { "_id": new ObjectId(requestInfo.requestId) }, 
          {
            $set: { status: "accepted" } 
          }
        );
        console.log("result",result1)
        if (result1.modifiedCount === 0) {
            return res.status(404).send({ errors: ["Request not found"] });
        }
    } catch (e) {
        console.error(e);
        const msg = e?.[1] || e?.message;
        return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }


    return res.json(result);
  });

router.post("/reject", async (req, res) => {
    let requestInfo = req.body;
    let errors = [];
    try {
        requestInfo.requestId = validations.checkId(requestInfo.requestId, "requestId");
        requestInfo.userId = validations.checkId(requestInfo.userId, "userId");
        requestInfo.eventId = validations.checkId(requestInfo.eventId, "eventId");
    } catch (e) {
      console.log(e);
      errors.push(e?.message);
    }

    let result;
    try {
        const requestCollection = await requests();
        result = await requestCollection.updateOne(
          { "_id": new ObjectId(requestInfo.requestId) }, 
          {
            $set: { status: "rejected" } 
          }
        );
        // console.log("result",result)
        if (result.modifiedCount === 0) {
            return res.status(404).send({ errors: ["Request not found"] });
        }
        return res.json(result);

    } catch (e) {
        console.error(e);
        const msg = e?.[1] || e?.message;
        return res.status(e?.[0] || 500).send({ errors: msg || "Internal Server Error" });
    }
  })
  export default router;