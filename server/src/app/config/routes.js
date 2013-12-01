// RESTful API Handlers
var handlers = {
    tweets: require('../controllers/tweets')
};

module.exports = function(app, io) {

    // CHEEPS RESTful
//    app.get('/', handlers.cheeps.index);
//    app.get('/cheeps', handlers.cheeps.getCheeps);
//    app.get('/cheeps/:id', handlers.cheeps.getCheep);
//    app.post('/cheeps', handlers.cheeps.postCheep(io));

    // TWEETS RESTful
    app.get('/', handlers.tweets.index);
};