const Cursor = require('pg-cursor');
const DataGen = require('./DataGenerator');

const dbConfig = {
    host: 'comp421.cs.mcgill.ca',
    user: 'cs421g11',
    password: 'P@55wo2d',
    database: 'cs421'
};

const { Pool } = require('pg');
const pool = new Pool(dbConfig);


module.exports = DB = {};


pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

DB.query = (text,params, callback = null, dataLimit = 1) => {
        return new Promise( (resolve, reject) => pool.connect()
            .then(client => {
                let cursor = client.query(new Cursor(text, params));
                console.log('executed query', text, params);
                cursor.read(dataLimit, function (err, rows) {
                    if (err) {
                        resolve(done(cursor, client, err));
                    }
                    if (!rows.length) {
                        resolve(done(cursor, client));
                    }

                    done(cursor, client);
                    if (callback) callback(rows);
                    resolve(rows);
                })
            })
            .catch(err => {
                done(null, client, err);
                reject(err);
            }))
    };


DB.option = (opt, params, callback, dataLimit) =>{
    console.log(opt);
    return DB.query(queryOptionStr[opt], params, callback, dataLimit);
};

DB.registersUser = (phone, name) =>{
    return new Promise((resolve, reject) => {
        console.log("Register user", phone, name);
        pool.connect()
            .then(client => {
                let cursor = client.query(new Cursor('SELECT * FROM customers WHERE cell_phone_number = $1', [phone]));
                cursor.read(1, function (err, rows) {
                    if (err) {
                        done(cursor, client, err);
                        reject(err);
                    }
                    if (rows.length) {
                        done(cursor, client, err);
                        reject("Phone number already registered.");
                    }

                    // phone number not registered, register new customer
                    // rollback is not required, we assume our pid is unique
                    let SQLs = DataGen.makeUser(phone, name);
                    client.query(SQLs.payment, [])
                        .then((result, err) => {
                            if (err) {
                                done(cursor, client, err);
                                reject(err);
                            }
                            client.query(SQLs.user, [])
                                .then((result, err) => {
                                    if (err) {
                                        done(cursor, client, err);
                                        reject(err);
                                    }
                                    resolve(SQLs.userObj);
                                });
                        });

                });
            });
    })
};




DB.searchRestaurants = () =>{
    return new Promise((resolve, reject) => {
        pool.connect()
            .then(client => {
                console.log("asdfadsfads");
                let cursor = client.query(
                    new Cursor(`SELECT r.license_id, r.name, r.opening_hour, r.closing_hour, r.contact_number, a.aid, a.zip_code, a.formatted_address, a.borough, rr.avgRating, rr.reviewCnt
FROM restaurants r, addresses a, (
    SELECT license_id, COUNT(*) reviewCnt, AVG(rating) avgRating
    FROM reviews
    GROUP BY license_id
)rr
WHERE r.aid = a.aid AND r.license_id = rr.license_id
ORDER BY avgRating DESC`, []));
                cursor.read(10, function (err, rows) {
                    console.log("sfasf");
                    if (err) {
                        done(cursor, client, err);
                        reject(err);
                    }
                    if (!rows.length) {
                        done(cursor, client);
                        reject("No restaurant found.");
                    }
                    // resolve(rows);


                    // convert format
                    done(cursor, null);
                    let restaurants = {};
                    rows.forEach(r => {
                        restaurants[r.license_id] = r;
                        r.categories = {};
                    });


                    client.query(`SELECT ca.license_id, c.cid, c.style, c.country, c.taste
FROM categorizedAs ca JOIN categories c
ON ca.cid = c.cid`, [])
                        .then((result, err) => {
                            if (err) {
                                console.log("sdfsfeerr");
                                done(null, client, err);
                                reject(err);
                            }
                            result.rows.forEach(c =>{
                                if (restaurants[c.license_id])
                                    restaurants[c.license_id]['categories'][c.cid] = c;
                            });
                            console.log(restaurants);
                            done(null, client);
                            resolve(restaurants);
                        });

                });
            });
    })
};


DB.addBalance = (phone, amount) =>{
  return new Promise((resolve, reject) => {
      pool.query(`UPDATE customers
                 SET balance_amount = balance_amount + $1
                 WHERE cell_phone_number = $2
                 RETURNING balance_amount AS new_amount`, [amount, phone])
          .then((result, err) => {
            if (err) reject(err);
            resolve(result.rows[0]);
          })
  })
};




function done(cursor, client, err) {
    if (cursor) cursor.close();
    if (client) client.release();
    if (err) console.log(err);
    else console.log("No data.");
}

DB.end = () => {
    return new Promise((resolve) =>{
        pool.end()
            .then(()=>{
                console.log("DB has shut down.");
                resolve();
            });
    })

};



// ============================== DB query Option =========================
DB.queryOption = {
    userLogin: 'userLogin',
    addBalance: 'addBalance',
    searchRestaurants: 'searchRestaurants'
};

const queryOptionStr = {
    userLogin: 'SELECT * FROM customers WHERE cell_phone_number = $1',
    addBalance: `UPDATE customers
                 SET balance_amount = balance_amount + $1
                 WHERE cell_phone_number = $2
                 RETURNING balance_amount`,
    searchRestaurants: 'SELECT * FROM restaurants '
};


