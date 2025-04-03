const express = require('express');
const cors = require('cors');
const path = require('path');

const stocks = require('./internal/data');


const app = express();
app.use(cors());

const host = 'localhost';
const port = 8000;

app.use(express.json());

app.use('/data', stocks);

app.use(express.static(path.join(__dirname)));
console.log(path.join(__dirname));

app.listen(port, host, () => {
    console.log(`Сервер запущен по адресу http://${host}:${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


//Query selector обновление 