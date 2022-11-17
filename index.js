const express = require('express');
const app = express();
const router = require('./routers/router')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Simple API Gateway")
})

app.use(router)

app.listen(26799, 'localhost', () => {
    console.log("Simple API Gateway run on localhost:26799");
});
