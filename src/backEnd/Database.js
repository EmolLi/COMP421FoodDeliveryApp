const Cursor = require('pg-cursor');
const DataGen = require('./DataGenerator');

const dbConfig = {
    host: 'comp421.cs.mcgill.ca',
    user: 'cs421g11',
    password: 'P@55wo2d',
    database: 'cs421',
    connectionTimeoutMillis: 1000
};

const { Pool } = require('pg');
const pool = new Pool(dbConfig);


module.exports = DB = {};
const _SQL = {};


pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});


function errorHandle(e){
    console.log("===============ERROR==================");
    console.log(e.message);
    console.log("======================================");
    return {error: e.message};
}

/*
_SQL.registersUser_checkIfPhoneAlreadyRegistered =
    'SELECT * FROM customers WHERE cell_phone_number = $1';

DB.registersUser = (phone, name) => {
    return (async() => {
        let res = await pool.query(_SQL.registersUser_checkIfPhoneAlreadyRegistered, [phone]);
        if (res.rows.length) throw new Error("Phone number already registered.");
        let SQLs = DataGen.makeUser(phone, name);
        res = await pool.query(SQLs.payment, []);
        res = await pool.query(SQLs.user, []);
        return SQLs.userObj;
    })().catch(e => {
        return errorHandle(e);
    });
};
*/




_SQL.searchRestaurants_getRestaurantInfo =
    `SELECT r.license_id, r.name, r.opening_hour, r.closing_hour, r.contact_number, 
            a.aid, a.zip_code, a.formatted_address, a.borough, 
            rr.avgRating, rr.reviewCnt
        FROM restaurants r, addresses a, (
            SELECT license_id, COUNT(*) reviewCnt, AVG(rating) avgRating
            FROM reviews
            GROUP BY license_id
        )rr
        WHERE r.aid = a.aid AND r.license_id = rr.license_id
        ORDER BY avgRating DESC`;
_SQL.searchRestaurants_categories =
    `SELECT ca.license_id, c.cid, c.style, c.country, c.taste
        FROM categorizedAs ca JOIN categories c
        ON ca.cid = c.cid`;


DB.searchRestaurants = () => {
    return (async() => {
        let res = await pool.query(_SQL.searchRestaurants_getRestaurantInfo, []);
        let cat = await pool.query(_SQL.searchRestaurants_categories, []);

        if (!res.rows.length) throw new Error("no restaurant found.");
        let restaurants = {};
        res.rows.forEach(r => {
            restaurants[r.license_id] = r;
            r.categories = {};
        });
        cat.rows.forEach(c =>{
            if (restaurants[c.license_id])
                restaurants[c.license_id]['categories'][c.cid] = c;
        });

        return restaurants;
    })().catch(e => {
        return errorHandle(e);
    });
};



_SQL.searchRestaurantsByName_getRestaurantInfo =
    `SELECT r.license_id, r.name, r.opening_hour, r.closing_hour, r.contact_number, 
            a.aid, a.zip_code, a.formatted_address, a.borough, 
            rr.avgRating, rr.reviewCnt
        FROM restaurants r, addresses a, (
            SELECT license_id, COUNT(*) reviewCnt, AVG(rating) avgRating
            FROM reviews
            GROUP BY license_id
        )rr
        WHERE r.aid = a.aid AND r.license_id = rr.license_id AND r.name = $1
        ORDER BY avgRating DESC`;
_SQL.searchRestaurantsByName_categories =
    `SELECT ca.license_id, c.cid, c.style, c.country, c.taste
        FROM categorizedAs ca JOIN categories c
        ON ca.cid = c.cid`;
DB.searchRestaurantsByName = (name) => {
    return (async() => {
        let res = await pool.query(_SQL.searchRestaurantsByName_getRestaurantInfo, [name]);
        let cat = await pool.query(_SQL.searchRestaurantsByName_categories, []);

        if (!res.rows.length) throw new Error("no restaurant found.");
        let restaurants = {};
        res.rows.forEach(r => {
            restaurants[r.license_id] = r;
            r.categories = {};
        });
        cat.rows.forEach(c =>{
            if (restaurants[c.license_id])
                restaurants[c.license_id]['categories'][c.cid] = c;
        });

        return restaurants;
    })().catch(e => {
        return errorHandle(e);
    });
};




_SQL.getOrders_getOrderDetail = `
        SELECT o.oid, o.status, o.cell_phone_number, o.aid, c.license_id, c.name, c.quantity, d.price
        FROM orders o, contains c, dishes d
        WHERE o.oid = c.oid AND o.cell_phone_number = $1
        AND d.license_id = c.license_id AND d.name = c.name`;

_SQL.getOrders_getOrderMeta = `
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
        ON exists (SELECT * FROM contains c1 WHERE c1.oid = p.oid AND c1.license_id = rr.license_id)`;



