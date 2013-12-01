'use strict';
function initCall() {
    console.log("Google maps api initialized.");
    angular.bootstrap(document.getElementById("map"), ['doc.ui-map']);
}

angular.module('TweetMap', ['ngRoute', 'ui.map'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'HomeCtrl'
            }).otherwise({
                redirectTo: '/'
            });
    }])

    .controller('HomeCtrl', ['$scope', 'socket', function ($scope, socket) {
        var map
            , markersArray = []
            , aTweet
            , focusLocation
            , totalNogeoTweets = 0
            , totalgeoTweets = 0
            , limitTweetsTable = 100
            , limitMarkers = 1000
            , totalTweets = 0;

        // A google.maps namespaced objects for ease-of-access
        var MarkerImage = google.maps.MarkerImage;
        var Marker = google.maps.Marker;
        var Size = google.maps.Size;
        var Point = google.maps.Point;
        var LatLng = google.maps.LatLng;

        $scope.copyrightDate = new Date();
        $scope.tweets = [];
        $scope.tweetMarkers = [];
        $scope.tweetCounter = 0;
        socket.on('tweets', function(tweet) {
            $scope.tweets.unshift(new Tweet(tweet.user, tweet.text, tweet.image, tweet.geo, tweet.latitude, tweet.longitude));
            addMarker(tweet);
            $scope.tweetCounter++;
        });

        //Map setup
        $scope.mapOptions = {
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new LatLng(53.34, -6.26) // focus on Ireland (Dublin)
        };

        var marker_for = function(lat, lng, user, image) {
            var marker, shadow_image, user_image;
            user_image = new MarkerImage(image, new Size(48, 48));
            shadow_image = new MarkerImage('/map_shadow.png', null, null, new Point(18, 26));
            marker = new Marker({
                position: new LatLng(lat, lng),
                draggable: false,
                animation: google.maps.Animation.DROP,
                map: $scope.tweetMap,
                title: user
                //icon: user_image,
                //shadow: shadow_image
            });
            return marker;
        };

        var addMarker = function(tweet) {
            var marker = marker_for(tweet.latitude, tweet.longitude, tweet.user, tweet.image);
            var pp = {
                marker: marker,
                tweet: tweet
            }
            $scope.tweetMarkers.push(marker);
        };

        $scope.openMarkerInfo = function(marker) {
            $scope.currentMarker = marker;
            $scope.currentMarkerLat = marker.getPosition().lat();
            $scope.currentMarkerLng = marker.getPosition().lng();
            $scope.user = marker.getTitle();
            $scope.image = marker.getIcon();
            $scope.myInfoWindow.open($scope.tweetMap, marker);
        };

        $scope.clearAllTweets = function() {
            $scope.tweets.length = 0;
            $scope.tweetMarkers.length = 0;
            $scope.tweetCounter = 0;
        }
    }])

    .factory('socket', ['$rootScope', function($rootScope) {
        var socket = io.connect();
        return {
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if(callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    }]);
