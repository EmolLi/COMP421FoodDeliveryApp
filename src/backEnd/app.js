/**
 * Created by emol on 3/18/18.
 */
const express = require('express');
const mountRoutes = require('./router');
const app = express();
mountRoutes(app);
const DB = require('./Database');



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