//Event Creation
function saveMarker() {
	var form=document.forms["markerForm"];
	//get the form variables
	var name = form["name"].value;
	var address = form["address"].value;
	var date = form["datepicker"].value;

	var MapMarker = Parse.Object.extend("Event");
	var mapMarker = new MapMarker();
	mapMarker.setACL(new Parse.ACL(Parse.User.current()))
	mapMarker.set("name", name);
	mapMarker.set("address", address);
	mapMarker.set("date", date);
	
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({ 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var lat = results[0].geometry.location.lat();
			var lng = results[0].geometry.location.lng();
			var location = new Parse.GeoPoint(lat,lng);
			mapMarker.set("geoLocation", location);
			mapMarker.save(null, {
				success: function(object) {
					updateMarkers();
					displayData();
				}
			});
			document.getElementById('eventNotification').innerHTML = '';
		} else {
			document.getElementById('eventNotification').innerHTML = "<div class='alert alert-danger'>Error with address geocode: " + status+"</div>";
		}
	});
}

//jQuery table management
function Save(){
	var par = $(this).parent().parent(); //tr
	var parseID = par.attr('id');
	if (!parseID) return;
	
	
	var MapMarker = Parse.Object.extend("Event");
	var query = new Parse.Query(MapMarker);
	

	var tdName = par.children("td:nth-child(1)");
	var tdAddress = par.children("td:nth-child(2)");
	var tdDate = par.children("td:nth-child(3)");
	var tdButtons = par.children("td:nth-child(4)");
	//get new event details
	var newEventName = tdName.children("input[type=text]").val()
	var newEventAddress = tdAddress.children("input[type=text]").val()
	var newEventDate = tdDate.children("input[type=text]").val()	
	var newLocation;
	
	tdName.html(newEventName);
	tdAddress.html(newEventAddress);
	tdDate.html(newEventDate);
	tdButtons.html("<button type='button' class='btnEdit btn btn-warning'>Edit</button> " +
				   "<button type='button' class='btnDelete btn btn-danger'>Delete</button>");
 
	$(".btnEdit").bind("click", Edit);
	$(".btnDelete").bind("click", Delete);
	
	var geocoder = new google.maps.Geocoder();
	var validEdit = true;
	
	document.getElementById('manageNotification').innerHTML = '';
	geocoder.geocode({ 'address': newEventAddress}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var lat = results[0].geometry.location.lat();
			var lng = results[0].geometry.location.lng();
			newLocation = new Parse.GeoPoint(lat,lng);
			//make change with parse backend
			query.get(parseID, {
			  success: function(mapMarker) {
				// The object was retrieved successfully.
				mapMarker.set("name", newEventName);
				mapMarker.set("address", newEventAddress);
				mapMarker.set("date", newEventDate);
				mapMarker.set("geoLocation", newLocation);
				mapMarker.save(null, {
				  success: function() {
					updateMarkers();
				  }
				});
			
			  },
			  error: function(object, error) {
				// The object was not retrieved successfully.
				// error is a Parse.Error with an error code and description.
				alert('issue with save');
			  }
			});

		} else {
			document.getElementById('manageNotification').innerHTML = "<div class='alert alert-danger'>Geocode was not successful because: " + status + "</div>";
		}
	});
	
};

function Edit(){
	var par = $(this).parent().parent(); //tr
	var tdName = par.children("td:nth-child(1)");
	var tdAddress = par.children("td:nth-child(2)");
	var tdDate = par.children("td:nth-child(3)");
	var tdButtons = par.children("td:nth-child(4)");
 
	tdName.html("<input type='text' id='txtName' value='"+tdName.html()+"'/>");
	tdAddress.html("<input type='text' id='txtAddress' value='"+tdAddress.html()+"'/>");
	tdDate.html("<input type='text' id='txtEmail' value='"+tdDate.html()+"'/>");
	tdButtons.html("<button type='button' class='btnSave btn btn-success'>Save</button>");
 
	$(".btnSave").bind("click", Save);
};

function Delete(){
	var MapMarker = Parse.Object.extend("Event");
	var query = new Parse.Query(MapMarker);
	
	var par = $(this).parent().parent(); //tr
	//parse management
	var parseID = par.attr('id');
	//make change with parse backend
	query.get(parseID, {
	  success: function(event) {
		// The object was retrieved successfully.
		event.destroy().then(function() {			
			updateMarkers();
			displayData();
		});
	
	  },
	  error: function(object, error) {
		// The object was not retrieved successfully.
		// error is a Parse.Error with an error code and description.
	  }
	});			
};
