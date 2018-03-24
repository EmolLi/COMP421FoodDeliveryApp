const Router = require('express-promise-router');

const DB = require('./Database');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();



router.get('/user/:number', async (req, res) =>{
    const {number} = req.params;
    let user = await DB.userLogin(number);
    res.send(user);
});
/*
router.post('/user/', async (req, res) =>{
    let {name, cell_phone_number} = req.body;
    let user = await DB.registersUser(cell_phone_number, name);
    res.send(user);
});
*/

router.post('/user/addBalance', async (req, res) => {
    let {cell_phone_number, balance_add_amount} = req.body;
    let newAmount = await DB.addBalance(cell_phone_number, balance_add_amount);
    res.send(newAmount);
});



router.get('/restaurants', async (req, res) => {
    let row = await DB.searchRestaurants();
    res.send(Object.values(row));
});


router.get('/orders/:phone', async (req, res) => {
    let order = await DB.getHistoryOrders(req.params.phone);
    res.send(order);
});

router.post('/orders/review', async (req, res) => {
    let { oid, license_id, rating, comment} = req.body;
    let newRating = await DB.updateReview(oid, license_id, rating, comment);
    res.send(newRating);
});



router.get('/restaurants/:license_id', async (req, res) =>{
    let { license_id } =  req.params;
    let dishes = await DB.getDishes(license_id);
    res.send(dishes);
});

module.exports = (app) => {
    app.use('/', router);
};