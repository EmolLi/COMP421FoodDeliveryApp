// =================== mtl borough data ===============
let MTL = {
    "Ahuntsic-Cartierville"	: [45.544303, -73.668318],
    "Anjou"	: [45.614653, -73.564171],
    "Cote-des-Neiges-Notre-Dame-de-Grace"	: [45.498454, -73.627651],
    "Lachine"	: [45.442976, -73.693569],
    "LaSalle"	: [45.427672, -73.626125],
    "Le Plateau-Mont-Royal"	: [45.525222, -73.579950],
    "Le Sud-Ouest"	: [45.483088, -73.556799],
    "L'Ile-Bizard-Sainte-Genevieve"	: [45.492667, -73.900981],
    "Mercier-Hochelaga-Maisonneuve"	: [45.576694, -73.529321],
    "Montreal-Nord"	: [45.602946, -73.631909],
    "Outremont"	: [45.516114, -73.606296],
    "Pierrefonds-Roxboro"	: [45.505931, -73.840227],
    "Riviere-des-Prairies-Pointe-aux-Trembles"  :  [45.665115, -73.509530],
    "Rosemont-La Petite-Patrie"	: [45.554849, -73.575193],
    "Saint-Laurent"	: [45.501295, -73.715623],
    "Saint-Leonard"	: [45.593176, -73.595558],
    "Verdun" : [45.454204, -73.570405],
    "Ville-Marie" : [45.500006, -73.577223],
    "Villeray-Saint-Michel-Parc-Extension"  :  [45.568374, -73.625874]
};

let restaurants = {};
let addresses = {};
let userAddresses = {};
let users = {};
let payments = {};
let creditCards = {};



let googleMapClient = require('@google/maps').createClient({
  key: 'AIzaSyCt_yuo9AEl3pQPCDPekoJ_MAEK93kSaTs'
});

let faker = require('faker');


// get restaurants in each boroughs
for (let borough in MTL){
    googleMapClient.places({
        query: 'restaurant',
        language: 'en',
        location: MTL[borough],
        radius: 1000
    }, function(err, response) {
      if (!err) {
        let restaurantInfo = response.json.results;
        // console.log(borough, restaurantInfo);
        restaurantInfo.forEach((r) => {

            // create address
            let aid = makeID();
            let a = r.formatted_address;
            userAddresses[aid] = {
                "aid": aid,
                "borough": borough,
                "formatted_address": a.slice(0, a.length - 16),
                "zip_code": a.slice(a.length - 15, a.length - 8)
            };

            addresses[aid] = userAddresses[aid];


            let id = makeID();
            restaurants[id] = {
                "license_id": id,
                "aid": aid,
                "name": r.name,
                "opening_hours": randomOpenHour(),
                "Closing_hours": randomClosingHour(),
                "overall_rating": 0
            }
        })

      }
      else {
          console.log(err);
          exit(1);
      }
    });





    // user addresses
    googleMapClient.places({
        query: 'store',
        language: 'en',
        location: MTL[borough],
        radius: 1000
    }, function(err, response) {
        if (!err) {
            let userAddressesInfo = response.json.results;
            // console.log(borough, restaurantInfo);
            userAddressesInfo.forEach((r) => {

                // create address
                let aid = makeID();
                let a = r.formatted_address;
                addresses[aid] = {
                    "aid": aid,
                    "borough": borough,
                    "formatted_address": a.slice(0, a.length - 16),
                    "zip_code": a.slice(a.length - 15, a.length - 8)
                };


                let pid = makeID();
                let name = faker.name.findName();
                // create user with fake.js
                users[id] = {
                    "cell_phone_number": randomPhone(),
                    "name": name,
                    "balance_amount": 0,
                    "pid": makeID(),
                };
                payments[pid] = "Balance";



                // credit card
                let totalCardNumber = Math.floor(Math.random() * 3);
                for (let i = 0; i< totalCardNumber; i++){
                    let pid = makeID();
                    let cNumber = randomCreditCard();
                    creditCards[cNumber] = {
                        "pid": pid,
                        "card_number": cNumber,
                        "holder_name": name,
                        "expiry_date"
                    }
                }


            })

        }
        else {
            console.log(err);
            exit(1);
        }
    });

}







// credit cards
for (let i = 0; i< 100; i++){
    let pid = makeID();
    let cNumber = randomCreditCard();
    creditCards[cNumber] = {
        "pid": pid,
        "card_number": cNumber,

    }

    /**
     *     pid CHAR(10) NOT NULL PRIMARY KEY,
     card_number CHAR(16) NOT NULL,
     expiry_date DATE NOT NULL,
     holder_name VARCHAR(20) NOT NULL,
     */
}





// TODO: category table not generated


// ====== helpers ==========
let possibleOpenHours = [6, 7, 8, 9, 10];
let possibleClosingHours = [17, 18, 19, 20, 21];
function randomOpenHour() {
    return possibleOpenHours[Math.floor(Math.random()*possibleOpenHours.length)];
}

function randomClosingHour() {
    return possibleClosingHours[Math.floor(Math.random()*possibleClosingHours.length)];
}


let ids = {};
function makeID() {
    let id = idhelper();
    while (ids[id]){
        id = idhelper();
    }
    ids[id] = true; // id booked
    return id;
}
function idhelper() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function randomPhone() {
   let phone = randomPhoneHelper();
   while(users[phone]){
       phone = randomPhoneHelper();
   }
   return phone;
}
function randomPhoneHelper() {
    let text = "514";
    let possible = "0123456789";

    for (let i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}


function randomCreditCard() {
    let card = randomCreditCardHelper();
    while(creditCards[card]){
        card = randomCreditCardHelper();
    }
    return card;
}
function randomCreditCardHelper() {
    let text = "";
    let possible = "0123456789";

    for (let i = 0; i < 12; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}


function randomExpireDate() {
    let text = "";
    text += Math.random() * 30
}