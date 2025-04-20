import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";
import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";
import {GROUP_ID} from "../../modules/consts.js";

export class MainPage {

    response = 'http://localhost:8000/data/get'
    constructor(parent) {
        this.parent = parent;
    }
    
    get pageRoot() {
        return document.getElementById('main-page');
    }
    
    getHTML() {
        return `
        <div id="main-page" class="container-fluid p-4">
         <section class="filters-overlay">
            <h2> Фильтры <button class="collapse-button">▼</button></h2>
            <div class="change-section-content">
                <input type="text" id="filter-city" placeholder="Город">
                <input type="text" id="filter-date" placeholder="Дата рождения">
                
                <div class="filter-group">
                    <label>Пол:</label>
                    <div class="button-group">
                        <button class="sex-button active" data-value="м">М</button>
                        <button class="sex-button" data-value="ж">Ж</button>
                        <button class="sex-button" data-value="не указан">Не указан</button>
                    </div>
                </div>
                
                <div class="filter-group">
                    <label>Последняя активность:</label>
                    <div class="button-group">
                        <button class="activity-button active" data-value="1h">Менее часа назад</button>
                        <button class="activity-button" data-value="24h">Менее суток назад</button>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button id="filter-button">Применить</button>
                    <button id="sbros-button">Сброс</button>
                </div>
            </div>
        </section>

                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4" id="cards-container">
                    
                </div>

            
        </div>
        `;
    }
    
    async getData() {
        try {
            
            const apiResponse = await ajax.post(urls.getGroupMembers(GROUP_ID));
            
            const memberIds = apiResponse.response.items.slice(0, 20);
            const usersInfo = await ajax.post(urls.getUltimate(memberIds));
            
            return usersInfo.response;
            
        } catch (error) {
            console.error('Лошара:', error);
            return [];
        }
    }
    
    clickCard(item, e) {
        const cardId = e.target.dataset.id;
        const productPage = new ProductPage(this.parent, cardId);
        productPage.render(item);
    }
    
   
    
    filterData() {

        
        const id_cond = document.getElementById('filter-id').value;
        const date_cond = document.getElementById('filter-date').value;
        const title_cond = document.getElementById('filter-title').value;
        const explanation_cond = document.getElementById('filter-explanation').value;
        const url_cond = document.getElementById('filter-url').value;

        const queryParams = new URLSearchParams();

        if (id_cond) queryParams.append('id', id_cond);
        if (date_cond) queryParams.append('date_after', date_cond);
        if (title_cond) queryParams.append('title_like', title_cond);
        if (explanation_cond) queryParams.append('explanation_length', explanation_cond);
        if (url_cond) queryParams.append('url_length', url_cond);
   
        this.response = 'http://localhost:8000/data/filter?';
        this.response+=queryParams.toString();
       
        this.render();
    }
    
