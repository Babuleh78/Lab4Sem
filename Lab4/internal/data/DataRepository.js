const {DBConnector} = require('../../modules/DBConnector');

class DataRepository {
    static db = new DBConnector('..\\..\\Lab3\\data.json');

    static read() {
        const file = this.db.readFile();
        return JSON.parse(file);
    }

    static write(json) {
        this.db.writeFile(JSON.stringify(json));
    }
}

module.exports = {
    DataRepository,
}