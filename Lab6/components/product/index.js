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
            width: 100%;
        ">
            <div class="col-md-4" style="
                overflow: hidden;
                border-radius: 10px;
                background: white;
                padding: 20px;
                max-height: 500px;
            ">
                <img src="${data.photo}" class="img-fluid" style="
                    border-radius: 10px;
                    width: 100%;
                    height: 100%;
                " alt="Фото профиля">
            </div>
            <div class="col-md-8" style="padding: 0 20px;">
                <div class="accordion" id="userAccordion">
                    <!-- Имя и вариации -->
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#nameSection">
                                Имя и вариации
                            </button>
                        </h2>
                        <div id="nameSection" class="accordion-collapse collapse show" data-bs-parent="#userAccordion">
                            <div class="accordion-body">
                                <p><strong>Имя:</strong> ${data.first_name} ${data.last_name}</p>
                                ${data.nickname ? `<p><strong>Никнейм:</strong> ${data.nickname}</p>` : ''}
                                ${data.maiden_name ? `<p><strong>Девичья фамилия:</strong> ${data.maiden_name}</p>` : ''}
                            </div>
                        </div>
                    </div>
    
                    <!-- Основная информация -->
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#basicInfoSection">
                                Основная информация
                            </button>
                        </h2>
                        <div id="basicInfoSection" class="accordion-collapse collapse" data-bs-parent="#userAccordion">
                            <div class="accordion-body">
                                <p><strong>Пол:</strong> ${data.sex}</p>
                                ${data.bdate ? `<p><strong>Дата рождения:</strong> ${data.bdate}</p>` : ''}
                                ${data.city ? `<p><strong>Город:</strong> ${data.city}</p>` : ''}
                                ${data.country ? `<p><strong>Страна:</strong> ${data.country}</p>` : ''}
                                <p><strong>Ссылка:</strong> vk.com/${data.domain}</p>
                            </div>
                        </div>
                    </div>
    
                    <!-- Активность -->
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#activitySection">
                                Активность
                            </button>
                        </h2>
                        <div id="activitySection" class="accordion-collapse collapse" data-bs-parent="#userAccordion">
                            <div class="accordion-body">
                                <p><strong>Статус:</strong> ${data.online ? 'Онлайн' : 'Оффлайн'}</p>
                                ${data.last_seen ? `<p><strong>Последний визит:</strong> ${data.last_seen}</p>` : ''}
                                ${data.status ? `<p><strong>Статус:</strong> ${data.status}</p>` : ''}
                            </div>
                        </div>
                    </div>
    
                    <!-- Социальные связи -->
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#socialSection">
                                Социальные связи
                            </button>
                        </h2>
                        <div id="socialSection" class="accordion-collapse collapse" data-bs-parent="#userAccordion">
                            <div class="accordion-body">
                                ${data.relation ? `<p><strong>Семейное положение:</strong> ${data.relation}</p>` : ''}
                                ${data.relatives ? `<p><strong>Отношения:</strong> ${data.relatives}</p>` : ''}
                                <p><strong>Можно писать в ЛС:</strong> ${data.can_write_private_message ? 'Да' : 'Нет'}</p>
                            </div>
                        </div>
                    </div>
    
                    <!-- Образование и работа -->
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#educationSection">
                                Образование и работа
                            </button>
                        </h2>
                        <div id="educationSection" class="accordion-collapse collapse" data-bs-parent="#userAccordion">
                            <div class="accordion-body">
                                ${data.education ? data.education : ''}
                                ${data.universities ? data.universities : ''}
                                ${data.schools ? data.schools : ''}
                                ${data.occupation ? `<p><strong>Род деятельности:</strong> ${data.occupation}</p>` : ''}
                                ${data.career ? `<p><strong>Карьера:</strong> ${data.career} </p>` : ''}
                            </div>
                        </div>
                    </div>
    
                    <!-- Интересы -->
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#interestsSection">
                                Интересы
                            </button>
                        </h2>
                        <div id="interestsSection" class="accordion-collapse collapse" data-bs-parent="#userAccordion">
                            <div class="accordion-body">
                                ${data.activities ? `<p><strong>Деятельность:</strong> ${data.activities}</p>` : ''}
                                ${data.interests ? `<p><strong>Интересы:</strong> ${data.interests}</p>` : ''}
                                ${data.music ? `<p><strong>Музыка:</strong> ${data.music}</p>` : ''}
                                ${data.movies ? `<p><strong>Фильмы:</strong> ${data.movies}</p>` : ''}
                                ${data.tv ? `<p><strong>ТВ:</strong> ${data.tv}</p>` : ''}
                                ${data.books ? `<p><strong>Книги:</strong> ${data.books}</p>` : ''}
                                ${data.games ? `<p><strong>Игры:</strong> ${data.games}</p>` : ''}
                                ${data.about ? `<p><strong>О себе:</strong> ${data.about}</p>` : ''}
                            </div>
                        </div>
                    </div>
    
                   
                   
                </div>
            </div>
        </div>
    
       
        `;
    }
    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    
    }
}