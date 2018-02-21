// =================== mtl borough data ===============
let MTL = {
    "Ahuntsic-Cartierville"	: [45.544303, -73.668318],
    "Anjou"	: [45.614653, -73.564171],
    "Côte-des-Neiges–Notre-Dame-de-Grâce"	: [45.498454, -73.627651],
    "Lachine"	: [45.442976, -73.693569],
    "LaSalle"	: [45.427672, -73.626125],
    "Le Plateau-Mont-Royal"	: [45.525222, -73.579950],
    "Le Sud-Ouest"	: [45.483088, -73.556799],
    "L'Île-Bizard–Sainte-Geneviève"	: [45.492667, -73.900981],
    "Mercier–Hochelaga-Maisonneuve"	: [45.576694, -73.529321],
    "Montréal-Nord"	: [45.602946, -73.631909],
    "Outremont"	: [45.516114, -73.606296],
    "Pierrefonds-Roxboro"	: [45.505931, -73.840227],
    "Rivière-des-Prairies–Pointe-aux-Trembles"  :  [45.665115, -73.509530],
    "Rosemont–La Petite-Patrie"	: [45.554849, -73.575193],
    "Saint-Laurent"	: [45.501295, -73.715623],
    "Saint-Léonard"	: [45.593176, -73.595558],
    "Verdun" : [45.454204, -73.570405],
    "Ville-Marie" : [45.500006, -73.577223],
    "Villeray–Saint-Michel–Parc-Extension"  :  [45.568374, -73.625874]
}

let restaurants;

let googleMapClient = require('@google/maps').createClient({
  key: 'AIzaSyCt_yuo9AEl3pQPCDPekoJ_MAEK93kSaTs'
});


// get restaurants in each broughs
for (let borough in MTL){
    googleMapClient.places({
        query: 'restaurant',
        language: 'en',
        location: MTL[borough],
        radius: 1000
    }, function(err, response) {
      if (!err) {
        var restaurantInfo = response.json.results;
        console.log(borough, restaurantInfo.length);
        // restaurantInfo.forEach((r) => {
            // console.log(r.name);
        // })


      }
      else {
          console.log(err);
          exit(1);
      }
    });
}
