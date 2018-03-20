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


router.post('/user/addBalance', async (req, res) => {
    let {cell_phone_number, balance_add_amount} = req.body;
    let newAmount = await DB.addBalance(cell_phone_number, balance_add_amount);
    res.send(newAmount);
});



router.get('/restaurants', async (req, res) => {
    let row = await DB.searchRestaurants();
    // let row = await DB.option(DB.queryOption.searchRestaurants, [], null, 10);
    res.send(row);
});


router.get('/orders/:phone', async (req, res) => {
    let order = await DB.getHistoryOrders(req.params.phone);
    res.send(order);
});


module.exports = (app) => {
    app.use('/', router);
};