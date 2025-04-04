import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";

export class MainPage {
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
                    </div>
                </section>
            </div>
        `;
    }
    
    async getData() {
        try {
            const response = await fetch('http://localhost:8000/data/get'); 
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
                collapseButton.textContent = "▼";
            } else {
                content.style.display = "none";
                collapseButton.textContent = "▶";
            }
        });
        
        // Обработчик для кнопки фильтрации
        const filterButton = this.pageRoot.querySelector('#filter-button');
        filterButton.addEventListener('click', this.filterData.bind(this));
    }
    
    filterData() {
        // Реализация фильтрации данных
        const resultElement = this.pageRoot.querySelector('#filter-data-result');
        resultElement.textContent = "Фильтрация пока не реализована";
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