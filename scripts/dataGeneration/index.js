// =================== mtl borough data ===============
let MTL = {
    "Anjou"	: [45.614653, -73.564171],
    "Lachine"	: [45.442976, -73.693569],
    "LaSalle"	: [45.427672, -73.626125],
    "Le Plateau-Mont-Royal"	: [45.525222, -73.579950],
    "Montreal-Nord"	: [45.602946, -73.631909],
    "Outremont"	: [45.516114, -73.606296],
    "Saint-Laurent"	: [45.501295, -73.715623],
    "Saint-Leonard"	: [45.593176, -73.595558],
    "Verdun" : [45.454204, -73.570405],
    "Ville-Marie" : [45.500006, -73.577223],
};










let dishes = ["Waffle Fries", "Double Double", "Fries", "Chicken Sandwich", "Curly Fries", "Blizzard", "Frosty", "McFlurry", "Bacon Cheeseburger", "Spicy Chicken Sandwich", "Chicken Nuggets", "Baguette", "String", "Flute", "focaccia", "Country bread", "Croissant", "Christmas log", "Liege coffee", "clafoutis", "Creme brulee", "Croquembouche", "Apple crisp", "lightning", "Far Breton", "strawberries tree", "Galette des rois", "Yogurt cake", "macarons", "Madeleine", "Thousand sheets", "Chocolate mousse", "Chocolate bread", "French toast", "Four quarters", "honored Saint", "Breath", "Tarte Tatin", "rum baba", "Crepe and fruit", "Lorraine Spindle", "Ice Plumbers", "Minced meat pie from Lorraine, France", "Nancy Macarons", "Madeleine", "Potee Lorraine", "Quiche Lorraine", "Brimble tart (Blueberry)", "Mirabelle tart", "Head of veal", "Pie", "Baeckeoffe", "Carp fries", "Garnished sauerkraut", "Rooster Cocktail", "Knack", "Kouglof", "Roast beef with Alsatian", "Spaetzle", "Onion tart", "Flamey Tart", "Matelote", "Mussels with Normandy cream", "Axoa", "Duck confit", "Foie gras", "French Ham and Vegetable Stew", "Duck breast", "piperade"];
let dishTypes = ["A", "B", "C", "D", "E"];

let CStyles = ["Vegetaian", "Vegan", "Meat Lover", "Asian"];
let CCountry = ["Japanese", "Chinese", "Mexican", "American", "Italien", "European", "French", "Thailand", "Vietnam"];
let CTaste = ["Spicy", "Salty", "Sugar"];


let assignedOrderStatus = ["WaitingForDelivery", "OnTheWay", "Completed"];


let possibleReviews =["Nice!", "Awesome!", "Not bad", "I love it", "Hmmm", "recommended"];





let restaurants = {};
let addresses = {};
let userAddresses = {};
let users = {};
let deliveryStaffs = {};
let deliveryStaffsByBoroughs = {};
let payments = {};
let creditCards = {};
let categories = {};
let saves = {};
let orders = {};
let registers = {};
let deliveryBy = {};
let categorizedAs = {};
let reviews = {};
let contains = {};

let ids = {};


let googleMapClient = require('@google/maps').createClient({
  key: 'AIzaSyD-qzOk-F-ynWOh_7G4_lmP4aG8vivbHMA'
});

let faker = require('faker');
let jsonfile = require('jsonfile');


let userAddressesInfoByBorough = {};
let restaurantsByBorough = {};

let boroughs = Object.keys(MTL);
let fn = function getInfo(b){ // sample async action
    return new Promise(resolve => {
            let p = new Promise(resolve =>  {
                googleMapClient.places({
                    query: 'store',
                    language: 'en',
                    location: MTL[b],
                    radius: 1000
                }, function (err, response) {
                    if (!err) {
                        console.log(response.json.results.length);
                        resolve({"addresses" : response.json.results});
                    }
                    else {
                        console.log(err);
                        exit(1);
                    }
                });
            });
            p.then((data) => {
                googleMapClient.places({
                    query: 'restaurant',
                    language: 'en',
                    location: MTL[b],
                    radius: 1000
                }, function (err, response) {
                    if (!err) {
                        console.log(response.json.results.length);
                        data["restaurant"] = response.json.results;
                        resolve(data);
                    }
                    else {
                        console.log(err);
                        exit(1);
                    }
                });
            });
        });
};

// map over forEach since it returns

let res = boroughs.map(fn); // run the function over all items
// we now have a promises array and we want to wait for it

let results = Promise.all(res); // pass array of promises

