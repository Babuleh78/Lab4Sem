import {ProductCardComponent} from "../../components/product-card/index.js";

import {ProductPage} from "../product/index.js";



export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }
    
    get pageRoot() {
        return document.getElementById('main-page')
    }
    getHTML() {
        return `
            <div id="main-page" class="carousel slide"  data-bs-ride="carousel">
           
                <div class="carousel-inner" id="carousel-inner">

                </div>
               <button class="carousel-control-prev" type="button" data-bs-target="#main-page"  data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Предыдущий</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#main-page"  data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Следующий</span>
            </button>
            </div>
        `;
    }
    async getData() {
        try {
            
            const response = await fetch('data.json');
            if (!response.ok) {
              throw new Error('Ошибка загрузки файла');
            }
            const data = await response.json();
            return data
          } catch (error) {
            console.error('Ошибка:', error);
          }
    }
    
    clickCard(item, e) {

        const cardId = e.target.dataset.id

       
        const productPage = new ProductPage(this.parent, cardId)
        productPage.render(item)

    } 
    async render() {
        const Texts = ["Мне показалось, что 3 поля мало", "Этот текст уникальный для каждой фотки", "Честно"]; 

        function getFirstTwoSentences(text) {
            const sentences = text.split(/(?<=[.!?])\s+/);
            return sentences.slice(0, 2).join(' '); 
        }
        
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)
        const carouselInner = document.getElementById('carousel-inner');
        const data = await this.getData()
        console.log(data)
        for(let i = 0; i<Object.keys(data).length; i++){
    
            const item = data[i]
            item.babuflex = Texts[i]
            item.copyright = item.explanation
            item.explanation = getFirstTwoSentences(item.explanation)
        
            const productCard = new ProductCardComponent(carouselInner)
            productCard.render(item, i, this.clickCard.bind(this, item))
        }
    }
}