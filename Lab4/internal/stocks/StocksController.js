const {StocksService} = require('./StocksService');

class StocksController {
    static findStocks(req, res) {
        try {
            res.send(StocksService.findStocks());
        } catch (err) {
            res.status(400).send({status: 'Bad Request', message: err.message})
        }
    }

    static findStockById(req, res) {
        try {
            const id = Number.parseInt(req.params.id);
            res.send(StocksService.findStocks(id))
        } catch (err) {
            res.status(400).send({status: 'Bad Request', message: err.message})
        }
    }

    static addStock(req, res) {
        try {
            res.send(StocksService.addStock(req.body));
        } catch (err) {
            res.status(400).send({status: 'Bad Request', message: err.message})
        }
    }

    static deleteStock(req, res) {
        try {
            const id = Number.parseInt(req.params.id);
            res.send(StocksService.deleteStock(id));
            console.log(id)

        } catch (err) {
            res.status(400).send({status: 'Bad Request', message: err.message})
        }
    }

    static inc(req, res) {
        try {
            console.log(req)
            const id = Number.parseInt(req.params.id);
            StocksService.incStock(id)
            res.status(200)

        } catch (err) {
            res.status(400).send({status: 'Bad Request', message: err.message})
        }
    }
}

module.exports = {
    StocksController,
};