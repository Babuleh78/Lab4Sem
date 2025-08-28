export class AccordionElement {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(element_name, element_text, id) {
        return `
          <div class="accordion-item">
            <h2 class="accordion-header" id="heading-${id}">
              <button class="accordion-button collapsed" type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapse-${id}" 
                      aria-expanded="false" 
                      aria-controls="collapse-${id}">
                ${element_name}
              </button>
            </h2>
            <div id="collapse-${id}" class="accordion-collapse collapse" 
                 aria-labelledby="heading-${id}" 
                 data-bs-parent="#accordionExample">
              <div class="accordion-body">
                ${element_text}
              </div>
            </div>
          </div>
        `;
    }

    render(data) {
        const html = this.getHTML(data.title, data.content, data.id);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}