const Router = require('express-promise-router');

const DB = require('./Database');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

router.get('/fsdf/:id', async (req, res) => {
    const { id } = req.params;
    let rows = await DB.query('select * from restaurants', [], (data) => {
        console.log(data[0]);
    }, 10);
    res.send(rows[0]);
});


router.get('/user/:number', async (req, res) =>{
    const {number} = req.params;
    let rows = await DB.option(DB.queryOption.userLogin, [number]);
    res.send(rows[0]);
});

router.post('/user/', async (req, res) =>{
    let {name, cell_phone_number} = req.body;
    let user = await DB.registersUser(cell_phone_number, name);
    res.send(user);
});

module.exports = (app) => {
    app.use('/', router);
};