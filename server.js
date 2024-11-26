const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const session = require('express-session');
const passport = require('passport');
const gitHubStrategy = require('passport-github').Strategy;
const cors = require('cors');

const port = 3000;
const app = express();


// Import routes
const routes = require('./routes');
const e = require('express');


// Use routes
app

    .use(bodyParser.json())
    .use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}))
    .use(passport.initialize())
    .use(passport.session())
    .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-key');
    next();
})
    .use(cors({method: ['GET', 'POST', 'PUT', 'DELETE']}))
    .use(cors({origin: '*'}))
    .use('/', require('./routes'));

    
    passport.use(new gitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
      },
      function(accessToken, refreshToken, profile, done) {
        // Extract the display name from the profile
        const user = {
          githubId: profile.id,
          displayName: profile.displayName || profile.username,
          username: profile.username,
          profileUrl: profile.profileUrl,
          emails: profile.emails
        };
        return done(null, user);
      }
    ));
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `logged in as ${req.session.user.displayName}` : "Not logged in") });

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/api-docs', session: false }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});


mongodb.initDB((err, db) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
});