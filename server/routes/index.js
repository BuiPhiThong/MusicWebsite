const userRouter= require('./user')
const countryRouter = require('./country')
const musicTypeRouter = require('./musictType')
const singerRouter = require('./singer')
const songRouter = require('./song')
const { errHandler,notFound} = require('../middlewares/err')

const initRoutes = (app) => {
    app.use('/api/user',userRouter)
    app.use('/api/country',countryRouter)
    app.use('/api/musictype',musicTypeRouter)
    app.use('/api/singer',singerRouter)
    app.use('/api/song',songRouter)



    app.use(notFound)
    app.use(errHandler)
    
}

module.exports = initRoutes