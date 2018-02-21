let restaurant

let googleMapClient = require('@google/maps').createClient({
  key: 'AIzaSyCt_yuo9AEl3pQPCDPekoJ_MAEK93kSaTs'
});


// Geocode an address.
googleMapClient.places({
    query: 'restaurant',
    language: 'en',
    location: [45.502437, -73.576700],
    radius: 5000
}, function(err, response) {
  if (!err) {
    var restaurantInfo = response.json.results;
  }
  else {
      console.log(err);
      exit(1);
  }
});
