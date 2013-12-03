/**
 * Module dependencies.
 */
var twitter = require('ntwitter'),
    config = require('./config.js');

module.exports = function(io) {

    // setup API
    var twit = new twitter({
        consumer_key: config.twitter.consumerKey,
        consumer_secret: config.twitter.consumerSecret,
        access_token_key: config.twitter.accessTokenKey,
        access_token_secret: config.twitter.accessTokenSecret
    });

    // setup filter location criteria (Ireland - Dublin)
    var criteria = ['-07,53,-06,54'];
    // streaming Irish tweets from Twitter
    twit.stream('statuses/filter', { locations: criteria }, function(stream) {
        stream.on('data', function (tweet) {
            var geo = false,latitude,longitude;
            if(tweet.geo != null){
                geo = true;
                latitude = tweet.geo.coordinates[0];
                longitude = tweet.geo.coordinates[1];
            }
            if(tweet.user != undefined) {
                io.sockets.volatile.emit('tweets', {
                    user: tweet.user.screen_name,
                    text: tweet.text,
                    image: tweet.user.profile_image_url,
                    geo : geo,
                    latitude: latitude,
                    longitude: longitude
                });
            }
        });
    });
};