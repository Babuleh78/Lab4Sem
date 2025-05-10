import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";

import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";
import {ACCESS_TOKEN, GROUP_ID} from "../../modules/consts.js";

export class MainPage {

    constructor(parent) {
        this.parent = parent;
        this.maindata = [];
        this.currentFilters = {
            city: '',
            sex: null,
            bdate: '',
            lastSeen: null
        };
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
                        <button class="sex-button" data-value="м">М</button>
                        <button class="sex-button" data-value="ж">Ж</button>
                    </div>
                </div>
                
                <div class="filter-group">
                    <label>Последняя активность:</label>
                    <div class="button-group">
                        <button class="activity-button" data-value="1h">Менее часа назад</button>
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
    
    // async getData() {
    //     try {
            
    //         const apiResponse = await ajax.post(urls.getGroupMembers(GROUP_ID));
            
    //         const memberIds = apiResponse.response.items.slice(0, 20);
    //         const usersInfo = await ajax.post(urls.getUltimate(memberIds));
            
    //         return usersInfo.response;
            
    //     } catch (error) {
    //         console.error('Лошара:', error);
    //         return [];
    //     }
    // }

    
    // async getData() {
    //     try {
    
    //         const membersUrl = new URL('https://api.vk.com/method/groups.getMembers');
    //         membersUrl.searchParams.append('group_id', GROUP_ID);
    //         membersUrl.searchParams.append('access_token', ACCESS_TOKEN);
    //         membersUrl.searchParams.append('v', '5.131');
            
    //         const membersResponse = await fetch(membersUrl.toString(), { //axios boundle
    //             method: 'GET', 
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //                 'Accept': 'application/json'
    //             }
    //         });
    
    //         if (!membersResponse.ok) throw new Error('Ошибка сети');
    //         const membersData = await membersResponse.json();
            
    //         if (membersData.error) throw new Error(membersData.error.error_msg);
            
    //         const memberIds = membersData.response.items.slice(0, 20);
    
    //         const usersUrl = new URL('https://api.vk.com/method/users.get');

           
    //         usersUrl.searchParams.append('user_ids', memberIds.join(','));
    //         const USER_FIELDS = [
    //             'photo_200', 'photo_400', 'photo_max_orig',
    //             'first_name', 'last_name', 'nickname', 'maiden_name',
    //             'sex', 'bdate', 'city', 'country', 'domain',
    //             'online', 'last_seen', 'status',
    //             'relation', 'relatives', 'can_write_private_message',
    //             'education', 'universities', 'schools', 'occupation', 'career',
    //             'activities', 'interests', 'music', 'movies', 'tv', 'books', 'games', 'about',
    //             'counters', 'contacts', 'site', 'skype', 'facebook', 'twitter', 'instagram'
    //         ].join(',');
            
    //         usersUrl.searchParams.append('fields', USER_FIELDS);
    //         usersUrl.searchParams.append('access_token', ACCESS_TOKEN);
    //         usersUrl.searchParams.append('v', '5.131');
            
    //         const usersResponse = await fetch(usersUrl.toString(), {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //                 'Accept': 'application/json'
    //             }
    //         });
    
    //         if (!usersResponse.ok) throw new Error('Ошибка сети');
    //         const usersData = await usersResponse.json();
            
    //         if (usersData.error) throw new Error(usersData.error.error_msg);
    
    //         return usersData.response;
            
    //     } catch (error) {
    //         console.error('Ошибка при получении данных:', error);
    //         return [];
    //     }
    // }   

    async  getData() {
        try {
            const membersResponse = await axios.get('https://api.vk.com/method/groups.getMembers', {
                params: {
                    group_id: GROUP_ID,
                    access_token: ACCESS_TOKEN,
                    v: '5.131'
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });

            if (membersResponse.data.error) {
                throw new Error(membersResponse.data.error.error_msg);
            }

            const memberIds = membersResponse.data.response.items.slice(0, 20);

            const USER_FIELDS = [
                'photo_200', 'photo_400', 'photo_max_orig',
                'first_name', 'last_name', 'nickname', 'maiden_name',
                'sex', 'bdate', 'city', 'country', 'domain',
                'online', 'last_seen', 'status',
                'relation', 'relatives', 'can_write_private_message',
                'education', 'universities', 'schools', 'occupation', 'career',
                'activities', 'interests', 'music', 'movies', 'tv', 'books', 'games', 'about',
                'counters', 'contacts', 'site', 'skype', 'facebook', 'twitter', 'instagram'
            ].join(',');

            const usersResponse = await axios.get('https://api.vk.com/method/users.get', {
                params: {
                    user_ids: memberIds.join(','),
                    fields: USER_FIELDS,
                    access_token: ACCESS_TOKEN,
                    v: '5.131'
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });

            if (usersResponse.data.error) {
                throw new Error(usersResponse.data.error.error_msg);
            }

            return usersResponse.data.response;

        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return [];
        }
    }

    clickCard(item, e) {
        const cardId = e.target.dataset.id;
        const productPage = new ProductPage(this.parent, cardId);
        productPage.render(item);
    }
    
   
    
    filterData(data, filters) {

        console.log(filters);
        
        const result = data.filter(member => {
            // Фильтр по городу (текстовый ввод)
            
            if (filters.city && member.city?.title?.toLowerCase() !== filters.city.toLowerCase()) {
               
               
                return false;
            }
            
            // Фильтр по полу
            if (filters.sex) {
                let sexValue;
                if (filters.sex === 'м') sexValue = 2;
                else if (filters.sex === 'ж') sexValue = 1;
                else if (filters.sex === 'не указан') sexValue = 0;
                
                if (member.sex !== sexValue) return false;
            }
            
            // Фильтр по дате рождения
            if (filters.bdate) {
                if (!member.bdate) return false;
                    const [day, month, year] = member.bdate.split('.');
                    const birthDate = new Date(year || 2000, month - 1, day);
                    const filterDate = new Date(filters.bdate);
                    
                    // Сравниваем только год, если введен только год
                    if (filters.bdate.length === 4) {
                        if (year !== filters.bdate) return false;
                    } else {
                        if (birthDate > filterDate) return false;
                    }
                
            }
            
            

            // Фильтр по последней активности
            if (filters.lastSeen) {
                if (!member.last_seen?.time) return false;
                
                const lastSeenTime = member.last_seen.time * 1000;
                const now = Date.now();
                const diffHours = (now - lastSeenTime) / (1000 * 60 * 60);
                
                switch (filters.lastSeen) {
                    case '1h':
                        if (diffHours > 1) return false;
                        break;
                    case '24h':
                        if (diffHours > 24) return false;
                        break;
                    case 'recently':
                        if (diffHours > 24 * 7) return false;
                        break;
                }
            }
            
            return true;
        });

        if(result.length!=0){
            return result;
        }

        alert("Данных нет!");
        return this.philterdata;
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
    
    setupEventListeners() {
        const collapseButton = this.pageRoot.querySelector('.collapse-button');
        const content = this.pageRoot.querySelector('.change-section-content');
        
        content.style.display = "none";
        collapseButton.textContent = "▶️ ";
        
        collapseButton.addEventListener('click', () => {
            if (content.style.display === "none") {
                content.style.display = "block";
                collapseButton.textContent = "🔽";
            } else {
                content.style.display = "none";
                collapseButton.textContent = "▶️";
            }
        });
        
        // Обработчики для кнопок фильтрации
        document.getElementById('filter-button').addEventListener('click', () => {
            // Собираем параметры фильтрации
            const filters = {
                city: document.getElementById('filter-city').value,
                sex: document.querySelector('.sex-button.active')?.dataset.value,
                bdate: document.getElementById('filter-date').value,
                lastSeen: document.querySelector('.activity-button.active')?.dataset.value
            };

            this.currentFilters = {
                city: document.getElementById('filter-city').value,
                sex: document.querySelector('.sex-button.active')?.dataset.value,
                bdate: document.getElementById('filter-date').value,
                lastSeen: document.querySelector('.activity-button.active')?.dataset.value
            };
            // Фильтруем данные и обновляем отображение
            this.philterdata = this.filterData(this.maindata, filters);
            this.render();
        });
        
        // Обработчик кнопки сброса
        document.getElementById('sbros-button').addEventListener('click', () => {
            // Сброс всех фильтров
            this.philterdata = this.maindata;
            
            // Сброс UI элементов
            document.querySelectorAll('.button-group button').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('input[type="text"]').forEach(input => {
                input.value = '';
            });
            
            this.render();
        });
        
        // Обработчики для кнопок выбора с возможностью отжатия
        document.querySelectorAll('.sex-button, .activity-button').forEach(button => {
            button.addEventListener('click', function() {
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                } else {
                    this.parentNode.querySelectorAll('button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            });
        });
    }

    wellBeBackByMegadeth() {
        // Восстанавливаем текстовые поля
        document.getElementById('filter-city').value = this.currentFilters.city || '';
        document.getElementById('filter-date').value = this.currentFilters.bdate || '';
        
        // Восстанавливаем активные кнопки
        if (this.currentFilters.sex) {
            const sexButton = document.querySelector(`.sex-button[data-value="${this.currentFilters.sex}"]`);
            if (sexButton) {
                sexButton.classList.add('active');
            }
        }
        
        if (this.currentFilters.lastSeen) {
            const activityButton = document.querySelector(`.activity-button[data-value="${this.currentFilters.lastSeen}"]`);
            if (activityButton) {
                activityButton.classList.add('active');
            }
        }
    }
    async render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        const cardsContainer = document.getElementById('cards-container');
       
        
        if(this.maindata.length === 0){ 
            const data = await this.getData();
            this.maindata = data;
            this.philterdata = data;
            console.log("Используем VK API", Date.now());
        }

        if (this.philterdata.length!=0) {

            

            this.philterdata.forEach((item, index) => {
              
                const modifiedItem = {
                    // Основная информация
                    first_name: item.first_name ?? "Имя не указано",
                    last_name: item.last_name ?? "Фамилия не указана",
                    nickname: item.nickname ?? null,
                    maiden_name: item.maiden_name ?? null,
                    
                    // Фотографии (выбираем наилучшее доступное качество)
                    photo: item.photo_max_orig ?? item.photo_400 ?? item.photo_200,
                    
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
        this.wellBeBackByMegadeth();
        
    }
    
    getFirstTwoSentences(text) {
        if (!text) return '';
        const sentences = text.split(/(?<=[.!?])\s+/);
        return sentences.slice(0, 2).join(' '); 
    }
}