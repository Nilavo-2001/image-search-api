const express = require('express');
const app = express();
const port = 3000;
app.use(express.urlencoded());
app.use(express.json());
app.use('/', require('./routes'));

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('server running on port :', port);
}) 