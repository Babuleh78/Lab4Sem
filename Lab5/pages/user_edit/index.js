export class UserEditPage {
    constructor(parent, userData, index, mainPageInstance) {
        this.parent = parent;
        this.userData = userData;
        this.index = index;
        this.mainPage = mainPageInstance;
        this.modal = null;
    }

    getHTML() {
        return `
        <div id="edit-modal" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Редактирование пользователя: ${this.userData.first_name} ${this.userData.last_name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="edit-modal-body">
                        ${this.getEditForm()}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-primary" id="save-changes-btn">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    getEditForm() {
        return `
        <form class="edit-form" id="user-edit-form">
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Имя:</label>
                        <input type="text" name="first_name" value="${this.escapeHtml(this.userData.first_name)}" class="form-control" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Фамилия:</label>
                        <input type="text" name="last_name" value="${this.escapeHtml(this.userData.last_name)}" class="form-control" required>
                    </div>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Город:</label>
                <input type="text" name="city" value="${this.escapeHtml(this.userData.city)}" class="form-control">
            </div>

            <div class="mb-3">
                <label class="form-label">Дата рождения:</label>
                <input type="text" name="bdate" value="${this.escapeHtml(this.userData.bdate)}" class="form-control" placeholder="ДД.ММ.ГГГГ">
            </div>

            <div class="mb-3">
                <label class="form-label">Пол:</label>
                <select name="sex" class="form-select">
                    <option value="Не указан" ${this.userData.sex === 'Не указан' ? 'selected' : ''}>Не указан</option>
                    <option value="Мужской" ${this.userData.sex === 'Мужской' ? 'selected' : ''}>Мужской</option>
                    <option value="Женский" ${this.userData.sex === 'Женский' ? 'selected' : ''}>Женский</option>
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label">Статус:</label>
                <textarea name="status" class="form-control" rows="2">${this.escapeHtml(this.userData.status)}</textarea>
            </div>

            <div class="mb-3">
                <label class="form-label">Семейное положение:</label>
                <select name="relation" class="form-select">
                    <option value="Не указано" ${this.userData.relation === 'Не указано' ? 'selected' : ''}>Не указано</option>
                    <option value="Не женат/Не замужем" ${this.userData.relation === 'Не женат/Не замужем' ? 'selected' : ''}>Не женат/Не замужем</option>
                    <option value="Есть друг/Есть подруга" ${this.userData.relation === 'Есть друг/Есть подруга' ? 'selected' : ''}>Есть друг/Есть подруга</option>
                    <option value="Помолвлен/Помолвлена" ${this.userData.relation === 'Помолвлен/Помолвлена' ? 'selected' : ''}>Помолвлен/Помолвлена</option>
                    <option value="Женат/Замужем" ${this.userData.relation === 'Женат/Замужем' ? 'selected' : ''}>Женат/Замужем</option>
                    <option value="Всё сложно" ${this.userData.relation === 'Всё сложно' ? 'selected' : ''}>Всё сложно</option>
                    <option value="В активном поиске" ${this.userData.relation === 'В активном поиске' ? 'selected' : ''}>В активном поиске</option>
                    <option value="Влюблён/Влюблена" ${this.userData.relation === 'Влюблён/Влюблена' ? 'selected' : ''}>Влюблён/Влюблена</option>
                    <option value="В гражданском браке" ${this.userData.relation === 'В гражданском браке' ? 'selected' : ''}>В гражданском браке</option>
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label">Онлайн статус:</label>
                <select name="online" class="form-select">
                    <option value="Онлайн" ${this.userData.online === 'Онлайн' ? 'selected' : ''}>Онлайн</option>
                    <option value="Оффлайн" ${this.userData.online === 'Оффлайн' ? 'selected' : ''}>Оффлайн</option>
                </select>
            </div>
        </form>
        `;
    }

    escapeHtml(text) {
        if (!text) return '';
        return text
            .toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    setupEventListeners() {
        document.getElementById('save-changes-btn').addEventListener('click', () => {
            this.saveChanges();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal) {
                this.modal.hide();
            }
        });
        const modalElement = document.getElementById('edit-modal');
        modalElement.addEventListener('hidden.bs.modal', () => {
            this.destroy();
        });
    }

    saveChanges() {
        const form = document.getElementById('user-edit-form');
        const formData = new FormData(form);
        
        const updatedData = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            city: formData.get('city'),
            bdate: formData.get('bdate'),
            sex: formData.get('sex'),
            status: formData.get('status'),
            relation: formData.get('relation'),
            online: formData.get('online')
        };

        this.mainPage.saveUserData(this.index, updatedData);

        if (this.modal) {
            this.modal.hide();
        }
    }

    show() {
        document.body.insertAdjacentHTML('beforeend', this.getHTML());
        
        const modalElement = document.getElementById('edit-modal');
        this.modal = new bootstrap.Modal(modalElement);
        
        this.modal.show();
        this.setupEventListeners();
    }

    destroy() {
        const modalElement = document.getElementById('edit-modal');
        if (modalElement && modalElement.parentNode) {
            modalElement.parentNode.removeChild(modalElement);
        }
        this.modal = null;
    }

    render() {
        this.show();
    }
}