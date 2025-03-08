
export class ProductComponent {
    constructor(parent) {
        this.parent = parent
    }

    getHTML(data) {
        return (
            `
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${data.url}" class="img-fluid" alt="картинка">
                </div>
                
                <div class="col-md-8 d-flex flex-column justify-content-center">
                
                    <div class="card-body">
                        <h5 class="card-title">${data.title}</h5>
                        <p class="card-text">${data.copyright}</p>
                        <button type="button" class="btn btn-secondary" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-content="Фотография была сделана ${data.date}">
  Когда была сделана фотография?
</button>
                    </div>
                </div>
            </div>
        `
        )
    }

    render(data) {
        const html = this.getHTML(data)
        this.parent.insertAdjacentHTML('beforeend', html)
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
        const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
   
    }
}