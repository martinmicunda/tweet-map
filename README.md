[![Dependency Status](https://david-dm.org/martinmicunda/tweet-map.png)](https://david-dm.org/martinmicunda/tweet-map) [![devDependency Status](https://david-dm.org/martinmicunda/tweet-map/dev-status.png)](https://david-dm.org/martinmicunda/tweet-map#info=devDependencies)

TweetMap
=========

A Node.js webapp which generates a real-time heatmap of the most recent 1000 Irish tweets on a google map in real time. This is a node.js application that uses twitter public stream api with a filter criteria.

[Click here to see it in action!](http://tweet-map.herokuapp.com/)

## Technologies Used
+ [AngularJS](http://angularjs.org/)
+ [NodeJS](http://nodejs.org/)
+ [ExpressJS](http://expressjs.com/)
+ [Jade](http://jade-lang.com/)
+ [HTML5](http://www.w3.org/TR/2011/WD-html5-20110525/)
+ [CSS3](http://www.w3.org/TR/2001/WD-css3-roadmap-20010523/)
+ [Stylus](http://learnboost.github.io/stylus/)
+ [Bootstrap 3](http://getbootstrap.com/)
+ [GruntJS](http://gruntjs.com/)
+ [Bower](http://bower.io/)
+ [Twitter API v1.1](https://dev.twitter.com/)
+ [Google Map API v3](https://developers.google.com/maps/)

## Installation & Configuration

### Platform & tools

You need to install Node.js and then the development tools. Node.js comes with a package manager called [npm](http://npmjs.org) for installing NodeJS applications and libraries.
* [Install node.js](http://nodejs.org/download/) (requires node.js version >= 0.8.0)
* [Install Grunt](http://gruntjs.com/) as global npm modules (requires node.js version >= 0.8.0):

    ```
    npm install -g grunt-cli
    ```

### App
Run the following commands to download TweetMap app:
    ```
    git clone https://github.com/martinmicunda/tweet-map.git
    ```

* Install local dependencies (navigate to tweet-map directory):

    ```
    cd tweet-map
    npm install
    ```

(Note1: If you are getting error with github try this "git config --global url."https://".insteadOf git://".
 Note2: Make sure all 3rd dependencies from package.json and bower.json are isntalled on your local machine")

### Configure Twitter API
Go to [dev.twitter.com](https://dev.twitter.com/apps/new) and register an application. A set of keys will be created for you and you have to add them to [development.json](https://github.com/martinmicunda/tweet-map/blob/master/server/src/app/config/env/development.json) file.
``` javascript
"twitter": {
    "consumerKey": "",
    "consumerSecret": "",
    "accessTokenKey": "",
    "accessTokenSecret": ""
}
```

## Running App

### Start the Server
* Run the server (the command will automatically opens web browser)

    ```
    node app.js
    ```

* Browse to the application at [http://localhost:3000](http://localhost:3000)

## Author

**Martin Micunda**
+ <http://martinm.net>
