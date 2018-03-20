/**
 * Created by emol on 3/19/18.
 */
module.exports = DataGen = {};
const G = {};

function makeID(){
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


DataGen.makeUser = (phone, name) => {
    let pid = makeID();
    // create user with fake.js
    let user = {
            "cell_phone_number": phone,
            "name": name,
            "balance_amount": 0,
            "pid": pid,
            // "addresses": {},
            // "creditCard": {}
        };
    let payment = {
            "pid": pid,
            "type": "Balance"
        };
    return {
        user: G.insertcustomers(user),
        payment: G.insertpaymentMethods(payment),
        userObj: user
    };
};





// ==================================
function getStr(str) {
    if (!str) return "NULL";
    str = str.replace(/'/g, "#");
    return `'${str.replace(/#/g, "''")}'`;
}



G.insertdeliveryStaffs = function (ds) {
    return `INSERT INTO deliveryStaffs VALUES(${ds.cell_phone_number}, ${getStr(ds.name)}, '${ds.borough}');\n`;
};


G.insertaddresses = function(ds) {
    return `INSERT INTO addresses VALUES('${ds.aid}', '${ds.zip_code}', ${getStr(ds.formatted_address)}, '${ds.borough}');\n`;
};



G.insertcategories = function(ds) {
    return `INSERT INTO categories VALUES('${ds.cid}', ${getStr(ds.style)}, ${getStr(ds.country)}, ${getStr(ds.taste)});\n`;
};


G.insertpaymentMethods = function(ds) {
    return `INSERT INTO paymentMethods VALUES('${ds.pid}');\n`;
};


G.insertcustomers = function(ds) {
    return `INSERT INTO customers VALUES('${ds.cell_phone_number}', ${getStr(ds.name)}, ${ds.balance_amount}, '${ds.pid}');\n`;
};


G.insertcreditCards = function(ds) {
    return `INSERT INTO creditCards VALUES('${ds.pid}', '${ds.card_number}', '${ds.expiry_date}', ${getStr(ds.holder_name)});\n`;
};



G.insertrestaurants =function(ds) {
    return `INSERT INTO restaurants VALUES('${ds.license_id}', '${ds.aid}', ${getStr(ds.name)}, '${ds.opening_hours}', '${ds.closing_hours}', '${ds.contact_number}');\n`;
};


G.insertdishes = function(ds) {
    return `INSERT INTO dishes VALUES('${ds.license_id}', '${ds.name}', ${getStr(ds.description)}, '${ds.price}', '${ds.type}');\n`;
};


G.insertorders = function(ds) {
    return `INSERT INTO orders VALUES('${ds.oid}', '${ds.status}', '${ds.pid}', '${ds.cell_phone_number}', '${ds.aid}');\n`;
};




G.insertregisters =function(ds) {
    return `INSERT INTO registers VALUES('${ds.pid}', '${ds.cell_phone_number}');\n`;
};


G.insertdeliveredBy = function(ds) {
    return `INSERT INTO deliveredBy VALUES('${ds.oid}', '${ds.cell_phone_number}');\n`;
};



G.insertsaves = function(ds) {
    return `INSERT INTO saves VALUES('${ds.cell_phone_number}', '${ds.aid}');\n`;
};

G.insertcategorizedAs = function(ds) {
    return `INSERT INTO categorizedAs VALUES('${ds.cid}', '${ds.license_id}');\n`;
};




G.insertreviews = function(ds) {
    return `INSERT INTO reviews VALUES('${ds.oid}', '${ds.license_id}', ${ds.rating}, '${ds.comment}');\n`;
};



G.insertcontains = function(ds) {
    return `INSERT INTO contains VALUES('${ds.oid}', '${ds.license_id}', '${ds.name}', ${ds.quantity});\n`;
};

