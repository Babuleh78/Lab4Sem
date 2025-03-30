const {StocksRepository} = require('./StocksRepository');

class StockDAO {
    constructor(id, date, explanation, title, url) {
        this.id = id;
        this.date = date;
        this.explanation = explanation;
        this.title = title;
        this.url = url;
    }

    static _validateId(id) {

        const numberId = Number.parseInt(id);

        if (Number.isNaN(numberId)) {
            
            throw new Error('invalidate id (Сам ты Лёва, инвалид)');
        }
    }

    static _validate(stock) {
        if (
            stock.id === undefined ||
            stock.date=== undefined ||
            stock.explanation === undefined ||
            stock.title === undefined ||
            stock.url === undefined
        ) {
            throw new Error('invalidate stock data');
        }

        this._validateId(stock.id);
    }

    static find() {
        const stocks = StocksRepository.read();

        return stocks.map(({id, date,  explanation, title, url}) => {
            return new this(id,date, explanation, title, url);
        });
    }

    static findById(id) {
        this._validateId(id);
        const stocks = StocksRepository.read();
        const stock = stocks.find((s) => s.id == id);
        return new this(stock.id, stock.date, stock.explanation, stock.title, stock.url);
    }

    static insert(stock) {
        this._validate(stock);

        const stocks = StocksRepository.read();
        StocksRepository.write([...stocks, stock]);

        return new this(stock.id, stock.date, stock.explanation, stock.title, stock.url);
    }

    static delete(id) {
        this._validateId(id);
        const stocks = StocksRepository.read();
        const filteredStocks = stocks.filter((s) => s.id != id);

        StocksRepository.write(filteredStocks);

        return filteredStocks.map(({id, date, explanation, title, url}) => {
            return new this(id, date, explanation, title, url);
        });
    }

    toJSON() {
        return {
            id: this.id,
            date: this.date,
            explanation: this.explanation,
            title: this.title,
            url: this.url
        }
    }
}

module.exports = {
    StockDAO,
}