DB.getOrders = (phone) => {
    return (async() => {
        let res = await pool.query(_SQL.getOrders_getOrderDetail, [phone]);

        if (res.rows.length == 0) return {error: 'invalid phone number or no orders for this user.'};
        let orders = {};
        res.rows.forEach(i => {
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

        res = await pool.query(_SQL.getOrders_getOrderMeta, [phone]);
        res.rows.forEach(r => {
            orders[r.oid].totalPrice = r.total_price;
            orders[r.oid].avgRating = r.avg_rating;
            orders[r.oid].reviewCnt = r.review_cnt;
        });

        return orders;
    })().catch(e => {
        return errorHandle(e);
    });
};


_SQL.getCurrentOrders_getOrderDetail = `
        SELECT o.oid, o.status, o.cell_phone_number, o.aid, c.license_id, c.name, c.quantity, d.price
        FROM orders o, contains c, dishes d
        WHERE o.oid = c.oid AND o.cell_phone_number = $1
        AND d.license_id = c.license_id AND d.name = c.name AND (o.status = 'WaitingForDelivery' OR o.status = 'OnTheWay')`;

_SQL.getCurrentOrders_getOrderMeta = `
        SELECT p.oid, p.total_price, rr.avg_rating, rr.review_cnt
        FROM (
            SELECT license_id, COUNT(*) review_cnt, AVG(rating) avg_rating
            FROM reviews
            GROUP BY license_id
        )rr RIGHT JOIN (
        SELECT o.oid, SUM(d.price * c.quantity) total_price
        FROM orders o, contains c, dishes d
        WHERE o.oid = c.oid AND o.cell_phone_number = $1 
        AND (o.status = 'WaitingForDelivery' OR o.status = 'OnTheWay')
        AND d.license_id = c.license_id AND d.name = c.name
        GROUP BY o.oid) p
        ON exists (SELECT * FROM contains c1 WHERE c1.oid = p.oid AND c1.license_id = rr.license_id)`;

DB.getCurrentOrders =  (phone) => {
    return (async() => {/*
        let res = await pool.query(_SQL.getCurrentOrders_getOrderDetail, [phone]);

        if (res.rows.length == 0) return {error: 'invalid phone number or no orders for this user.'};
        let orders = {};
        res.rows.forEach(i => {
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
        });*/

        res = await pool.query(_SQL.getCurrentOrders_getOrderMeta, [phone]);
        return res;
        res.rows.forEach(r => {
            orders[r.oid].totalPrice = r.total_price;
            orders[r.oid].avgRating = r.avg_rating;
            orders[r.oid].reviewCnt = r.review_cnt;
        });

        return orders;
    })().catch(e => {
        return errorHandle(e);
    });
};



_SQL.updateReview_updateReview = `
        UPDATE reviews
        SET rating = $1, comment = $2
        WHERE oid = $3`;
_SQL.updateReview_newReview = `
        INSERT INTO reviews (oid, license_id, rating, comment)
        SELECT $1, $2, $3, $4
        WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE oid = $1)`;
_SQL.updateReview_newRestaurantRating = `
        SELECT license_id, COUNT(*) reviewCnt, AVG(rating) avgRating
        FROM reviews
        WHERE license_id = $1
        GROUP BY license_id
`;

DB.updateReview = (oid, license_id, rating, comment) => {
    return (async() => {
        let res = await pool.query(_SQL.updateReview_updateReview, [rating, comment, oid]);
        res = await pool.query(_SQL.updateReview_newReview,  [oid, license_id, rating, comment]);
        res = await pool.query(_SQL.updateReview_newRestaurantRating, [license_id]);
        return res.rows[0] ? res.rows[0]: {error : 'license_id invalid'};
    })().catch(e => {
        return errorHandle(e);
    });
};





_SQL.addBalance = `
        UPDATE customers    
        SET balance_amount = balance_amount + $1
        WHERE cell_phone_number = $2
        RETURNING balance_amount AS new_amount
`;
DB.addBalance = (phone, amount) =>{
    return (async() => {
        let res = await pool.query(_SQL.addBalance, [amount, phone]);
        return res.rows[0];
    })().catch(e => {
        return errorHandle(e);
    });
};




DB.end = () => {
    return new Promise((resolve) =>{
        pool.end()
            .then(()=>{
                console.log("DB has shut down.");
                resolve();
            })
            .catch(err => {
                throw new Error(err);
            });
    })

};


_SQL.getDishes =
        `SELECT name, description, price, type
        FROM dishes
        WHERE license_id = $1`;
DB.getDishes = (license_id) =>{
    return (async() => {
        let res = await pool.query(_SQL.getDishes, [license_id]);
        console.log(res.rows);
        return res.rows.length > 0 ? res.rows : {error: 'restaurant not found or has no dishes!'};
    })().catch(e => {
        return errorHandle(e);
    });
};


_SQL.userLogin =
        'SELECT * FROM customers WHERE cell_phone_number = $1';
DB.userLogin = (phone) =>{
    return (async() => {
        let res = await pool.query(_SQL.userLogin, [phone]);
        return res.rows[0] ? res.rows[0] : {error: 'User does not exist!'};
    })().catch(e => {
        return errorHandle(e);
    });
};

