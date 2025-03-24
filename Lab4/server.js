const express = require('express');

const app = express(); // 1

const HOST = 'localhost';
const PORT = 8000;

const handler = (req, res) => {
    res.writeHead(200);
    res.end('ПСП такой крутой!');
};

app.get('/music', (req, res) => {
    res.end('Я слушаю только Motorhead!');
});

app.get('/course', (req, res) => {
    res.json({ course: 'ПСП' });
});

const readJson = (fileName) => {
    const file = fs.readFileSync(path.join(__dirname, fileName), "utf8");
    const json = JSON.parse(file);

    return json;
};

const STORAGE_NAME = 'stocks.json';

app.get('/stocks', (req, res) => {
    const stocks = readJson(STORAGE_NAME);
    res.send(stocks);
});
app.get('/stocks/:id', (req, res) => {
    const id = req.params.id; // 1
    
    const numberId = Number.parseInt(id);
    if (Number.isNaN(numberId)) { // 2
        res.status(400).send({status: 'Bad Request', message: 'id must be number!'});
    }

    const stocks = readJson(storageName);
    const stock = stocks.find((value) => { // 3
        return value.id === numberId;
    });

    if (stock) { // 4
        res.send(stock);
    } else {
        res.status(404).send({status: 'Not Found', message: `not found stock with id ${numberId}`});
    }
});

app.listen(PORT, HOST, () => { // 3
    console.log(`Сервер запущен по адресу http://${HOST}:${PORT}`);
});