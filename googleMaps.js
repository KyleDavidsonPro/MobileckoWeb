var markers = [];

//Clear map of markers
function clearOverlays() {
	for (var i = 0; i < markers.length; i++ ) {
		markers[i].setMap(null);
	}
	markers.length = 0;
}

//Global var for the map
var map;

//Make detail view for marker
function makeInfoWindowEvent(map, infowindow, marker) {
  google.maps.event.addListener(marker, 'click', function() {
	infowindow.open(map, marker);
  });
}

//Initialize Google Maps
function initialize() {
	var map_canvas = document.getElementById('map_canvas');
	var map_options = {
		center: new google.maps.LatLng(44.5403, -78.5463),
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(map_canvas, map_options)
	updateMarkers();
	displayData();
}

//Update the map markers
function updateMarkers() {
	clearOverlays();
	var MapMarker = Parse.Object.extend("Event");
	var query = new Parse.Query(MapMarker);
	
	query.find({
		success: function(results) {
			var parseMarkers = results;
			var lat = 10;
			var lng = 10;
			
			for (var i = 0; i < parseMarkers.length; i++) {
				lat = parseMarkers[i].get("geoLocation").latitude;
				lng = parseMarkers[i].get("geoLocation").longitude;
				//create the marker
				var marker = new google.maps.Marker({
					map: map,
					position: new google.maps.LatLng(lat,lng)
				});
				//create the content string
				var contentString = '<div id="content">'+
				'<h1 id="firstHeading" class="firstHeading">Details of event</h1>'+
				'<div id="bodyContent">'+
						'Event Name: ' + parseMarkers[i].get("name") + "<br />" +
						'Event Address: ' + parseMarkers[i].get("address") + "<br />" +
						'Event Date: ' + parseMarkers[i].get("date") + "<br />" +
				'</div>'+
				'</div>';
				//create the info window
				var infowindow = new google.maps.InfoWindow({
					content: contentString
				});
				makeInfoWindowEvent(map, infowindow, marker);
				
				markers.push(marker);

			}
			map.setCenter(new google.maps.LatLng(lat,lng));
		},

		error: function(error) {
			// error is an instance of Parse.Error.
		}
	});
}