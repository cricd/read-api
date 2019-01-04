const debug = require('debug')('read-api:write-api');
const fetch = require('node-fetch');

// Configuration variables
const host = process.env.WRITE_API_HOST ? process.env.WRITE_API_HOST : 'write-api';
const port = process.env.WRITE_API_PORT ? process.env.WRITE_API_PORT : 3001;
const baseUrl = 'http://' + host + ':' + port; 

let cache = {
    matches: {}, 
    players: {},
    matchEvents: {},
    batsmenEvents: {},
    bowlerEvents: {}
};

exports.getMatchInfo = async function(match) {
    debug('Attempting to retrieve match info');

    if(!match) { throw('match is required to get info'); }
    if(cache.matches[match]) return cache.matches[match];
 
    let matchInfo; 
    try { 
        const response = await fetch(baseUrl + '/matches/' + match);
        if(response.status == 404) throw('Match ' + match + ' does not exist');
        matchInfo = await response.json();
    }
    catch(err) { throw('Problem retrieving match info: ' + JSON.stringify(err)); }

    cache.matches[match] = matchInfo;
    return matchInfo;
};

exports.getPlayerInfo = async function(player) {
    debug('Attempting to retrieve player info');

    if(!player) { throw('player is required to get info'); }
    if(cache.players[player]) return cache.players[player];

    let playerInfo; 
    try { 
        const response = await fetch(baseUrl + '/players/' + player);
        if(response.status == 404) throw('Player ' + player + ' does not exist');
        playerInfo = await response.json();
    }
    catch(err) { throw('Problem retrieving player info: ' + JSON.stringify(err)); }

    cache.players[player] = playerInfo;
    return playerInfo;
};

exports.getMatchEvents = async function(match) {
    debug('Attempting to retrieve match events');

    if(!match) { throw('match is required to retrieve events'); }
    if(cache.matchEvents[match]) return cache.matchEvents[match];

    let events = []; 
    try { 
        const response = await fetch(baseUrl + '/matches/' + match + '/events');
        events = await response.json();
    }
    catch(err) { throw('Problem retrieving events: ' + JSON.stringify(err)); }

    cache.matchEvents[match] = events;
    return events;
};

exports.getBatsmanEvents = async function(player) {
    debug('Attempting to retrieve player events');

    if(!player) { throw('player is required to retrieve events'); }
    if(cache.batsmenEvents[player]) return cache.batsmenEvents[player];

    let events = []; 
    try { 
        const response = await fetch(baseUrl + '/players/' + player + '/batting');
        events = await response.json();
    }
    catch(err) { throw('Problem retrieving events: ' + JSON.stringify(err)); }

    cache.batsmenEvents[player] = events;
    return events;
};

exports.getBowlerEvents = async function(player) {
    debug('Attempting to retrieve player events');

    if(!player) { throw('player is required to retrieve events'); }
    if(cache.bowlerEvents[player]) return cache.bowlerEvents[player];

    let events = []; 
    try { 
        const response = await fetch(baseUrl + '/players/' + player + '/bowling');
        events = await response.json();
    }
    catch(err) { throw('Problem retrieving events: ' + JSON.stringify(err)); }

    cache.bowlingEvents[player] = events;
    return events;
};