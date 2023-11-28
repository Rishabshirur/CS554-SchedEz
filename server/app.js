import express from "express";
import cors from 'cors';
const app = express();
import configRoutesFunction from "./routes/index.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We now have a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
  

