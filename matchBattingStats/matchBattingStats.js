const debug = require('debug')('read-api:matchBattingStats');
const writeApi = require('../write-api');
const eventProcessors = require('./eventProcessors');
const _ = require('underscore');

exports.handleRequest = async(req, res, next) => {
    debug('Request received for batting stats with params: ' + JSON.stringify(req.params));

    let response; 
    try { response = await exports.getBattingStats(req.params.match, req.params.inning) }
    catch (err) { return next(err) }
    
    return res.status(200).send(response);
}

exports.getBattingStats = async function(match, inning) {

    let events = [];
    try { events = await writeApi.getMatchEvents(match); }
    catch(err) { 
        debug(err);
        throw(err);
    }; 

    events = _(events).filter(function(e){
        if(e.ball && e.ball.innings != inning) return false;
        else return true;
    });
    if(events.length == 0) throw({ statusCode: 404, message: 'No events for this match and inning' });
    
    let battingStats = [];
    events.forEach(e => {
        debug('Invoking processor for: %s', e.eventType);

        try {
            const increment = eventProcessors[e.eventType](e);
            eventProcessors.incrementStats(battingStats, increment);
        } catch(err) {
            var message = 'Error trying to process events. ' + err;
            debug(message);
            throw(err);
        }
    });
        
    _(battingStats).each(function(b){ delete b.events; });
    return battingStats;
}

