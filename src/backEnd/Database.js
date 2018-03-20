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
        return new Promise( (resolve) => pool.connect()
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
            }))
    };


DB.option = (opt, params, callback, dataLimit) =>{
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



function done(cursor, client, err) {
    client.release();
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
    userRegister: 'userRegister'
};

const queryOptionStr = {
    userLogin: 'SELECT * FROM customers WHERE cell_phone_number = $1',
    userRegister: ''
};