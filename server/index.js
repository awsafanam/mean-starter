import http from 'http';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';

const LocalStrategy = require('passport-local').Strategy;

const app = express();


// Routes
import config from './config';
import routes from './routes';

// Database

// Connect to mongoose
mongoose.connect(config.mongoURI, {
    useMongoClient: true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Parsers
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({
    limit: config.bodyLimit
}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, '../ng-dist')));

// passport config
app.use(passport.initialize());
let User = require('./models/user');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    User.authenticate()
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// API location
app.use('/v1', routes);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../ng-dist/index.html'));
});

//Set Port
app.set('port', config.port);

const server = http.createServer(app);

server.listen(config.port, () => console.log(`Running on localhost:${config.port}`));
