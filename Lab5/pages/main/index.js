import { UserCardComponent } from "../../components/user-card/index.js";
import { UserPage } from "../user/index.js";
import { UserEditPage } from "../user_edit/index.js";

import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";
import {ACCESS_TOKEN, GROUP_ID} from "../../modules/consts.js";

export class MainPage {

    constructor(parent) {
        this.parent = parent;
        this.maindata = [];
        this.filteredData = [];
        this.currentFilters = {
            city: '',
            sex: null,
            bdate: '',
            lastSeen: null
        };
        this.storageKey = 'vk_users_data';
        this.currentEditingIndex = null; 
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
                        <button id="refresh-data-button">Обновить данные</button>
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
    
    saveDataToStorage(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify({
                data: data,
                timestamp: Date.now(),
                expires: Date.now() + (24 * 60 * 60 * 1000) 
            }));
            console.log('Данные сохранены в localStorage');
        } catch (error) {
            console.error('Ошибка сохранения в localStorage:', error);
        }
    }
    
    getDataFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return null;
            
            const parsed = JSON.parse(stored);
            
            if (Date.now() > parsed.expires) {
                localStorage.removeItem(this.storageKey);
                return null;
            }
            
            console.log('Данные загружены из localStorage');
            return parsed.data;
            
        } catch (error) {
            console.error('Ошибка чтения из localStorage:', error);
            return null;
        }
    }

    async loadDataFromAPI() {
        try {
            console.log('Загрузка данных с VK API...');
            const apiResponse = await ajax.post(urls.getGroupMembers(GROUP_ID));
            const memberIds = apiResponse.response.items.slice(0, 20);
            const usersInfo = await ajax.post(urls.getUltimate(memberIds));
            
            this.saveDataToStorage(usersInfo.response);
            return usersInfo.response;
            
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            return [];
        }
    }
    
    async getData() {
        const storedData = this.getDataFromStorage();
        
        if (storedData) {
            return storedData;
        }
        
        return await this.loadDataFromAPI();
    }

   


    clickCard(item, e) {
        const cardId = e.target.dataset.id;
        const productPage = new UserPage(this.parent, cardId);
        productPage.render(item);
    }

    handleEdit(userData, index) {
        const editPage = new UserEditPage(this.parent, userData, index, this);
        editPage.render();
    }
    
     saveUserData(index, updatedData) {
        if (index === null || index === undefined) return;

        // Обновляем данные в основном массиве
        const originalData = this.maindata[index];
        
        this.maindata[index] = {
            ...originalData,
            first_name: updatedData.first_name,
            last_name: updatedData.last_name,
            city: { title: updatedData.city },
            bdate: updatedData.bdate,
            sex: updatedData.sex === 'Мужской' ? 2 : updatedData.sex === 'Женский' ? 1 : 0,
            status: updatedData.status,
            relation: this.getRelationKey(updatedData.relation),
            online: updatedData.online === 'Онлайн'
        };

        if (this.filteredData[index]) {
            const filteredIndex = this.filteredData.findIndex(item => 
                item.first_name === originalData.first_name && 
                item.last_name === originalData.last_name
            );
            
            if (filteredIndex !== -1) {
                this.filteredData[filteredIndex] = {
                    ...this.filteredData[filteredIndex],
                    ...updatedData
                };
            }
        }

        this.saveDataToStorage(this.maindata);

        console.log('Данные пользователя обновлены:', updatedData);
    }

    getRelationKey(relationText) {
        const relations = {
            'Не указано': 0,
            'Не женат/Не замужем': 1,
            'Есть друг/Есть подруга': 2,
            'Помолвлен/Помолвлена': 3,
            'Женат/Замужем': 4,
            'Всё сложно': 5,
            'В активном поиске': 6,
            'Влюблён/Влюблена': 7,
            'В гражданском браке': 8
        };
        return relations[relationText] || 0;
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

    loadSavedFilters() {
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
                    activities: item.activities ?? "Не указано",
                    interests: item.interests ??  "Не указано",
                    music: item.music ??  "Не указано",
                    movies: item.movies ??  "Не указано",
                    tv: item.tv ??  "Не указано",
                    books: item.books ??  "Не указано",
                    games: item.games ??  "Не указано",
                    about: item.about ??  "Не указано",
                    
                    // Контакты
                    contacts: {
                        mobile_phone: item.mobile_phone ??  "Не указано",
                        home_phone: item.home_phone ??  "Не указано",
                        site: item.site ??  "Не указано",
                        skype: item.skype ??  "Не указано",
                        facebook: item.facebook ??  "Не указано",
                        twitter: item.twitter ??  "Не указано",
                        instagram: item.instagram ??  "Не указано"
                    },
                    
                    
                };
                
                
                const userCard = new UserCardComponent(cardsContainer);
                userCard.render(modifiedItem, index, this.clickCard.bind(this, modifiedItem), this.handleEdit.bind(this, modifiedItem, index));
                
                
            });
        } else{
            console.log("NO DATA");
        }
        
        this.setupEventListeners();
        this.loadSavedFilters();
        
    }
    
    getFirstTwoSentences(text) {
        if (!text) return '';
        const sentences = text.split(/(?<=[.!?])\s+/);
        return sentences.slice(0, 2).join(' '); 
    }
    
}