results.then((data) => {// or just .then(console.log)
    console.log(data); // [2, 4, 6, 8, 10]
    jsonfile.writeFile('./fakeData/data.json', data, function (err) {
        console.error(err);
    });
});
/**
// we can nest this of course, as I said, `then` chains:

var res2 = Promise.all([1, 2, 3, 4, 5].map(fn)).then(
    data => Promise.all(data.map(fn))
).then(function(data){
    // the next `then` is executed after the promise has returned from the previous
    // `then` fulfilled, in this case it's an aggregate promise because of
    // the `.all`
    return Promise.all(data.map(fn));
}).then(function(data){
    // just for good measure
    return Promise.all(data.map(fn));
});

// now to get the results:

res2.then(function(data){
    console.log(data); // [16, 32, 48, 64, 80]
});




let pr = new Promise((resolve, reject) => {
    for (let borough in MTL) {

    }
});


let pa = new Promise((resolve, reject) => {

    for (let borough in MTL) {
        googleMapClient.places({
            query: 'store',
            language: 'en',
            location: MTL[borough],
            radius: 1000
        }, function (err, response) {
            if (!err) {
                console.log(response.json.results.length);
                userAddressesInfoByBorough[borough] = response.json.results;
            }
            else {
                console.log(err);
                exit(1);
            }
        });
    }
});

Promise.all([pr, pa]).then(values => {
    console.log(values);
}, reason => {
    console.log(reason)
});

// get restaurants in each boroughs

for (let borough in MTL) {
    googleMapClient.places({
        query: 'restaurant',
        language: 'en',
        location: MTL[borough],
        radius: 1000
    }, function (err, response) {
        if (!err) {
            console.log(response.json.results.length);
            restaurantsByBorough[borough] = JSON.parse(response.json.results);
            console.log(restaurantsByBorough);
        }
        else {
            console.log(err);
            exit(1);
        }
    });
}





jsonfile.writeFile('./fakeData/restaurants.json', restaurantsByBorough, function (err) {
    console.error(err)
});


for (let borough in MTL) {
    googleMapClient.places({
        query: 'store',
        language: 'en',
        location: MTL[borough],
        radius: 1000
    }, function (err, response) {
        if (!err) {
            console.log(response.json.results.length);
            userAddressesInfoByBorough[borough] = response.json.results;
        }
        else {
            console.log(err);
            exit(1);
        }
    });
}


jsonfile.writeFile('./fakeData/userAddresses.json', userAddressesInfoByBorough, function (err) {
    console.error(err)
});




/**
jsonfile.readFile('./fakeData/restaurants.json', function(err, restaurantInfo) {
    // console.log(borough, restaurantInfo);
    restaurantInfo.slice(1, 11).forEach((r) => {

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
            "categories": {},
            "dishes": {}
        }
    });
});








    // create address
    let r = {
    formatted_address: "fsdfdafdsfdddddddddddddddddddddddddddddddddddddasdf"
    };
    let borough = "sdf";


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
    let number = randomPhone();
    // create user with fake.js
    users[number] = {
        "cell_phone_number": number,
        "name": name,
        "balance_amount": 0,
        "pid": makeID(),
        "addresses": {}
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
            "expiry_date": randomExpiryDate()
        };
        payments[pid] = "creditCard";
        users[number]["creditCard"] = {};
        users[number]["creditCard"][pid] = pid;


        registers[pid + number] = {
            "pid": pid,
            "cell_phone_number": number
        }
    }









// address - users (saves)
// make sure every address is mapped to a user
for (let aid in userAddresses){
        let userCnt = 1;
        if (Math.random() > 0.8) userCnt = 2;
        for (i = 0; i< userCnt; i++){
            let uid = randomItem(users.keys());
            users[uid].addresses[aid] = aid;
        }
}
// generate saves table
for (let uid in users){
    for (let aid in users[uid].addresses){
        if (users[uid].addresses.hasOwnProperty(aid)){
            saves[uid + aid] = {
                "cell_phone_number": uid,
                "aid": aid
            }
        }
    }
}







    console.log("A");







/**


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
                        "expiry_date": faker.date.future();
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



**/





    /**
     *     pid CHAR(10) NOT NULL PRIMARY KEY,
     card_number CHAR(16) NOT NULL,
     expiry_date DATE NOT NULL,
     holder_name VARCHAR(20) NOT NULL,
     */
// }

