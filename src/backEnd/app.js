/**
 * Created by emol on 3/18/18.
 */
const express = require('express');
const bodyParser = require('body-parser');
const mountRoutes = require('./router');
const app = express();
const DB = require('./Database');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mountRoutes(app);



// shut down
process.on('SIGINT', function() {
        DB.end()
            .then(() => {
                console.log( "\napplication has shut down." );
                process.exit(1);
            })
            .catch(err => {
                console.error('error during disconnection', err.stack);
                process.exit(1);
            });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));