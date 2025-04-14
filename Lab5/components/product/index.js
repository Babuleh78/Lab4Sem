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
                max-height: 300px;
            ">
                <img src="${data.photo_400}" class="img-fluid" style="
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
                                <p><strong>Пол:</strong> ${data.sex === 1 ? 'Женский' : data.sex === 2 ? 'Мужской' : 'Не указан'}</p>
                                ${data.bdate ? `<p><strong>Дата рождения:</strong> ${data.bdate}</p>` : ''}
                                ${data.city ? `<p><strong>Город:</strong> ${data.city.title}</p>` : ''}
                                ${data.country ? `<p><strong>Страна:</strong> ${data.country.title}</p>` : ''}
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
                                ${data.last_seen ? `<p><strong>Последний визит:</strong> ${new Date(data.last_seen.time * 1000).toLocaleString()}</p>` : ''}
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
                                ${data.relation ? `<p><strong>Семейное положение:</strong> ${this.getRelationText(data.relation)}</p>` : ''}
                                ${data.relatives ? this.formatRelatives(data.relatives) : ''}
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
                                ${data.education ? this.formatEducation(data.education) : ''}
                                ${data.universities ? this.formatUniversities(data.universities) : ''}
                                ${data.schools ? this.formatSchools(data.schools) : ''}
                                ${data.occupation ? `<p><strong>Род деятельности:</strong> ${data.occupation}</p>` : ''}
                                ${data.career ? this.formatCareer(data.career) : ''}
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
    
                    <!-- Контакты и соцсети -->
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#contactsSection">
                                Контакты и соцсети
                            </button>
                        </h2>
                        <div id="contactsSection" class="accordion-collapse collapse" data-bs-parent="#userAccordion">
                            <div class="accordion-body">
                                ${data.mobile_phone ? `<p><strong>Телефон:</strong> ${data.mobile_phone}</p>` : ''}
                                ${data.home_phone ? `<p><strong>Домашний телефон:</strong> ${data.home_phone}</p>` : ''}
                                ${data.site ? `<p><strong>Сайт:</strong> <a href="${data.site}" target="_blank">${data.site}</a></p>` : ''}
                                ${data.skype ? `<p><strong>Skype:</strong> ${data.skype}</p>` : ''}
                                ${data.facebook ? `<p><strong>Facebook:</strong> <a href="${data.facebook}" target="_blank">${data.facebook}</a></p>` : ''}
                                ${data.twitter ? `<p><strong>Twitter:</strong> <a href="${data.twitter}" target="_blank">${data.twitter}</a></p>` : ''}
                                ${data.instagram ? `<p><strong>Instagram:</strong> <a href="https://instagram.com/${data.instagram}" target="_blank">@${data.instagram}</a></p>` : ''}
                            </div>
                        </div>
                    </div>
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
        "></footer>
        `;
    }
    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    
    }
}