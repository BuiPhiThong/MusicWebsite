const userRouter= require('./user')
const countryRouter = require('./country')
const musicTypeRouter = require('./musictType')
const singerRouter = require('./singer')
const songRouter = require('./song')
const albumRouter = require('./album')
const playlistRouter = require('./playlist')
const playlistTypeRouter = require('./playlistType')
const searchRouter = require('./search')
const authRouter = require('./auth')
const { errHandler,notFound} = require('../middlewares/err')

const initRoutes = (app) => {
    app.use('/api/user',userRouter)
    app.use('/api/country',countryRouter)
    app.use('/api/musictype',musicTypeRouter)
    app.use('/api/singer',singerRouter)
    app.use('/api/song',songRouter)
    app.use('/api/album',albumRouter)
    app.use('/api/playlist',playlistRouter)
    app.use('/api/playlisttype',playlistTypeRouter)
    app.use('/api/homesearch',searchRouter)
    app.use('/api/auth',authRouter)



    app.use(notFound)
    app.use(errHandler)
    
}

module.exports = initRoutes