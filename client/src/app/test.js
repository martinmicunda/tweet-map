
$(function() {
    var LiveMap, LiveMapView;
    window.MarkerImage = google.maps.MarkerImage;
    window.Marker = google.maps.Marker;
    window.Point = google.maps.Point;
    window.LatLng = google.maps.LatLng;
    window.Size = google.maps.Size;
    window.InfoWindow = google.maps.InfoWindow;
    LiveMap = (function() {

        function LiveMap(auto_show_chance, view) {
            this.auto_show_chance = auto_show_chance;
            this.view = view;
            this.counter = 0;
            this.setup_socket();
        }

        LiveMap.prototype.setup_socket = function() {
            var socket,
                _this = this;
            socket = io.connect();
            socket.on('tweets', function(tweets) {
                var auto_show, data, image, lat, lng, text, tweet, user, _i, _len;
                data = JSON.parse(decodeURIComponent(escape(tweets)));
                for (_i = 0, _len = data.length; _i < _len; _i++) {
                    tweet = data[_i];
                    auto_show = _this.random_percent() < _this.auto_show_chance;
                    lat = tweet.lat;
                    lng = tweet.lon;
                    user = tweet.user;
                    text = tweet.text;
                    image = tweet.image;
                    _this.view.add_marker(lat, lng, user, image, text, auto_show, 10000);
                    _this.counter++;
                }
                return _this.view.update_counter(_this.counter);
            });
            return socket.on('disconnect', function() {
                return _this.view.disconnected();
            });
        };

        LiveMap.prototype.random_percent = function() {
            return Math.floor(Math.random() * 100 + 1);
        };

        return LiveMap;

    })();
    LiveMapView = (function() {

        function LiveMapView(start_location, zoom_level) {
            var options;
            options = {
                zoom: zoom_level,
                center: start_location,
                mapTypeId: google.maps.MapTypeId.HYBRID
            };
            this.map = new google.maps.Map(document.getElementById('map_canvas'), options);
            this.counter = $("#counter");
            this.title = $("#title");
            this.infowindow = false;
        }

        LiveMapView.prototype.update_counter = function(count) {
            return this.counter.text(count);
        };

        LiveMapView.prototype.disconnected = function() {
            this.title.html("DISCONNECTED<br />Please refresh the page.");
            return this.title.css("color", "#ff0000");
        };

        LiveMapView.prototype.marker_for = function(lat, lng, user, image) {
            var marker, shadow_image, user_image;
            user_image = new MarkerImage(image, new Size(48, 48));
            shadow_image = new MarkerImage('/map_shadow.png', null, null, new Point(18, 26));
            marker = new Marker({
                position: new LatLng(lat, lng),
                map: this.map,
                title: user,
                icon: user_image,
                shadow: shadow_image
            });
            return marker;
        };

        LiveMapView.prototype.info_window_for = function(image, user, tweet) {
            var infowindow;
            infowindow = new InfoWindow({
                content: "<div class='info'>" + ("<img src='" + image + "' align='left'>") + ("<a href='http://twitter.com/" + user + "' target='_blank'>@" + user + "</a>: " + tweet) + "</div>",
                disableAutoPan: true,
                maxWidth: 350
            });
            return infowindow;
        };

        LiveMapView.prototype.add_marker = function(lat, lng, user, image, tweet, autoshow, timeout) {
            var infowindow, marker,
                _this = this;
            if (timeout == null) {
                timeout = null;
            }
            marker = this.marker_for(lat, lng, user, image);
            infowindow = this.info_window_for(image, user, tweet);
            if (timeout != null) {
                marker.timeout = setTimeout((function() {
                    return _this.remove_marker(marker);
                }), timeout);
            }
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(_this.map, marker);
                if (marker.timeout != null) {
                    clearTimeout(marker.timeout);
                    return marker.timeout = setTimeout((function() {
                        return _this.remove_marker(marker);
                    }), timeout);
                }
            });
            if (autoshow === true && this.infowindow === false) {
                setTimeout((function() {
                    return infowindow.open(_this.map, marker);
                }), 1000);
                marker.auto_infowindow = infowindow;
                return this.infowindow = true;
            }
        };

        LiveMapView.prototype.remove_marker = function(marker) {
            marker.setMap(null);
            if (marker.auto_infowindow) {
                return this.infowindow = false;
            }
        };

        return LiveMapView;

    })();
    window.view = new LiveMapView(new LatLng(40, -95), 5);
    return window.Map = new LiveMap(10, view);
});
