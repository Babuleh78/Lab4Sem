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
    
    setupEventListeners() {
        // Обработчик для кнопки сворачивания/разворачивания
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

        const sbrosButton = this.pageRoot.querySelector('#sbros-button');
        sbrosButton.addEventListener('click', ()=>{this.response ='http://localhost:8000/data/get'; this.render(); });
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
    
    
    async render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        const cardsContainer = document.getElementById('cards-container');
        const data = await this.getData();
       
        if (data) {

            // Форматирование времени последнего визита
        function formatLastSeen(lastSeen) {
            const now = new Date();
            const lastSeenDate = new Date(lastSeen.time * 1000);
            const diffMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
            
            if (diffMinutes < 1) return "Только что";
            if (diffMinutes < 60) return `${diffMinutes} мин. назад`;
            if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} ч. назад`;
            return lastSeenDate.toLocaleDateString();
        }

        // Текст для семейного положения
        function getRelationText(relation) {
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
        function formatEducation(education) {
            return {
                university: education.university_name ?? null,
                faculty: education.faculty_name ?? null,
                graduation: education.graduation ?? null
            };
        }

        // Форматирование информации о карьере
        function formatCareer(career) {
            return career.map(job => ({
                company: job.company ?? "Не указано",
                position: job.position ?? "Не указана",
                from: job.from ?? null,
                to: job.to ?? null
            }));
        }

        // Форматирование информации о родственниках
        function formatRelatives(relatives) {
            return relatives.map(rel => ({
                type: rel.type === 'child' ? 'Ребенок' : 'Родитель',
                name: rel.name ?? "Не указано",
                id: rel.id ? `vk.com/id${rel.id}` : null
            }));
        }

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
                    last_seen: item.last_seen ? formatLastSeen(item.last_seen) : "Недавно",
                    status: item.status ?? "Статус не установлен",
                    
                    // Социальные связи
                    relation: item.relation ? getRelationText(item.relation) : "Не указано",
                    relatives: item.relatives ? formatRelatives(item.relatives) : [],
                    can_write_private_message: item.can_write_private_message ? "Да" : "Нет",
                    
                    // Образование и работа
                    education: item.education ? formatEducation(item.education) : null,
                    universities: item.universities ?? [],
                    schools: item.schools ?? [],
                    occupation: item.occupation ?? "Не указано",
                    career: item.career ? formatCareer(item.career) : [],
                    
                    // Интересы
                    activities: item.activities ?? null,
                    interests: item.interests ?? null,
                    music: item.music ?? null,
                    movies: item.movies ?? null,
                    tv: item.tv ?? null,
                    books: item.books ?? null,
                    games: item.games ?? null,
                    about: item.about ?? null,
                    
                    // Контакты
                    contacts: {
                        mobile_phone: item.mobile_phone ?? null,
                        home_phone: item.home_phone ?? null,
                        site: item.site ?? null,
                        skype: item.skype ?? null,
                        facebook: item.facebook ?? null,
                        twitter: item.twitter ?? null,
                        instagram: item.instagram ?? null
                    },
                    
                    // Счетчики
                    counters: item.counters ?? {
                        friends: 0,
                        photos: 0,
                        videos: 0,
                        followers: 0
                    }
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