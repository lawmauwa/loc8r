var request = require('request');
var apiOptions = {
    server:"http://localhost:3000"
};
if(process.env.NODE_ENV === "production"){
    apiOptions.server = "https://murmuring-reef-47475.herokuapp.com";
};

var _formatDistance = function (distance){
    var numDistance, unit;
    if(distance > 1){
        numDistance = parseFloat(distance).toFixed(1);
        unit = 'km';
    } else {
        numDistance = parseInt(distance * 1000, 10);
        unit = 'm';
    }
    return numDistance + unit;
};


// var renderHomepage = function(req, res, responseBody){
//     var message;
//     console.log('.................renderHomepage Function ................');
//     console.log('responseBody: ' + responseBody);
//     if(!(responseBody instanceof Array)){
//         message = "API lookup error";
//         responseBody = [];
//     } else {
//         if(!responseBody.length){
//             message = "No places found nearby";
//         }
//     }
//     res.render('locations-list', {
//         title: 'Loc8r - find a place to work with wifi',
//         pageHeader: {
//             title: 'Loc8r',
//             strapline: 'Find places to work with wifi near you!'
//         },
//         sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
//         locations: responseBody,
//         message: message
//     });
// };

var renderHomepage = function(req, res, responseBody){
  var message;
  console.log('.................renderHomepage Function ................');
  
  if (!(responseBody instanceof Array)) {
    console.log('is the responseBody an instance of Array?: ' + (responseBody instanceof Array) )
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = "No places found nearby";
    }
  }
  console.log('responseBody: ' + responseBody);
  console.log('message: ' + message);
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
    locations: responseBody,
    message: message
  });
};


/* GET 'home' page */
module.exports.homelist = function(req, res) {
    console.log('.........................................')
    console.log('..........homelist.......................')
    var requestOptions, path;
    path = '/api/locations/';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs: {
            lng : -0.7992599,
            lat: 51.378091,
            maxDistance: 20
        }
    };
    console.log(requestOptions.url);
    request(
        //requestOptions,
        'http://localhost:3000/api/locations/?lng=-0.7992599&lat=51.378091&maxDistance=20',
        function(err, response, body){
            console.log('this is the body responded: ' + body);
            var i, data;
            data = body;
            console.log('body length is : ' + body.length);
            console.log('status code is : ' + response.statusCode);
            if(response.statusCode === 200 && data.length){
                for (i=0; i<data.length; i++){
                    data[i].distance = _formatDistance(data[i].distance);
                }    
            }
            renderHomepage(req, res, data);
        }

    );
    console.log('............end of homelist..............')
    console.log('.........................................')
};

/* GET 'Location info' page */
module.exports.locationInfo = function(req, res) {
    res.render('location-info', {
        title: 'Starcups',
        pageHeader: {
            title: 'Starcups'
        },
        sidebar: {
            context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: {
            name: 'Starcups',
            address: '125 High Street, Reading, RG6 1PS',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            coords: {
                lat: 51.455041,
                lng: -0.9690884
            },
            openingTimes: [{
                days: 'Monday - Friday',
                opening: '7:00am',
                closing: '7:00pm',
                closed: false
            }, {
                days: 'Saturday',
                opening: '8:00am',
                closing: '5:00pm',
                closed: false
            }, {
                days: 'Sunday',
                closed: true
            }],
            reviews: [{
                author: 'Simon Holmes',
                rating: 5,
                timestamp: '16 July 2013',
                reviewText: 'What a great place. I can\'t say enough good things about it.'
            }, {
                author: 'Charlie Chaplin',
                rating: 3,
                timestamp: '16 June 2013',
                reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
            }]
        }
    });
};

/* GET 'Add review' page */
module.exports.addReview = function(req, res) {
    res.render('location-review-form', {
        title: 'Review Starcups on Loc8r',
        pageHeader: {
            title: 'Review Starcups'
        }
    });
};