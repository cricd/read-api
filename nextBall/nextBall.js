const debug = require('debug')('read-api:nextBall');
const writeApi = require('../write-api');
const eventProcessors = require('./eventProcessors');

exports.handleRequest = async(req, res, next) => {
    debug('Request received for nextBall with params: ' + JSON.stringify(req.params));

    let response; 
    try { response = await exports.getNextBall(req.params.match) }
    catch (err) { return next(err) }
    
    return res.status(200).send(response);
}

exports.getNextBall = async function(match) {

    let events = [];
    try { events = await writeApi.getMatchEvents(match); }
    catch(err) { 
        debug(err);
        throw(err)
    }; 
    
    if(events.length == 0) debug('No events for this match');
    
    let matchInfo; 
    try { matchInfo = await writeApi.getMatchInfo(match); }
    catch(err) { 
        debug(err)
        throw(err); 
    }

    let nextBall;
    try {
        const numberOfOvers = matchInfo.numberOfOvers;
        if(matchInfo.numberOfOvers) debug('This match is limited to %s overs', matchInfo.numberOfOvers);
        const lastBall = events[events.length - 1];
    
        debug('Invoking processor for: %s', lastBall.eventType);
        nextBall = eventProcessors[lastBall.eventType](lastBall, events, numberOfOvers);
        nextBall.match = matchInfo.id;
        
        // Default to a dot ball
        nextBall.eventType = 'delivery'; 
        nextBall.runs = 0;
    }
    catch(err) { 
        debug(err)
        throw(err); 
    }

    return nextBall;
}