const { error } = require('console');
const {DBConnector} = require('../../modules/DBConnector');

class DataRepository {
    static db = new DBConnector('..\\..\\Lab5\\data.json');

    static read() {
        try{
            const file = this.db.readFile();
            return JSON.parse(file);
        } catch{
            this.db = new DBConnector('..\\..\\Lab5\\data.json');
            const file = this.db.readFile();
            return JSON.parse(file);
        }
    }

    static write(json) {
        this.db.writeFile(JSON.stringify(json));
    }
}

module.exports = {
    DataRepository,
}