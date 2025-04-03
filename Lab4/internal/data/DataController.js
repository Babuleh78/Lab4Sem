const {DataService} = require('./DataService');

class DataController {
    static findData(req, res) {
        
        try {
            res.send(DataService.findCards());
        } catch (err) {
            res.status(400).send({status: 'Bad Request', message: err.message})
        }
    }

    static findDataById(req, res) {
        try {
            const id = Number.parseInt(req.params.id);
            res.send(DataService.findCards(id));
        } catch (err) {
            res.status(400).send({status: 'Bad Request', message: err.message + "SC"})
        }
    }

    static addData(req, res) {
        try {
            res.send(DataService.addCard(req.body));
        } catch (err) {
            res.status(400).send({status: 'Bad Request', message: err.message})
        }
    }

    static deleteData(req, res) {
        try {
            
            const id = Number.parseInt(req.params.id);
            res.send(DataService.deleteCard(id));
        } catch (err) {
            res.status(400).send({status: 'Bad Request', message: err.message})
        }
    }
}

module.exports = {
    DataController,
};