const debug = require('debug')('read-api:matchScore');
const resultCalculator = require('./resultCalculator');
const writeApi = require('../write-api');
const eventProcessors = require('./eventProcessors');
const battingAndBowling = require('./battingAndBowling');

exports.handleRequest = async (req, res, next) => {
    debug('Request received for match score with params: ' + JSON.stringify(req.params));

    let response;   
    try { response = await exports.getMatchScore(req.params.match) }
    catch (err) { return next(err) }
    
    return res.status(200).send(response);
};

exports.getMatchScore = async function(match) {

    var matchScore = { matchInfo: {}, result: {}, innings: [], matchEvents: [] };
    let events = [];
    
    try { events = await writeApi.getMatchEvents(match); }
    catch(err) { 
        debug(err);
        throw(err)
    }; 
    
    if(events.length == 0) debug('No events for this match');
    
    events.forEach(e => {
        debug('Invoking processor for: %s', e.eventType);
        
        try {
            const increment = eventProcessors[e.eventType](e);
            eventProcessors.incrementStats(matchScore, increment);
            matchScore.matchEvents.push(e);
        } catch(err) {
            var message = 'Error trying to process match events: ' + err;
            debug(message);
            throw(err)
        }
    });
    
    let matchInfo; 
    try { matchInfo = await writeApi.getMatchInfo(match); }
    catch(err) { 
        debug(err)
        throw(err); 
    }

    matchScore.matchInfo = matchInfo;
    matchScore.result = resultCalculator.calculateResult(matchScore, matchInfo);
    matchScore = await battingAndBowling.addBattingStats(matchScore, matchInfo.id);
    matchScore = await battingAndBowling.addBowlingStats(matchScore, matchInfo.id);

    return matchScore;
}

