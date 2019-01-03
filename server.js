const debug = require('debug')('read-api');
const express = require('express');
const cors = require('cors');
const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS : 'http://localhost:8080';
const corsOptions = {
    origin: allowedOrigins
};

// Define routes
app.get('/matches/:match/score', cors(corsOptions), require('./matchScore/matchScore').handleRequest);
app.get('/matches/:match/innings/:inning/batting', cors(corsOptions), require('./matchBattingStats/matchBattingStats').handleRequest);
app.get('/matches/:match/innings/:inning/bowling', cors(corsOptions), require('./matchBowlingStats/matchBowlingStats').handleRequest);
app.get('/players/:player/batting', cors(corsOptions), require('./careerBattingStats/careerBattingStats').handleRequest);
app.get('/players/:player/bowling', cors(corsOptions), require('./careerBowlingStats/careerBowlingStats').handleRequest);
app.get('/matches/:match/nextBall', cors(corsOptions), require('./nextBall/nextBall').handleRequest);

// Error handling middleware
app.use((error, req, res, next) => {
    debug('Handling error: %o', error);
    if (!error.statusCode) return res.status(500).send(error.toString());
    else if (error.statusCode) return res.status(error.statusCode).send(error.message.toString());
  
    next();
  });

app.listen(3000);
console.log('read-api listening on port 3000...');
