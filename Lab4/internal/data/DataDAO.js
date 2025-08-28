const { title } = require('process');
const {DataRepository} = require('./DataRepository');

class DataDAO {
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
            
            throw new Error('invalidate id (Сам ты Лёва, инвалид!)');
        }
    }

    static _validate(card) {
        if (
            card.id === undefined ||
            card.date=== undefined ||
            card.explanation === undefined ||
            card.title === undefined ||
            card.url === undefined
        ) {
            throw new Error('invalidate stock data (Сам ты Лёва, инвалид)');
        }

        this._validateId(card.id);
    }

    static find() {
        const cards = DataRepository.read();

        return cards.map(({id, date,  explanation, title, url}) => {
            return new this(id,date, explanation, title, url);
        });
    }

    static findById(id) {
        this._validateId(id);
        const cards = DataRepository.read();
        const card = cards.find((s) => s.id == id);
        return new this(card.id, card.date, card.explanation, card.title, card.url);
    }

    static insert(card) {
        this._validate(card);

        const cards = DataRepository.read();
        DataRepository.write([...cards, card]);

        return new this(card.id, card.date, card.explanation, card.title, card.url);
    }

    static delete(id) {
        this._validateId(id);
        const cards = DataRepository.read();
        const filteredCards = cards.filter((s) => s.id != id);

        DataRepository.write(filteredCards);

        return filteredCards.map(({id, date, explanation, title, url}) => {
            return new this(id, date, explanation, title, url);
        });
    }

    static patch(id, changes) {
        const cards = DataRepository.read();
        
        const cardIndex = cards.findIndex(c => c.id == id);
        if (cardIndex === -1) {
            throw new Error('Card not found');
        }
        
        const updatedCard = {
            ...cards[cardIndex],
            ...changes,
            id: cards[cardIndex].id 
        };
        
        cards[cardIndex] = updatedCard;
        DataRepository.write(cards);
        
        return new this(updatedCard.id, updatedCard.date, updatedCard.explanation, updatedCard.title, updatedCard.url);
    }
    
    static filter(conditions) {
        const cards = DataRepository.read();
        return cards.filter(card => {
            // Фильтрация по ID
            if (conditions.id && card.id !== conditions.id) return false;
            
            // Фильтрация по дате (после указанной даты)
            if (conditions.date_after && new Date(card.date) < new Date(conditions.date_after)) return false;
            
            // Фильтрация по заголовку (содержит подстроку)
            if (conditions.title_like && !card.title.includes(conditions.title_like)) return false;
            
            // Фильтрация по длине объяснения
            if (conditions.explanation_length && card.explanation.length < parseInt(conditions.explanation_length)) return false;
            
            // Фильтрация по длине URL
            if (conditions.url_length && card.url.length < parseInt(conditions.url_length)) return false;
            
            return true;
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
    DataDAO,
}