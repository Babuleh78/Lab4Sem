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
                <!-- Карточки будут вставляться сюда -->
            </div>
        </div>
        `;
    }
    
    async getData() {
        try {
            
            const apiResponse = await ajax.post(urls.getGroupMembers(GROUP_ID));
            
            const memberIds = apiResponse.response.items.slice(0, 20);
            const usersInfo = await ajax.post(urls.getUsersInfo(memberIds));
        
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
        // const collapseButton = this.pageRoot.querySelector('.collapse-button');
        // const content = this.pageRoot.querySelector('.change-section-content');
        
        // content.style.display = "none";
        // collapseButton.textContent = "▶";
        
        // collapseButton.addEventListener('click', () => {
        //     if (content.style.display === "none") {
        //         content.style.display = "block";
        //         collapseButton.textContent = "🔽";
        //     } else {
        //         content.style.display = "none";
        //         collapseButton.textContent = "▶";
        //     }
        // });
        
        
        // const filterButton = this.pageRoot.querySelector('#filter-button');
        // filterButton.addEventListener('click', this.filterData.bind(this));

        // const sbrosButton = this.pageRoot.querySelector('#sbros-button');
        // sbrosButton.addEventListener('click', ()=>{this.response ='http://localhost:8000/data/get'; this.render(); });
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

            function formatLastSeen(timestamp) {
                if (!timestamp || !timestamp.time) return "Недавно";
                
                const lastSeenDate = new Date(timestamp.time * 1000);
                const now = new Date();
                const diffInSeconds = Math.floor((now - lastSeenDate) / 1000);
                
                if (diffInSeconds < 60) return "Только что";
                if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин. назад`;
                if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч. назад`;
                
                return lastSeenDate.toLocaleDateString();
            }

            data.forEach((item, index) => {
              
                const modifiedItem = {
                    first_name: item.first_name ?? "Имя не указано",
                    last_name: item.last_name ?? "Фамилия не указана",
                    url: item.photo_400 ?? item.photo_100 ?? "default_avatar.jpg",
                    city: item.city?.title ?? "Город не указан",
                    sex: typeof item.sex === 'number' 
                        ? (item.sex === 2 ? "Мужской" : "Женский") 
                        : "Не указан",
                    last_seen: item.last_seen ? formatLastSeen(item.last_seen) : "Недавно",
                    status: item.status
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