/**


// delivery staffs

let boroughs = MTL.keys();
for (let b in boroughs) {
    deliveryStaffsByBoroughs[b] = {};
}

for (let i = 0; i< 100; i++){
    let name = faker.name.findName();
    let number = randomPhone();
    // create user with fake.js
    deliveryStaffs[number] = {
        "cell_phone_number": number,
        "name": name,
        "borough": boroughs[Math.floor(Math.random()*boroughs.length)]
    };

    deliveryStaffsByBoroughs[deliveryStaffs[number].borough][number] = number;
}


// dishes
for (let lid in restaurants){
    let dishCnt = Math.floor(Math.random() * 6);
    let start = Math.floor(Math.random() * (dishNames.length - dishCnt - 1));
    for (let j = start; j < dishCnt; j++){
        let dish = {
            "license_id": lid,
            "name": dishNames[j],
            "price": Math.random() * 30 + 5,
            "type": dishTypes[Math.floor(Math.random()*dishTypes.length)]
        };
        dishes[dish.license_id + dish.name] = dish;
        restaurants[lid].dishes[dish.name] = dish.name;

    }
}



// TODO: category table not generated
// category
for (let i = 0; i< 20; i++){
    let cid = makeID();
    categories[cid] = {
        "cid": cid,
        "style": Math.random() > 0.5 ? null : CStyles[Math.floor(Math.random()*CStyles.length)],
        "country": Math.random() > 0.2 ? null : CCountry[Math.floor(Math.random()*CCountry.length)],
        "taste": Math.random() > 0.4 ? null : CTaste[Math.floor(Math.random()*CTaste.length)]
    };
}




// orders

for (let i =0; i< 100; i++){
    let oid = makeID();


    let customerID = randomItem(users.keys());
    while(users[customerID].addresses.keys().length == 0){
        customerID = randomItem(users.keys());
    }

    let c = users[customerID];

    let pid = c.pid;
    if (c.creditCard.keys() > 0 && Math.random() > 0.5){
        // use credit card
        pid = randomItem(c.creditCard.keys());
    }

    let aid = randomItem(c.addresses.keys());

    orders[oid] = {
        "oid": oid,
        "status": "Unassigned",
        "pid": pid,
        "cell_phone_number": customerID,
        "aid": aid,
        "restaurant": randomItem(restaurants.keys()),
        "dishes": {}
    }
}



// deliveryBy
for (let oid in orders){
    if (Math.random() > 0.3) {
        // assign a delivery staff
        let borough = userAddresses[orders[oid].aid].borough;
        let dsid = randomItem(deliveryStaffsByBoroughs[boroughs].keys());
        deliveryBy[oid] = {
            "oid": oid,
            "cell_phone_number": dsid
        };

        orders[oid] = randomItem(assignedOrderStatus);
    }
}




// categorizedAs
for (let lid in restaurants){
    let cCnt = Math.floor(Math.random() * 2) +1;
    for (let i = 0; i < cCnt; i++){
        let cid = randomItem(categories.keys());
        restaurants[lid].categories[cid] = cid;
    }

    for (let cid in restaurants[lid].categories.keys()){
        if (restaurants[lid].categories.hasOwnProperty(cid)){
            categorizedAs[cid + lid] = {
                "cid": cid,
                "license_id": lid
            }
        }
    }
}




// reviews
for (let oid in orders){
    if (Math.random() > 0.7) {
        reviews[oid] = {
            "oid": oid,
            "license_id": orders[oid].restaurant,
            "rating": Math.floor(Math.random()*5) + 1,
            "comment": randomItem(possibleReviews)
        }
    }
}





// contains
for (let oid in orders){
    let fcnt = Math.random()*3 +1;
    let order = orders[oid];
    let dishes = restaurants[order.license_id].dishes;
    for (let i = 0; i< fcnt; i++){
        let dish = randomItem(dishes.keys());
        order.dishes[dish] = dish;
    }

    for (let d in order.dishes,keys()){
        if (order.dishes.hasOwnProperty(d)){
            contains[oid + order.license_id + d] = {
                "oid": oid,
                "license_id": order.license_id,
                "name": dishes[d].name,
                "quantity": Math.floor(Math.random()*4) + 1
            }
        }
    }

}






// ====== helpers ==========
let possibleOpenHours = [6, 7, 8, 9, 10];
let possibleClosingHours = [17, 18, 19, 20, 21];
function randomOpenHour() {
    return possibleOpenHours[Math.floor(Math.random()*possibleOpenHours.length)];
}

function randomClosingHour() {
    return possibleClosingHours[Math.floor(Math.random()*possibleClosingHours.length)];
}


function randomItem(dataArray) {
    return dataArray[Math.floor(Math.random()*dataArray.length)];
}
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


function randomExpiryDate() {
    let text = "";
    text += Math.floor(Math.random()*12) + 1;   // month
    text += "/";
    text += Math.floor(Math.random()*30) + 1;   // day
    text += "/";
    text += Math.floor(Math.random()*4) + 2018; // year
    return text;
}**/