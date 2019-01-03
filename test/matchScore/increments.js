var assert = require('assert');
var should = require('should');
var processor = require('../../matchScore/eventProcessors');

var getStats = function(){
    return {
        innings: []
    };
};

describe('The batting teams score', function(){
    it('should increment by 1 when 1 run is scored', function(){
        var stats = getStats();
        var increment = {
            innings: 1,
            battingTeam: {},
            over: 1,
            ball: 1,
            runs: 1
        };

        processor.incrementStats(stats, increment);
        stats.innings[0].runs.should.equal(1);
    });
 
    it('should not increment when no runs are scored', function(){
        var stats = getStats();
        var increment = {
            innings: 1,
            battingTeam: {},
            over: 1,
            ball: 1,
            runs: 0
        };

        processor.incrementStats(stats, increment);
        stats.innings[0].runs.should.equal(0);
    });
});

describe('The over and ball count', function(){
    it('should increment by 1 ball during an over', function(){
        var stats = getStats();
        stats.innings[0] = {};
        stats.innings[0].over = 2;
        stats.innings[0].ball = 3;

        var increment = {
            innings: 1,
            battingTeam: {},
            over: 1,
            ball: 1,
            runs: 1
        };

        processor.incrementStats(stats, increment);
        stats.innings[0].over.should.equal(2);
        stats.innings[0].ball.should.equal(4);     
    });

    it('should increment the over after 6 deliveries', function(){
        var stats = getStats();
        stats.innings[0] = {};
        stats.innings[0].over = 5;
        stats.innings[0].ball = 5;

        var increment = {
            innings: 1,
            battingTeam: {},
            over: 1,
            ball: 1,
            runs: 1
        };

        processor.incrementStats(stats, increment);
        stats.innings[0].over.should.equal(6);
        stats.innings[0].ball.should.equal(0);     
    });

    it('should not increment on an extra', function(){
        var stats = getStats();
        stats.innings[0] = {};
        stats.innings[0].over = 2;
        stats.innings[0].ball = 3;

        var increment = {
            innings: 1,
            battingTeam: {},
            over: 1,
            ball: 0,
            runs: 1
        };

        processor.incrementStats(stats, increment);
        stats.innings[0].over.should.equal(2);
        stats.innings[0].ball.should.equal(3);     
    });
});

describe('The wicket count', function(){
    it('should not increment unless there is a wicket', function(){ 
        var stats = getStats();
        var increment = {
            innings: 1,
            battingTeam: {},
            over: 1,
            ball: 1,
            runs: 0
        };

        processor.incrementStats(stats, increment);
        stats.innings[0].wickets.should.equal(0);
    });

    it('should increment when there is a wicket', function(){ 
        var stats = getStats();
        var increment = {
            innings: 1,
            battingTeam: {},
            over: 1,
            ball: 1,
            runs: 0,
            wickets: 1
        };

        processor.incrementStats(stats, increment);
        stats.innings[0].wickets.should.equal(1);
    });
});