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







DB.getHistoryOrders = (phone) => {
    return new Promise( (resolve, reject) => pool.connect()
        .then(client => {
            let cursor = client.query(new Cursor(`SELECT o.oid, o.status, o.cell_phone_number, o.aid, c.license_id, c.name, c.quantity, d.price
FROM orders o, contains c, dishes d
WHERE o.oid = c.oid AND o.cell_phone_number = $1
AND d.license_id = c.license_id AND d.name = c.name`, [phone]));
            cursor.read(10, function (err, rows) {
                if (err) {
                    resolve(done(cursor, client, err));
                }
                if (!rows.length) {
                    resolve(done(cursor, client));
                }

                done(cursor, null);

                let orders = {};
                rows.forEach(i => {
                    if (orders[i.oid]){
                        orders[i.oid].dishes[i.name] = {
                            dishName: i.name,
                            quantity:  i.quantity,
                            price: i.price
                        };
                    }
                    else{
                        orders[i.oid] = {
                            restaurant: i.license_id,
                            dishes: {
                                [i.name]: {
                                    dishName: i.name,
                                    quantity:  i.quantity,
                                    price: i.price
                                }
                            }
                        }
                    }
                });


                client.query(`
SELECT p.oid, p.total_price, rr.avg_rating, rr.review_cnt
FROM (
    SELECT license_id, COUNT(*) review_cnt, AVG(rating) avg_rating
    FROM reviews
    GROUP BY license_id
)rr RIGHT JOIN (
SELECT o.oid, SUM(d.price * c.quantity) total_price
FROM orders o, contains c, dishes d
WHERE o.oid = c.oid AND o.cell_phone_number = $1
AND d.license_id = c.license_id AND d.name = c.name
GROUP BY o.oid) p
ON exists (SELECT * FROM contains c1 WHERE c1.oid = p.oid AND c1.license_id = rr.license_id);`, [phone])
                    .then((result, err)=>{
                        if (err){
                            done(null, client, err);
                            reject(err);
                        }
                        console.log(result);
                        result.rows.forEach(r => {
                            orders[r.oid].totalPrice = r.total_price;
                            orders[r.oid].avgRating = r.avg_rating;
                            orders[r.oid].reviewCnt = r.review_cnt;
                        });
                        done(null, client, err);
                        resolve(orders);
                    });
            })
        })
        .catch(err => {
            done(null, client, err);
            reject(err);
        }))
};




DB.updateReview = (oid, license_id, rating, comment) => {
    return new Promise( (resolve, reject) => pool.connect()
        .then(client => {
            client.query(`UPDATE reviews
SET rating = $1, comment = $2
WHERE oid = $3`, [rating, comment, oid])
                .then((result, err) => {
                    if (err) {
                        done(null, client, err);
                        resolve(err);
                    }
                    client.query(`INSERT INTO reviews (oid, license_id, rating, comment)
       SELECT $1, $2, $3, $4
       WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE oid = $1)`, [oid, license_id, rating, comment])
                        .then((result, err) => {
                            if (err) {
                                done(null, client, err);
                                resolve(err);
                            }
                            client.query(`
    SELECT license_id, COUNT(*) reviewCnt, AVG(rating) avgRating
    FROM reviews
    WHERE license_id = $1
    GROUP BY license_id;`, [license_id])
                                .then((result, err) => {
                                    done(null, client);
                                    resolve(result.rows[0]);
                                })
                        })
                })
                .catch(err =>{
                console.log("err");
                resolve(err);
            })
            }));
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
    if (cursor) cursor.close(()=>{
        if (client) client.release();
    });
    else if (client) client.release();
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


