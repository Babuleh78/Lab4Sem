export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data, index) {
        return `
            <div class="carousel-item ${index === 0 ? 'active' : ''}"    ">
                <img class="card-img-top carousel-image" src="${data.url}" alt="картинка" style="width: 100%; height: 80vh;">
                <div>
                        <h5 class="card-title">${data.title}</h5>
                        <p class="card-text">${data.explanation}</p>
                       <button class="btn btn-primary" id="click-card-${index}" data-id="${index}" style="display: block; margin: auto;">Читать далее</button>
                </div>
            </div>
        `;
    }

    addListeners(index, listener) {
        const button = document.getElementById(`click-card-${index}`);
        if (button) {
            button.addEventListener("click", listener);
            
        }
    }

    render(data, index, listener) {
        const html = this.getHTML(data, index);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(index, listener);
    }
}