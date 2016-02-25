var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var theEarth = (function(){
	var earthRadius = 6371;

	var getDistanceFromRads = function(rads){
		return parseFloat(rads * earthRadius);
	};

	var getRadsFromDistance = function(distance){
		return parseFloat(distance / earthRadius);
	};

	return {
		getDistanceFromRads: getDistanceFromRads,
		getRadsFromDistance: getRadsFromDistance
	};
})();


var sendJsonResponse = function(res, status, content){
	res.status(status);
	res.json(content);
}

module.exports.locationsListByDistance = function (req, res) {
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	var maxDistance = parseFloat(req.query.maxDistance);
	var point = {
		type : "Point",
		coordinates: [lng, lat]
	};
	var geoOptions = {
		spherical: true,
		//maxDistance: theEarth.getRadsFromDistance(maxDistance),
		maxDistance: parseFloat(0.003139225),
		num: 10
	};
	Loc.geoNear(point, geoOptions, function(err, results, stats) {
	    var locations;
	    console.log(point);
	    console.log('Geo Results', results);
	    console.log('Geo stats', stats);
	    if (err) {
	      console.log('geoNear error:', err);
	      sendJsonResponse(res, 404, err);
	    } else {
	      locations = buildLocationList(req, res, results, stats);
	      sendJsonResponse(res, 200, locations);
	    }
  	});


	var buildLocationList = function(req, res, results, stats) {
	  var locations = [];
	  results.forEach(function(doc) {
	    locations.push({
	      distance: theEarth.getDistanceFromRads(doc.dis),
	      name: doc.obj.name,
	      address: doc.obj.address,
	      rating: doc.obj.rating,
	      facilities: doc.obj.facilities,
	      _id: doc.obj._id
	    });
	  });
	  return locations;
	};
};

module.exports.locationsCreate = function (req, res) {
	sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.locationsReadOne = function (req, res) {
	if(req.params && req.params.locationid){
		Loc
			.findById(req.params.locationid)
			.exec(function(err, location){
				 if(!location){
				 	sendJsonResponse(res, 404, {
				 		"message" : "locationid not found"
				 	});
				 	return;
				 } else if (err){
				 	sendJsonResponse(res, 404, err);
				 	return;
				 }
				 sendJsonResponse(res, 200, location);
			});
	} else {
		sendJsonResponse(res, 404 , {
			"message" : "No locationid in request"
		});
	}
	// sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.locationsUpdateOne = function (req, res) {
	sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.locationsDeleteOne = function (req, res) {
	sendJsonResponse(res, 200, {"status" : "success"});
};

