import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";
import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";
import {GROUP_ID} from "../../modules/consts.js";

export class MainPage {

    constructor(parent) {
        this.parent = parent;
        this.maindata = [];
        this.philterdata = [];
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
    
   
    
    filterData(data, filters) {
        return data.filter(member => {
            // Фильтр по городу
            if (filters.city && member.city?.id !== filters.city) {
                return false;
            }
            
            // Фильтр по полу
            if (filters.sex && member.sex !== filters.sex) {
                return false;
            }
            
            // Фильтр по дате рождения
            if (filters.bdate) {
                if (!member.bdate) return false;
                
                const [day, month, year] = member.bdate.split('.');
                const birthDate = new Date(year || 2000, month - 1, day); // Если год не указан, считаем 2000
                
                if (filters.bdate.min && birthDate < new Date(filters.bdate.min)) {
                    return false;
                }
                
                if (filters.bdate.max && birthDate > new Date(filters.bdate.max)) {
                    return false;
                }
            }
            
            // Фильтр по последней активности
            if (filters.lastSeen) {
                if (!member.last_seen?.time) return false;
                
                const lastSeenTime = member.last_seen.time * 1000; // Переводим в мс
                const now = Date.now();
                const diffHours = (now - lastSeenTime) / (1000 * 60 * 60);
                
                if (filters.lastSeen === '1h' && diffHours > 1) {
                    return false;
                }
                
                if (filters.lastSeen === '24h' && diffHours > 24) {
                    return false;
                }
                
                if (filters.lastSeen === 'recently' && diffHours > 24 * 7) {
                    return false;
                }
            }
            
            return true;
        });
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
    
    setupEventListeners(){

        const collapseButton = this.pageRoot.querySelector('.collapse-button');
        const content = this.pageRoot.querySelector('.change-section-content');
        
        content.style.display = "none";
        collapseButton.textContent = "▶";
        
        collapseButton.addEventListener('click', () => {
            if (content.style.display === "none") {
                content.style.display = "block";
                collapseButton.textContent = "🔽";
            } else {
                content.style.display = "none";
                collapseButton.textContent = "▶";
            }
        });
        
        
        const filterButton = this.pageRoot.querySelector('#filter-button');
        filterButton.addEventListener('click', this.filterData.bind(this));

        // const sbrosButton = this.pageRoot.querySelector('#sbros-button');
        // sbrosButton.addEventListener('click', ()=>{this.response ='http://localhost:8000/data/get'; this.render(); });
        document.querySelectorAll('.sex-button, .activity-button').forEach(button => {
            button.addEventListener('click', function() {
                // Удаляем активный класс у всех кнопок в группе
                this.parentNode.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('active');
                });
                // Добавляем активный класс только к нажатой кнопке
                this.classList.add('active');
            });
        });
        
        document.getElementById('filter-button').addEventListener('click', function() {
            const activeSex = document.querySelector('.sex-button.active').dataset.value;
            const activeActivity = document.querySelector('.activity-button.active').dataset.value;
            
            console.log('Выбран пол:', activeSex);
            console.log('Выбрана активность:', activeActivity);
            // Здесь можно добавить логику фильтрации
        });
        
        document.getElementById('sbros-button').addEventListener('click', function() {
            // Сброс всех фильтров
            document.querySelectorAll('.button-group button').forEach(btn => {
                btn.classList.remove('active');
            });
            // Активируем первые кнопки в каждой группе по умолчанию
            document.querySelectorAll('.button-group button:first-child').forEach(btn => {
                btn.classList.add('active');
            });
            // Очищаем текстовые поля
            document.querySelectorAll('input[type="text"]').forEach(input => {
                input.value = '';
            });
        });
    }
    async render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        const cardsContainer = document.getElementById('cards-container');
        const data = await this.getData();
        
        if(this.maindata.length === 0){ 
            this.maindata = data
            this.philterdata = data
        }
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
        
        this.setupEventListeners();
        
    }
    
    getFirstTwoSentences(text) {
        if (!text) return '';
        const sentences = text.split(/(?<=[.!?])\s+/);
        return sentences.slice(0, 2).join(' '); 
    }
}