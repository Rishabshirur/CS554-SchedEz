import user from './user.js';
import schedule from './schedule.js';
import event from './event.js'
import imagemagick from './imagemagick.js'

const routeConstructor = (app) => {
    app.use('/user', user)
    app.use('/schedule', schedule)
    app.use('/event', event)
    app.use('/image', imagemagick)
    app.use("*", (req, res) => {
        res.status(404).json({  error: 'Route Not Found'  })
    })
}

export default routeConstructor;