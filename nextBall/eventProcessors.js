var debug = require('debug')('read-api:nextBall:eventProcessors');
var _ = require('underscore');
var helpers = require('./helpers.js');
var exports = module.exports = {};

exports.delivery = function(lastBall, allEvents, numberOfOvers) {
    debug('Processing delivery: %s', JSON.stringify(lastBall));
    
    var response = helpers.getDefaultResponse(lastBall, allEvents);

    var oddRuns = lastBall.runs % 2 != 0;
    var wickets = helpers.getWickets(lastBall, allEvents);
    var endOfInnings = helpers.isEndOfInnings(lastBall, numberOfOvers, wickets);

    if(endOfInnings) {
        response.ball.battingTeam = lastBall.ball.fieldingTeam;
        response.ball.fieldingTeam = lastBall.ball.battingTeam;
        response.ball.innings++;
        response.ball.over = 0;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: {}
        };
        response.bowler = {};
    }
    else if(helpers.isEndOfOver(lastBall, allEvents) && !oddRuns) {
        response.ball.over++;
        response.ball.ball = 1;
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: lastBall.batsmen.striker
        };
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else if(helpers.isEndOfOver(lastBall, allEvents) && oddRuns) {
        response.ball.over++;
        response.ball.ball = 1;
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else if(oddRuns) {
        response.ball.ball++;
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: lastBall.batsmen.striker
        };
    }
    else response.ball.ball++;

    response.eventType = 'delivery';
    response.runs = 0;
    return response;
};

exports.noBall = function(lastBall, allEvents, numberOfOvers) {
    debug('Processing noBall: %s', JSON.stringify(lastBall));
    var response = helpers.getDefaultResponse(lastBall, allEvents);

    var oddRuns = lastBall.runs % 2 != 0;
    if(oddRuns) {
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: lastBall.batsmen.striker
        };
    }
    return response;
};

exports.wide = function(lastBall, allEvents, numberOfOvers) {
    debug('Processing wide: %s', JSON.stringify(lastBall));
    var response = helpers.getDefaultResponse(lastBall, allEvents);

    var oddRuns = lastBall.runs % 2 != 0;
    if(oddRuns) {
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: lastBall.batsmen.striker
        };
    }
    return response;
};

exports.bye = function(lastBall, allEvents, numberOfOvers) {
    debug('Processing bye: %s', JSON.stringify(lastBall));
    var response = helpers.getDefaultResponse(lastBall, allEvents);

    var oddRuns = lastBall.runs % 2 != 0;
    var wickets = helpers.getWickets(lastBall, allEvents);
    var endOfInnings = helpers.isEndOfInnings(lastBall, numberOfOvers, wickets);

    if(endOfInnings) {
        response.ball.battingTeam = lastBall.ball.fieldingTeam;
        response.ball.fieldingTeam = lastBall.ball.battingTeam;
        response.ball.innings++;
        response.ball.over = 0;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: {}
        };
        response.bowler = {};
    }
    else if(helpers.isEndOfOver(lastBall, allEvents) && !oddRuns) {
        response.ball.over++;
        response.ball.ball = 1;
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: lastBall.batsmen.striker
        };
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else if(helpers.isEndOfOver(lastBall, allEvents) && oddRuns) {
        response.ball.over++;
        response.ball.ball = 1;
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else if(oddRuns) {
        response.ball.ball = helpers.getLegalBallNumber(lastBall, allEvents);
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: lastBall.batsmen.striker
        };
    }
    else response.ball.ball++;
    return response;
};

exports.legBye = function(lastBall, allEvents, numberOfOvers) {
    debug('Processing legBye: %s', JSON.stringify(lastBall));
    var response = helpers.getDefaultResponse(lastBall, allEvents);

    var oddRuns = lastBall.runs % 2 != 0;
    var wickets = helpers.getWickets(lastBall, allEvents);
    var endOfInnings = helpers.isEndOfInnings(lastBall, numberOfOvers, wickets);

    if(endOfInnings) {
        response.ball.battingTeam = lastBall.ball.fieldingTeam;
        response.ball.fieldingTeam = lastBall.ball.battingTeam;
        response.ball.innings++;
        response.ball.over = 0;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: {}
        };
        response.bowler = {};
    }
    else if(helpers.isEndOfOver(lastBall, allEvents) && !oddRuns) {
        response.ball.over++;
        response.ball.ball = 1;
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: lastBall.batsmen.striker
        };
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else if(helpers.isEndOfOver(lastBall, allEvents) && oddRuns) {
        response.ball.over++;
        response.ball.ball = 1;
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else if(oddRuns) {
        response.ball.ball++;
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: lastBall.batsmen.striker
        };
    }
    else response.ball.ball++;
    return response;
};

