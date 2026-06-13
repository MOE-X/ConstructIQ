const express = require('express')
// const path = require('path')
// const bodyParser = require('body-parser')
// const sequelize = require('./config/db')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('./models')
const homeRoutes = require('./routes/home')
const workerRoutes = require('./routes/worker')
const projectRoutes = require('./routes/project')
const authRoutes = require('./routes/auth')
const reportsRoutes = require('./routes/reports')
const errorController = require('./controllers/errorController')
const app = express()

const sessionStore = new SequelizeStore({
    db: db.sequelize
})
app.use(session({
    secret: 'key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}))
sessionStore.sync()
// app.set('view engine', 'ejs')
// app.set('views', 'views')

// app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
// app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.static(path.join(__dirname, 'views')))
// app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
// app.use('/fontawesome', express.static('node_modules/@fortawesome/fontawesome-free'));

app.use(authRoutes)
app.use('/home', homeRoutes)
app.use('/projects', projectRoutes)
app.use('/workers', workerRoutes)
app.use('/reports', reportsRoutes)
app.use(errorController._404)
app.use(errorController._500)

db.sequelize.authenticate()
    .then(result => {
        app.listen(3000)
        console.log('Connection has been established successfully.')
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    })