const debug = require('debug')('read-api:careerBowlingStats');
const writeApi = require('../write-api');
const eventProcessors = require('../matchBowlingStats/eventProcessors');

exports.handleRequest = async(req, res, next) => {
    debug('Request received for bowling stats with params: ' + JSON.stringify(req.params));

    let response; 
    try { response = await exports.getCareerBowlingStats(req.params.player) }
    catch (err) { return next(err) }
    
    return res.status(200).send(response);
}

exports.getCareerBowlingStats = async function(player) {
    
    let events = [];
    try { events = await writeApi.getBowlerEvents(player); }
    catch(err) { 
        debug(err);
        throw(err)
    }; 
    if(events.length == 0) throw({ statusCode: 404, message: 'No events for this batsman' });
    
    let bowlingStats = {
        playerInfo: {},
        runs: 0,
        legalBallsBowled: 0, 
        widesBowled: 0,
        runsFromWides: 0, 
        noBallsBowled: 0,
        runsFromNoBalls: 0,
        economyRate: 0,
        strikeRate: 0,
        scoring: {}, 
        methodsOfDismissal: {},
        wickets: [],
        matches: { },
        innings: []
    };
    events.forEach(e => {
        debug('Invoking processor for: %s', e.eventType);

        try {
            const increment = eventProcessors[e.eventType](e);
            incrementStats(bowlingStats, increment);
            if(!bowlingStats.playerInfo.name && increment.event.bowler) bowlingStats.playerInfo = increment.event.bowler;
        } catch(err) {
            var message = 'Error trying to process events. ' + err;
            debug(message);
            throw(err);
        }
    });

    // Turn match object into array
    for(let match in bowlingStats.matches) 
        for(let inning in bowlingStats.matches[match]) {
            bowlingStats.innings.push({
                match: match,
                innings: inning,
                ...bowlingStats.matches[match][inning]
            });
        }
    delete bowlingStats.matches;

    return bowlingStats;
}

incrementStats = function(careerStats, increment) {
    debug('Incrementing stats using: %s', JSON.stringify(increment));
    
    // Ensure objects can save this innings info for this match and innings
    if(!careerStats.matches[increment.event.match])
        careerStats.matches[increment.event.match] = {};
    if(!careerStats.matches[increment.event.match][increment.event.ball.innings])
        careerStats.matches[increment.event.match][increment.event.ball.innings] = {
            runs: 0, 
            ballsFaced: 0,
            scoring: {},
            wickets: []
        };
  
    let thisInning = careerStats.matches[increment.event.match][increment.event.ball.innings]; 

    // Runs and extras
    careerStats.runs += increment.runs;
    thisInning.runs += increment.runs;

    if(increment.event.eventType == 'wide') {
        thisInning.runsFromWides += increment.runs;
        careerStats.runsFromWides += increment.runs;
        thisInning.widesBowled++;
        careerStats.widesBowled++;
    }
    else if(increment.event.eventType == 'noBall') {
        thisInning.runsFromNoBalls += increment.runs;
        careerStats.runsFromNoBalls += increment.runs;
        thisInning.noBallsBowled++;
        careerStats.noBallsBowled++;
    }
    else if(increment.event.eventType != 'timedOut') {
        thisInning.legalBallsBowled++;
        careerStats.legalBallsBowled++;
    }
    
    // Scoring patterns 
    if(!increment.isWide && !increment.isNoBall && (increment.runs || increment.runs == 0)) {
        if(careerStats.runs && careerStats.scoring[increment.runs])
        careerStats.scoring[increment.runs]++;
        else if(careerStats.runs && !careerStats.scoring[increment.runs])
        careerStats.scoring[increment.runs] = 1;
        
        if(thisInning.runs && thisInning.scoring[increment.runs])
        thisInning.scoring[increment.runs]++;
        else if(thisInning.runs && !thisInning.scoring[increment.runs])
        thisInning.scoring[increment.runs] = 1;
    }
    
    // Wickets
    if(increment.wicket && careerStats.methodsOfDismissal[increment.wicket.eventType])
        careerStats.methodsOfDismissal[increment.wicket.eventType]++;
    else if(increment.wicket && !careerStats.methodsOfDismissal[increment.wicket.eventType])
        careerStats.methodsOfDismissal[increment.wicket.eventType] = 1;
    
    if(increment.wicket) {
        thisInning.wickets.push(increment.wicket);  
        careerStats.wickets.push(increment.wicket);
    }

    // Economy and strike rate
    careerStats.economyRate = (careerStats.runs / careerStats.legalBallsBowled) * 6;
    thisInning.strikeRate = (thisInning.runs / thisInning.legalBallsBowled) * 6;

    careerStats.strikeRate = careerStats.runs / Math.max(careerStats.wickets.length, 1);
    thisInning.strikeRate = thisInning.runs / Math.max(thisInning.wickets.length, 1);
}