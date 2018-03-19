const Cursor = require('pg-cursor');
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

DB.query = (text,params, callback, dataLimit) => {
        return new Promise( (resolve) => pool.connect()
            .then(client => {
                let cursor = client.query(new Cursor(text, params));
                console.log('executed query', text, params);
                cursor.read(dataLimit, function (err, rows) {
                    if (err) {
                        client.release();
                        resolve(done(err));
                    }
                    if (!rows.length) {
                        client.release();
                        resolve(done());
                    }

                    client.release();
                    callback(rows);
                    resolve(rows);
                })
            }))
    };



function done(err) {
    if (err) console.log(err);
    console.log("No data.");
    return null;
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
