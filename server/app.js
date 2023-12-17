import express from "express";
import cors from 'cors';
const app = express();
import configRoutesFunction from "./routes/index.js";
import fbconfig from './FirebaseConfig.js';
import {initializeApp} from 'firebase/app';
import path from 'path';

const fbapp = initializeApp(fbconfig);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const uploadsDirectory = new URL('public/uploads', import.meta.url).pathname;
app.use('/uploads', express.static(path.join(uploadsDirectory)));
configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We now have a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
  

