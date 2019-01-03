const debug = require('debug')('read-api:careerBattingStats');
const writeApi = require('../write-api');
const eventProcessors = require('../matchBattingStats/eventProcessors');

exports.handleRequest = async(req, res, next) => {
    debug('Request received for career batting stats with params: ' + JSON.stringify(req.params));

    let response; 
    try { response = await exports.getCareerBattingStats(req.params.player) }
    catch (err) { return next(err) }
    
    return res.status(200).send(response);
}

exports.getCareerBattingStats = async function(player) {
    
    let events = [];
    try { events = await writeApi.getBatsmanEvents(player); }
    catch(err) { 
        debug(err);
        throw(err)
    }; 
    if(events.length == 0) throw({ statusCode: 404, message: 'No events for this batsman' });
    
    let battingStats = {
        playerInfo: {},
        runs: 0,
        ballsFaced: 0, 
        average: 0,
        strikeRate: 0,
        '0s': 0,
        '50s': 0,
        '100s': 0,
        scoring: {}, 
        dismissals: { events: [] },
        matches: { },
        innings: []
    };
    events.forEach(e => {
        debug('Invoking processor for: %s', e.eventType);

        try {
            const increment = eventProcessors[e.eventType](e);
            incrementStats(battingStats, increment);
            if(!battingStats.playerInfo.name) battingStats.playerInfo = increment.event.batsman ? increment.event.batsman : increment.event.batsmen.striker;
        } catch(err) {
            var message = 'Error trying to process events. ' + err;
            debug(message);
            throw(err);
        }
    });

    // Calculate career 50s and 100s
    for(let match in battingStats.matches) 
        for(let inning in battingStats.matches[match]) {
            if(battingStats.matches[match][inning].runs == 0) battingStats['0s']++;
            else if(battingStats.matches[match][inning].runs > 100) battingStats['100s']++;
            else if(battingStats.matches[match][inning].runs > 50) battingStats['50s']++;

            // Turn match object into array
            battingStats.innings.push({
                match: match,
                innings: inning,
                ...battingStats.matches[match][inning]
            });
        }

    delete battingStats.dismissals.events;
    delete battingStats.matches;
    return battingStats;
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
            scoring: {}
        };
  
    let thisInning = careerStats.matches[increment.event.match][increment.event.ball.innings]; 

    // Runs, strike rate and averages
    careerStats.runs += increment.runs;
    thisInning.runs += increment.runs;

    careerStats.ballsFaced += increment.ballsFaced;
    thisInning.ballsFaced += increment.ballsFaced;

    careerStats.strikeRate = (careerStats.runs / careerStats.ballsFaced) * 100;
    thisInning.strikeRate = (thisInning.runs / thisInning.ballsFaced) * 100;

    careerStats.average = careerStats.runs / Math.max(careerStats.dismissals.events.length, 1);

    // Scoring patterns 
    if(careerStats.runs && careerStats.scoring[increment.runs])
        careerStats.scoring[increment.runs]++;
    else if(careerStats.runs && !careerStats.scoring[increment.runs])
        careerStats.scoring[increment.runs] = 1;
  
    if(thisInning.runs && thisInning.scoring[increment.runs])
        thisInning.scoring[increment.runs]++;
    else if(thisInning.runs && !thisInning.scoring[increment.runs])
        thisInning.scoring[increment.runs] = 1;
  
    // Dismissal info
    if(increment.dismissal && careerStats.dismissals[increment.dismissal.eventType])
        careerStats.dismissals[increment.dismissal.eventType]++;
    else if(increment.dismissal && !careerStats.dismissals[increment.dismissal.eventType])
        careerStats.dismissals[increment.dismissal.eventType] = 1;
  
    if(increment.dismissal) {
        thisInning.dismissal = increment.dismissal;  
        careerStats.dismissals.events.push(increment.dismissal);
    }
}