exports.bowled = function(lastBall, allEvents, numberOfOvers) {
    debug('Processing bowled: %s', JSON.stringify(lastBall));
    var response = helpers.getDefaultResponse(lastBall, allEvents);

    var wickets = helpers.getWickets(lastBall, allEvents);
    var endOfInnings = helpers.isEndOfInnings(lastBall, numberOfOvers, wickets);

    if(endOfInnings) {
        response.ball.battingTeam = lastBall.ball.fieldingTeam;
        response.ball.fieldingTeam = lastBall.ball.battingTeam;
        response.ball.innings++;
        response.ball.over = 0;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: {}
        };
        response.bowler = {};
    }
    else if(helpers.isEndOfOver(lastBall, allEvents)) {
        response.ball.over++;
        response.ball.ball = 1;
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: {}
        };
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else {
        response.ball.ball++;
        response.batsmen.striker = {};
    }
    return response;
};

exports.timedOut = function(lastBall, allEvents, numberOfOvers) {
    debug('Processing timedOut: %s', JSON.stringify(lastBall));

    var response = helpers.getDefaultResponse(lastBall, allEvents);
    response.batsmen.striker = {};

    return response;
};

exports.caught = function(lastBall, allEvents, numberOfOvers) {
    debug('Processing caught: %s', JSON.stringify(lastBall));
    var response = helpers.getDefaultResponse(lastBall, allEvents);

    var wickets = helpers.getWickets(lastBall, allEvents);
    var endOfInnings = helpers.isEndOfInnings(lastBall, numberOfOvers, wickets);

    if(endOfInnings) {
        response.ball.battingTeam = lastBall.ball.fieldingTeam;
        response.ball.fieldingTeam = lastBall.ball.battingTeam;
        response.ball.innings++;
        response.ball.over = 0;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: {}
        };
        response.bowler = {};
    }
    else if(helpers.isEndOfOver(lastBall, allEvents) && !lastBall.didCross) {
        response.ball.over++;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: lastBall.batsmen.striker
        };
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else if(helpers.isEndOfOver(lastBall, allEvents) && lastBall.didCross) {
        response.ball.over++;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: lastBall.batsmen.nonStriker
        };
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else if(lastBall.didCross) {
        response.ball.ball++;
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: {}
        };
    }
    else {
        response.ball.ball++;
        response.batsmen.striker = {};
    }

    return response;
};

exports.handledBall = function(lastBall, allEvents, numberOfOvers) {
    debug('Processing handledBall: %s', JSON.stringify(lastBall));
    var response = helpers.getDefaultResponse(lastBall, allEvents);

    var wickets = helpers.getWickets(lastBall, allEvents);
    var endOfInnings = helpers.isEndOfInnings(lastBall, numberOfOvers, wickets);

    if(endOfInnings) {
        response.ball.battingTeam = lastBall.ball.fieldingTeam;
        response.ball.fieldingTeam = lastBall.ball.battingTeam;
        response.ball.innings++;
        response.ball.over = 0;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: {}
        };
        response.bowler = {};
    }
    else if(helpers.isEndOfOver(lastBall, allEvents)) {
        response.ball.over++;
        response.ball.ball = 1;
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: {}
        };
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else {
        response.ball.ball++;
        response.batsmen.striker = {};
    }
    return response;
};

exports.doubleHit = function(lastBall, allEvents, numberOfOvers) {
    debug('Processing doubleHit: %s', JSON.stringify(lastBall));
    var response = helpers.getDefaultResponse(lastBall, allEvents);

    var wickets = helpers.getWickets(lastBall, allEvents);
    var endOfInnings = helpers.isEndOfInnings(lastBall, numberOfOvers, wickets);

    if(endOfInnings) {
        response.ball.battingTeam = lastBall.ball.fieldingTeam;
        response.ball.fieldingTeam = lastBall.ball.battingTeam;
        response.ball.innings++;
        response.ball.over = 0;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: {}
        };
        response.bowler = {};
    }
    else if(helpers.isEndOfOver(lastBall, allEvents)) {
        response.ball.over++;
        response.ball.ball = 1;
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: {}
        };
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else {
        response.ball.ball++;
        response.batsmen.striker = {};
    }
    return response;
};

exports.hitWicket = function(lastBall, allEvents, numberOfOvers) {
    debug('Processing hitWicket: %s', JSON.stringify(lastBall));
    var response = helpers.getDefaultResponse(lastBall, allEvents);

    var wickets = helpers.getWickets(lastBall, allEvents);
    var endOfInnings = helpers.isEndOfInnings(lastBall, numberOfOvers, wickets);

    if(endOfInnings) {
        response.ball.battingTeam = lastBall.ball.fieldingTeam;
        response.ball.fieldingTeam = lastBall.ball.battingTeam;
        response.ball.innings++;
        response.ball.over = 0;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: {}
        };
        response.bowler = {};
    }
    else if(helpers.isEndOfOver(lastBall, allEvents)) {
        response.ball.over++;
        response.ball.ball = 1;
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: {}
        };
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else {
        response.ball.ball++;
        response.batsmen.striker = {};
    } 
    return response;
};

