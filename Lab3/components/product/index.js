import { AccordionElement } from "../accordion/index.js";

export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
        <div class="row">
            <div class="col-md-4">
                <img src="${data.url}" class="img-fluid" alt="картинка">
            </div>
            <div class="col-md-8">
                <div class="accordion" id="accordionExample">
                    <!-- Аккордеоны будут добавлены здесь -->
                </div>
            </div>
        </div>
        `;
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    
        const accordionContainer = this.parent.querySelector('#accordionExample');
        
        const accordionItems = [
            { title: "Title", content: data.title || "No title available", id: "title"},
            { title: "Shooting date", content: data.date || "Date not specified", id: "date" },
            { title: "Info", content: data.copyright || "No information available", id: "info" },
            { title: "Anything else", content: data.babuflex || "No information available", id: "stuff" }
        ];
    
        accordionItems.forEach(item => {
            const accordion = new AccordionElement(accordionContainer);
            accordion.render(item);
        });
    }
}