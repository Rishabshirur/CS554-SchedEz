# SchedEz

### Team Members
1. Sachin Devangan
2. Nihash Veeramachaneni
3. Rishab Shirur
4. Taher Mundrawala

### Github repository
https://github.com/sachindevangan/CS554-SchedEz

 ### Introduction to Project

 SchedEz provides a comprehensive answer to the complex problem of traditional scheduling. In SchedEz users may easily create, change, and see their schedules and timetables using our user-friendly, web-based application. The application's easy interface improves the process of adding events, classes, and other activities, allowing users to construct schedules based on certain days and  time  intervals.  For  instance,  using  color-coding  and  classification  users  can  distinguish between tasks which improve clarity. Collaboration capabilities ensure smooth cooperation by allowing numerous users to follow upon the same schedule. Furthermore, daily reminders keep users up-to date on forthcoming activities, preventing missed appointments. SchedEz simplifies scheduling, promotes effective time management, and boosts overall productivity for people by overcoming the constraints of traditional scheduling systems. 

 ## Prerequisite

 Need to Install imagemagick
 Need to install Docker Desktop

 ## Steps to execute the application using Docker:

 1. Go to /server directory and execute npm run seed to populate database.
 2. Go to /server/config/settings.js and uncomment the line "serverUrl: 'mongodb://host.docker.internal:27017/' "  and comment the line " serverUrl: 'mongodb://127.0.0.1:27017/' "
 3. Move to root directory.
 4. Execute the command ' docker-compose build '
 5. Execute the command ' docker-compose up '

 ## Important points to note
 Ensure that docker-compose is installed along with Docker Desktop.

 ## Features : 
 1. Daily reminders - Reminder that tells you which events are today
 2. ImageMagick - Transforms and manipulate your image and saves in the server to reduce the server load.
 3. Docker -
