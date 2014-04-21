function parseXML() {

	site = 'http://www.nibts.org/sessions.xml';

	var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + site + '"') + '&format=xml&callback=?';

	// Request that YSQL string, and run a callback function.
	// Pass a defined function to prevent cache-busting.
	$.getJSON(yql, function(data){
		xmlDoc = $.parseXML(data.results[0]);
		$xml = $(xmlDoc);
		$markers = $xml.find("marker").each(function(index){
			var venue = $(this).attr('Venue');
			var address = $(this).attr('address');
			var dates = $(this).attr('dates');
			var datef = $(this).attr('datef');
			var lat = parseFloat($(this).attr('lat'));
			var lng = parseFloat($(this).attr('lng'));
				
			var MapMarker = Parse.Object.extend("Event");
			var mapMarker = new MapMarker();
			mapMarker.setACL(new Parse.ACL(Parse.User.current()))
			mapMarker.set("name", venue);
			mapMarker.set("address", address);
			mapMarker.set("date", dates);

			var location = new Parse.GeoPoint(lat,lng);
			mapMarker.set("geoLocation", location);
			mapMarker.save(null, {
				success: function(object) {
					updateMarkers();
					displayData();
				}
			});
		});
		
		
		
	});

}

