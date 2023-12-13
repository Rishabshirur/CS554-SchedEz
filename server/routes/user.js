import { Router } from "express";
import { userData } from "../data/index.js";
import validation from '../validation.js'
import { ObjectId } from "mongodb";

const router = Router();

router.get("/all-users", async (req, res) => {
    try {
      if(req.query.isActive !== 'true' && req.query.isActive !== 'false'){
        return res.status(400).send("Query Parameter isActive is set wrong")
      }
      const response = await userData.getAllUsers(req.query);
      return res.status(200).send(response);
    } catch (e) {
      return res.status(e[0] || 500).send({ message: e[1] || "Internal Server Error" });
    };
  })
  
router.post("/all-users", async (req,res) => {
    const response = req.body
    // try {
    //   const id = req.body.id;
    //   if (!ObjectId.isValid(id)) {
    //     throw new Error('Invalid id');
    //   }
    // } catch (error) {
    //   if (error.message === 'Invalid id') {
    //     return res.status(400).json({ error: 'Invalid id' });
    //   } else if (error.message === 'No user with that id') {
    //     return res.status(404).json({ error: 'No user with that id' });
    //   } else {
    //     return res.status(500).json({ error: 'Internal Server Error' });
    //   }
    // }
    console.log("Route Hitting");
    
    try {
      response.id = validation.checkString(response.id,"Firebase User Id")
      response.username = validation.checkUsername(response.username,"username")
      response.email = validation.checkMailID(response.email,"email");
      const result = await userData.create(response.id, response.username, response.email)
      if(!result){
        return res.status(500).json({error: "Unable to add user in MongoDB"})
      }  
      // "Unable to add user in MongoDB" 
      return res.status(200).json(result);
    } catch (e) {
      return res.status(400).json({error: e})
    }
  });

  router.route('/:id')
  .get( async (req,res) =>{  
    var id = req.params.id;
    try {
      console.log(typeof id)
      id = validation.checkString(id,"Firebase user Id")
    } catch (error) {
      return res.status(400).json({error: 'Bad Input'})
    }
    try {
      const user = await userData.get(id);
      console.log(user);
      if(!user){
        throw new Error('No user with that id');
      }
      return res.status(200).json({user});
    } catch (error) {
      
        return res.status(500).json({error: 'Internal Server Error'});
    
    } 
  }).delete(async (req,res) => {
    var id = req.params.id;
    try {
      id = validation.checkString(id,"Firebase User Id")
    } catch (error) {
      return res.status(400).json({error: 'Bad Input'})
    }
  
    try {
      const message = await userData.remove(id);
      if(!message){
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ userId: id, deleted: true });
    } catch (error) {
      if(error.message === 'user not found'){
        return res.status(404).json({error: 'Not Found'})
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  export default router;