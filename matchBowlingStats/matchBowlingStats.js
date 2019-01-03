const debug = require('debug')('read-api:matchBowlingStats');
const writeApi = require('../write-api');
const eventProcessors = require('./eventProcessors');
const _ = require('underscore');

exports.handleRequest = async(req, res, next) => {
    debug('Request received for bowling stats with params: ' + JSON.stringify(req.params));

    let response; 
    try { response = await exports.getBowlingStats(req.params.match, req.params.inning) }
    catch (err) { return next(err) }
    
    return res.status(200).send(response);
}

exports.getBowlingStats = async function(match, inning) {

    let events = [];
    try { events = await writeApi.getMatchEvents(match); }
    catch(err) { 
        debug(err);
        throw(err)
    }; 

    events = _(events).filter(function(e){
        if(e.ball && e.ball.innings != inning) return false;
        else return true;
    });
    if(events.length == 0) throw({ statusCode: 400, message: 'No events for this match and inning' });
    
    let bowlingStats = [];
    events.forEach(e => {
        debug('Invoking processor for: %s', e.eventType);

        try {
            const increment = eventProcessors[e.eventType](e);
            eventProcessors.incrementStats(bowlingStats, increment);
        } catch(err) {
            var message = 'Error trying to process events. ' + err;
            debug(message);
            throw(err);
        }
    });
        
    _(bowlingStats).each(function(b){ delete b.events; });
    return bowlingStats;
}

