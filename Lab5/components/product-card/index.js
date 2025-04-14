export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }


    getHTML(data, index) {
        return `
        <div class="card shadow-sm" style="width: 18rem; margin: 15px;">
            <img src="${data.photo || 'https://via.placeholder.com/300'}" 
                 class="card-img-top" 
                 alt="${data.first_name} ${data.last_name}"
                 style="height: 250px; object-fit: cover;">
            
            <div class="card-body">
                <h5 class="card-title">
                    ${data.first_name || 'Имя не указано'} 
                    ${data.last_name || 'Фамилия не указана'}
                </h5>
                
                <div class="d-flex justify-content-between mb-2">
                    <span class="badge bg-${data.sex === 'Мужской' ? 'primary' : 'danger'}">
                        ${data.sex}
                    </span>
                    <span class="text-muted">
                        <i class="bi bi-geo-alt"></i> 
                        ${data.city}
                    </span>
                </div>
                
                <p class="card-text">
                    <small class="text-muted">
                        <i class="bi bi-clock"></i> 
                        Был(а) в сети: ${data.last_seen}
                    </small>
                </p>
                
                ${data.status ? `<p class="card-text mt-2">${data.status}</p>` : ''}
                
                <button id="click-card-${index}" class="btn btn-outline-primary w-100 mt-2 >
                        data-index="${index}">
                    Подробнее
                </button>
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