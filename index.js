const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');
const keys = require("./config/keys");
require('./models/User');
require('./models/Survey');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if (process.env.NODE_ENV === 'production') {
    // Config express to serve production assets eg. main.js
    app.use(express.static('client/build'))

    // Config express to serve index.html if it doesn't know route
    // order is very important
    app.get('*', (req ,res) => {
        res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });

}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
