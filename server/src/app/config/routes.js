// RESTful API Handlers
var handlers = {
    tweets: require('../controllers/tweets')
};

module.exports = function(app) {

    // TWEETS RESTful
    app.get('/', handlers.tweets.index);
};