exports.lbw = function(lastBall, allEvents, numberOfOvers) {
    debug('Processing lbw: %s', JSON.stringify(lastBall));
    var response = helpers.getDefaultResponse(lastBall, allEvents);

    var wickets = helpers.getWickets(lastBall, allEvents);
    var endOfInnings = helpers.isEndOfInnings(lastBall, numberOfOvers, wickets);

    if(endOfInnings) {
        response.ball.battingTeam = lastBall.ball.fieldingTeam;
        response.ball.fieldingTeam = lastBall.ball.battingTeam;
        response.ball.innings++;
        response.ball.over = 0;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: {}
        };
        response.bowler = {};
    }
    else if(helpers.isEndOfOver(lastBall, allEvents)) {
        response.ball.over++;
        response.ball.ball = 1;
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: {}
        };
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else {
        response.ball.ball++;
        response.batsmen.striker = {};
    } 
    return response;
};

exports.obstruction = function(lastBall, allEvents, numberOfOvers) {
    debug('Processing obstruction: %s', JSON.stringify(lastBall));
    var response = helpers.getDefaultResponse(lastBall, allEvents);

    var wickets = helpers.getWickets(lastBall, allEvents);
    var didSwap = lastBall.runs % 2 == 0; // Players swap on unsuccessful run
    var endOfInnings = helpers.isEndOfInnings(lastBall, numberOfOvers, wickets);

    if(endOfInnings) {
        response.ball.battingTeam = lastBall.ball.fieldingTeam;
        response.ball.fieldingTeam = lastBall.ball.battingTeam;
        response.ball.innings++;
        response.ball.over = 0;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: {}
        };
        response.bowler = {};
    }
    else if(helpers.isEndOfOver(lastBall, allEvents) && !didSwap) {
        response.ball.over++;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: lastBall.batsmen.striker
        };
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else if(helpers.isEndOfOver(lastBall, allEvents) && didSwap) {
        response.ball.over++;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: lastBall.batsmen.nonStriker
        };
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else if(didSwap) {
        response.ball.ball++;
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: {}
        };
    }
    else {
        response.ball.ball++;
        response.batsmen.striker = {};
    }
    return response;
};

exports.runOut = function(lastBall, allEvents, numberOfOvers) {
    debug('Processing runOut: %s', JSON.stringify(lastBall));
    var response = helpers.getDefaultResponse(lastBall, allEvents);

    var wickets = helpers.getWickets(lastBall, allEvents);
    var didSwap = lastBall.runs % 2 == 0; // Players swap on unsuccessful run
    var endOfInnings = helpers.isEndOfInnings(lastBall, numberOfOvers, wickets);

    if(endOfInnings) {
        response.ball.battingTeam = lastBall.ball.fieldingTeam;
        response.ball.fieldingTeam = lastBall.ball.battingTeam;
        response.ball.innings++;
        response.ball.over = 0;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: {}
        };
        response.bowler = {};
    }
    else if(helpers.isEndOfOver(lastBall, allEvents) && !didSwap) {
        response.ball.over++;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: lastBall.batsmen.striker
        };
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else if(helpers.isEndOfOver(lastBall, allEvents) && didSwap) {
        response.ball.over++;
        response.ball.ball = 1;
        response.batsmen.striker = {};
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else if(didSwap) {
        response.ball.ball++;
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: {}
        };
    }
    else {
        response.ball.ball++;
        response.batsmen.striker = {};
    }
    return response;
};

exports.stumped = function(lastBall, allEvents, numberOfOvers) {
    debug('Processing stumped: %s', JSON.stringify(lastBall));
    var response = helpers.getDefaultResponse(lastBall, allEvents);

    var wickets = helpers.getWickets(lastBall, allEvents);
    var endOfInnings = helpers.isEndOfInnings(lastBall, numberOfOvers, wickets);

    if(endOfInnings) {
        response.ball.battingTeam = lastBall.ball.fieldingTeam;
        response.ball.fieldingTeam = lastBall.ball.battingTeam;
        response.ball.innings++;
        response.ball.over = 0;
        response.ball.ball = 1;
        response.batsmen = {
            striker: {},
            nonStriker: {}
        };
        response.bowler = {};
    }
    else if(helpers.isEndOfOver(lastBall, allEvents)) {
        response.ball.over++;
        response.ball.ball = 1;
        response.batsmen = {
            striker: lastBall.batsmen.nonStriker,
            nonStriker: {}
        };
        response.bowler = helpers.getPreviousBowler(lastBall, allEvents);
    }
    else {
        response.ball.ball++;
        response.batsmen.striker = {};
    }
    return response;
};