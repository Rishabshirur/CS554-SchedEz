import user from './user.js';
import schedule from './schedule.js';
import event from './event.js'

const routeConstructor = (app) => {
    app.use('/user', user)
    app.use('/schedule', schedule)
    app.use('/event', event)
    
    app.use("*", (req, res) => {
        res.status(404).json({  error: 'Route Not Found'  })
    })
}

export default routeConstructor;