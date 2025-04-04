import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";

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
            <div id="main-page">
                <!-- Основная карусель -->
                <div class="carousel slide" data-bs-ride="carousel" id="main-carousel">
                    <div class="carousel-inner" id="carousel-inner"></div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#main-carousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Предыдущий</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#main-carousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Следующий</span>
                    </button>
                </div>
                
                <!-- Фильтры поверх карусели -->
                <section class="filters-overlay">
                    <h2>Применить фильтры <button class="collapse-button">▼</button></h2>
                    <div class="change-section-content">
                        <input type="text" id="filter-id" placeholder="ID (Сортировка невозможна)">
                        <input type="text" id="filter-date" placeholder="Дата(все карточки позже)">
                        <input type="text" id="filter-title" placeholder="Название(LIKE)">
                        <textarea id="filter-explanation" placeholder="Описание(по длине)"></textarea>
                        <input type="text" id="filter-url" placeholder="URL (по длине)">
                        <button id="filter-button">Filter</button>
                        <button id ="sbros-button">Сброс</button>
                    </div>
                </section>
            </div>
        `;
    }
    
    async getData() {
        try {
            const response = await fetch(this.response); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            throw error;
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
        const texts = [
            "Мне показалось, что 3 поля мало", 
            "Этот текст уникальный для каждой фотки", 
            "Честно", 
            "Пречестно"
        ]; 

        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        
        const carouselInner = document.getElementById('carousel-inner');
        const data = await this.getData();
        
        data.forEach((item, index) => {
            const text = texts[index % texts.length];
            const modifiedItem = {
                ...item,
                babuflex: text,
                copyright: item.explanation,
                explanation: this.getFirstTwoSentences(item.explanation)
            };
            
            const productCard = new ProductCardComponent(carouselInner);
            productCard.render(modifiedItem, index, this.clickCard.bind(this, modifiedItem));
        });
        
        this.setupEventListeners();
    }
    
    getFirstTwoSentences(text) {
        if (!text) return '';
        const sentences = text.split(/(?<=[.!?])\s+/);
        return sentences.slice(0, 2).join(' '); 
    }
}