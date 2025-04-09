import { AccordionElement } from "../accordion/index.js";

export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
       <div class="row" style="
        
        padding: 10px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        background: GreenYellow;
        wight:100%;
    ">
        <div class="col-md-4" style="
            overflow: hidden;
            border-radius: 10px;
            background: white;
            padding: 20px;
            max-height: 300px; /* Ограничение высоты */
        ">
            <img src="${data.url}" class="img-fluid" style="
                border-radius: 10px;
                width: 100%;
                height: 100%; 
            " alt="картинка">
        </div>
        <div class="col-md-8" style="padding: 0 20px;">
            <div class="accordion" id="accordionExample" style="
                border-radius: 8px;
                overflow: hidden;
            ">
                <!-- Содержимое аккордеона здесь -->
            </div>
        </div>
    </div>

    <footer style="
        width: 100%;
        height: 420px;
        font-family: Arial, sans-serif;
        font-size: 20px;
        background: 
            linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
            url('https://i.ytimg.com/vi/DTCYa53oWK0/maxresdefault.jpg') center/cover;
        color: white;
    ">
       
    </footer>
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