    formatLastSeen(lastSeen) {
        const now = new Date();
        const lastSeenDate = new Date(lastSeen.time * 1000);
        const diffMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
        
        if (diffMinutes < 1) return "Только что";
        if (diffMinutes < 60) return `${diffMinutes} мин. назад`;
        if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} ч. назад`;
        return lastSeenDate.toLocaleDateString();
    }

    // Текст для семейного положения
    getRelationText(relation) {
        const relations = {
            1: 'Не женат/Не замужем',
            2: 'Есть друг/Есть подруга',
            3: 'Помолвлен/Помолвлена',
            4: 'Женат/Замужем',
            5: 'Всё сложно',
            6: 'В активном поиске',
            7: 'Влюблён/Влюблена',
            8: 'В гражданском браке'
        };
        return relations[relation] || 'Не указано';
    }

    // Форматирование информации об образовании
    formatEducation(education) {
        return {
            university: education.university_name ?? null,
            faculty: education.faculty_name ?? null,
            graduation: education.graduation ?? null
        };
    }

    // Форматирование информации о карьере
    formatCareer(career) {
        return career.map(job => ({
            company: job.company ?? "Не указано",
            position: job.position ?? "Не указана",
            from: job.from ?? null,
            to: job.to ?? null
        }));
    }

    // Форматирование информации о родственниках
    formatRelatives(relatives) {
        return relatives.map(rel => ({
            type: rel.type === 'child' ? 'Ребенок' : 'Родитель',
            name: rel.name ?? "Не указано",
            id: rel.id ? `vk.com/id${rel.id}` : null
        }));
    }
    
    async render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        const cardsContainer = document.getElementById('cards-container');
        const data = await this.getData();
        
        console.log(data[0]);

        if (data) {

            // Форматирование времени последнего визита
            

            data.forEach((item, index) => {
              
                const modifiedItem = {
                    // Основная информация
                    first_name: item.first_name ?? "Имя не указано",
                    last_name: item.last_name ?? "Фамилия не указана",
                    nickname: item.nickname ?? null,
                    maiden_name: item.maiden_name ?? null,
                    
                    // Фотографии (выбираем наилучшее доступное качество)
                    photo: item.photo_max_orig ?? item.photo_400 ?? item.photo_200 ?? "default_avatar.jpg",
                    
                    // Демографическая информация
                    sex: typeof item.sex === 'number' 
                        ? (item.sex === 2 ? "Мужской" : item.sex === 1 ? "Женский" : "Не указан") 
                        : "Не указан",
                    bdate: item.bdate ?? "Не указана",
                    city: item.city?.title ?? "Город не указан",
                    country: item.country?.title ?? "Страна не указана",
                    domain: item.domain ? `vk.com/${item.domain}` : null,
                    
                    // Активность
                    online: item.online ? "Онлайн" : "Оффлайн",
                    last_seen: item.last_seen ? this.formatLastSeen(item.last_seen) : "Недавно",
                    status: item.status ?? "Статус не установлен",
                    
                    // Социальные связи
                    relation: item.relation ? this.getRelationText(item.relation) : "Не указано",
                    relatives: item.relatives ? this.formatRelatives(item.relatives) : "Не указано",
                    can_write_private_message: item.can_write_private_message ? "Да" : "Нет",
                    
                    // Образование и работа
                    education: item.education ? this.formatEducation(item.education) : null,
                    universities: item.universities ?? [],
                    schools: item.schools ?? [],
                    occupation: item.occupation ?? "Не указано",
                    career: item.career ? this.formatCareer(item.career) : "Не указано",
                    
                    // Интересы
                    activities: item.activities ?? "Не укзаано",
                    interests: item.interests ??  "Не укзаано",
                    music: item.music ??  "Не укзаано",
                    movies: item.movies ??  "Не укзаано",
                    tv: item.tv ??  "Не укзаано",
                    books: item.books ??  "Не укзаано",
                    games: item.games ??  "Не укзаано",
                    about: item.about ??  "Не укзаано",
                    
                    // Контакты
                    contacts: {
                        mobile_phone: item.mobile_phone ??  "Не укзаано",
                        home_phone: item.home_phone ??  "Не укзаано",
                        site: item.site ??  "Не укзаано",
                        skype: item.skype ??  "Не укзаано",
                        facebook: item.facebook ??  "Не укзаано",
                        twitter: item.twitter ??  "Не укзаано",
                        instagram: item.instagram ??  "Не укзаано"
                    },
                    
                    
                };
                
                
                const productCard = new ProductCardComponent(cardsContainer);
                productCard.render(modifiedItem, index, this.clickCard.bind(this, modifiedItem));
              
            });
        } else{
            console.log("NO DATA");
        }
        
        
    }
    
    getFirstTwoSentences(text) {
        if (!text) return '';
        const sentences = text.split(/(?<=[.!?])\s+/);
        return sentences.slice(0, 2).join(' '); 
    }
}