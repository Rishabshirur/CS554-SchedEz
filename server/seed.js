import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
  } from 'firebase/auth';
import fbconfig from '../client/src/firebase/FirebaseConfig.js';
import {initializeApp} from 'firebase/app';
import users from "./data/user.js"
import schedules from "./data/schedule.js"
import events from "./data/event.js"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js'; 
import timezone from 'dayjs/plugin/timezone.js'; 

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('America/New_York');
    

const app = initializeApp(fbconfig);
const db = await dbConnection();
await db.dropDatabase();

const auth = getAuth();

const userCredential1 = await createUserWithEmailAndPassword(auth, 'user1@gmail.com', 'SchedEz@user1');
const user1 = userCredential1.user;
await updateProfile(auth.currentUser, { displayName: "User 1" });

const createUser1 = await users.create(user1.uid, user1.displayName, user1.email)
console.log('User 1 created',createUser1);

const userCredential2 = await createUserWithEmailAndPassword(auth, 'user2@gmail.com', 'SchedEz@user2');
const user2 = userCredential2.user;
await updateProfile(auth.currentUser, { displayName: "User 2" });

const createUser2 = await users.create(user2.uid, user2.displayName, user2.email)
console.log('User 2 created',createUser2); 

const userCredential3 = await createUserWithEmailAndPassword(auth, 'user3@gmail.com', 'SchedEz@user3');
const user3 = userCredential3.user;
await updateProfile(auth.currentUser, { displayName: "User 3" });

const createUser3 = await users.create(user3.uid, user3.displayName, user3.email)
console.log('User 3 created',createUser3);

const schedule1Name = "Schedule 1"
const schedule1 = await schedules.createSchedule(user1.uid, schedule1Name);

let event1u1Data = {
    userId: user1.uid,
    eventName: 'Lunch',
    startDateTime: dayjs(`2023-12-21T12:00:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    endDateTime: dayjs(`2023-12-21T12:45:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    color: 'Red',
    desc: 'This is a test event from seed',
    schedule: schedule1.scheduleId,
    shareEvent: user2.email
}

const event1u1id = await events.createEvent(user1.uid, event1u1Data)

let event2u1Data = {
    userId: user1.uid,
    eventName: 'Dinner',
    startDateTime: dayjs(`2023-12-21T20:30:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    endDateTime: dayjs(`2023-12-21T21:15:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    color: 'Blue',
    desc: 'This is a test event from seed',
    schedule: schedule1.scheduleId,
}


const event2u1id = await events.createEvent(user1.uid, event2u1Data)


const schedule2u1Name = "Schedule 2"
const schedule2u1 = await schedules.createSchedule(user1.uid, schedule2u1Name);

let event3u1Data = {
    userId: user1.uid,
    eventName: 'Work',
    startDateTime: dayjs(`2023-12-22T10:00:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    endDateTime: dayjs(`2023-12-22T12:45:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    color: 'Red',
    desc: 'This is a test event from seed',
    schedule: schedule2u1.scheduleId,
}

const event3u1id = await events.createEvent(user1.uid, event3u1Data)


const schedule1u2Name = "Schedule 1"
const schedule1u2 = await schedules.createSchedule(user2.uid, schedule1u2Name);

let event1u2Data = {
    userId: user2.uid,
    eventName: 'Lunch',
    startDateTime: dayjs(`2023-12-25T12:00:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    endDateTime: dayjs(`2023-12-25T12:45:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    color: 'Red',
    desc: 'This is a test event from seed',
    schedule: schedule1u2.scheduleId,
    shareEvent: user1.email,
}


const event1u2id = await events.createEvent(user2.uid, event1u2Data)

let event2u2Data = {
    userId: user2.uid,
    eventName: 'Dinner',
    startDateTime: dayjs(`2023-12-25T20:30:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    endDateTime: dayjs(`2023-12-25T21:15:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    color: 'Red',
    desc: 'This is a test event from seed',
    schedule: schedule1u2.scheduleId,
}


const event2u2id = await events.createEvent(user2.uid, event2u2Data)

const schedule2u2Name = "Schedule 2"
const schedule2u2 = await schedules.createSchedule(user2.uid, schedule2u2Name);

let event3u2Data = {
    userId: user2.uid,
    eventName: 'Work',
    startDateTime: dayjs(`2023-12-26T10:00:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    endDateTime: dayjs(`2023-12-26T12:45:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    color: 'Red',
    desc: 'This is a test event from seed',
    schedule: schedule2u2.scheduleId,
}

const event3u2id = await events.createEvent(user2.uid, event3u2Data)


const schedule1u3Name = "Schedule 1"
const schedule1u3 = await schedules.createSchedule(user3.uid, schedule1u3Name);

let event1u3Data = {
    userId: user3.uid,
    eventName: 'Event',
    startDateTime: dayjs(`2023-12-27T12:00:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    endDateTime: dayjs(`2023-12-27T14:45:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    color: 'Red',
    desc: 'This is a test event from seed',
    schedule: schedule1u3.scheduleId,
    shareEvent: user1.email,
}


const event1u3id = await events.createEvent(user3.uid, event1u3Data)


let event2u3Data = {
    userId: user3.uid,
    eventName: 'Vacation',
    startDateTime: dayjs(`2023-12-27T16:00:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    endDateTime: dayjs(`2023-12-29T10:45:00.000Z`).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    color: 'Yellow',
    desc: 'This is a test event from seed',
    schedule: schedule1u3.scheduleId,
}


const event2u3id = await events.createEvent(user3.uid, event2u3Data)

await closeConnection();