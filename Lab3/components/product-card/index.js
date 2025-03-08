export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data, index) {
        return `
            <div class="carousel-item ${index === 0 ? 'active' : ''}" style="width: 300px;">
                <img class="card-img-top" src="${data.url}" alt="картинка">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${data.title}</h5>
                    <p>${data.explanation}</p>
                    
                </div>
            </div>
        `;
    }

    addListeners(data, listener) {
        const button = document.getElementById(`click-card-${data.id}`);
        if (button) {
            button.addEventListener("click", listener);
        }
    }

    render(data, index, listener) {
        const html = this.getHTML(data, index);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, listener);
    }
}