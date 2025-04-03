const {DataDAO} = require('./DataDAO');

class DataService {
    static findCards(id) {
        if (id !== undefined) {
           
            return DataDAO.findById(id).toJSON();
        }

        return DataDAO.find().map((card) => card.toJSON());
    }

    static addCard(card) {
        return DataDAO.insert(card).toJSON();
    }

    static deleteCard(id) {
        return DataDAO.delete(id).map((card) => card.toJSON());
    }

    static patchCard(id, changes){
        return DataDAO.patch(id, changes).toJSON();
    }
}

module.exports = {
    DataService,
}