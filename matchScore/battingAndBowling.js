const debug = require('debug')('read-api:matchScore:battingAndBowling');
const _ = require('underscore');
const battingStatsProcessor = require('../matchBattingStats/matchBattingStats');
const bowlingStatsProcessor = require('../matchBowlingStats/matchBowlingStats');

exports.addBattingStats = async(stats, match) => {
    debug('Attempting to add batting stats');

    for(let index in stats.innings) {
        let battingStats;
        try { battingStats = await battingStatsProcessor.getBattingStats(match, parseInt(index) + 1) }
        catch(err) { 
            debug(err);
            throw(err);
        }; 
        stats.innings[index].batting = battingStats;        
    }

    debug('Successfully adding batting stats');
    return stats;
}

exports.addBowlingStats = async(stats, match) => {
    debug('Attempting to add bowling stats');

    for(let index in stats.innings) {
        let bowlingStats;
        try { bowlingStats = await bowlingStatsProcessor.getBowlingStats(match, parseInt(index) + 1) }
        catch(err) { 
            debug(err);
            throw(err);
        }; 
        stats.innings[index].bowling = bowlingStats;
    };

    debug('Successfully adding bowling stats');
    return stats;
}