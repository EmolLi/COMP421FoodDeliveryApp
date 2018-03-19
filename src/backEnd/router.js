const Router = require('express-promise-router');

const DB = require('./Database');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    let rows = await DB.query('select * from restaurants', [], (data) => {
        console.log(data[0]);
    }, 10);
    res.send(rows[0]);
});


module.exports = (app) => {
    app.use('/', router);
};