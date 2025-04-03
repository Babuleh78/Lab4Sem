const API_BASE_URL = 'http://localhost:8000/data';
        
async function getAllData() {
        try {
                const response = await fetch(`${API_BASE_URL}/get`);
                const data = await response.json();
                document.getElementById('allDataResult').textContent = JSON.stringify(data, null, 2);
        } catch (error) {
                document.getElementById('allDataResult').textContent = 'Ошибка: ' + error.message;
            }
        }
        
async function getDataById() {
        const id = document.getElementById('dataId').value;
        if (!id) {
                alert('Введи ID, харош тупить');
                return;
            }
            
        try {
                const response = await fetch(`${API_BASE_URL}/${id}`);
                const data = await response.json();
                document.getElementById('dataByIdResult').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('dataByIdResult').textContent = 'Ошибка: ' + error.message;
            }
        }
        
async function addData() {
        const newCard= {
                id: document.getElementById('newId').value,
                date: document.getElementById('newDate').value,
                title: document.getElementById('newTitle').value,
                explanation: document.getElementById('newExplanation').value,
                url: document.getElementById('newUrl').value
            };
            
        try {
                const response = await fetch(`${API_BASE_URL}/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newCard)
                });
                const data = await response.json();
                document.getElementById('addDataResult').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('addDataResult').textContent = 'Ошибка: ' + error.message;
            }
        }
        
       
async function deleteData() {
        const id = document.getElementById('deleteId').value;
        if (!id) {
                alert('Введи ID, харош тупить');
                return;
            }
            
         try {
                const response = await fetch(`${API_BASE_URL}/${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                document.getElementById('deleteDataResult').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('deleteDataResult').textContent = 'Ошибка: ' + error.message;
            }
}
      
async function changeData() {
    const id = document.getElementById('changeId').value;
    const date = document.getElementById('changeDate').value;
    const title = document.getElementById('changeTitle').value;
    const explanation = document.getElementById('changeExplanation').value;
    const url = document.getElementById('changeUrl').value;

    if (!id) {
        alert('Введи ID, харош тупить');
        return;
    }

    const updateData = {};
    if (date) updateData.date = date;
    if (title) updateData.title = title;
    if (explanation) updateData.explanation = explanation;
    if (url) updateData.url = url;

    if (Object.keys(updateData).length === 0) {
        document.getElementById('changeDataResult').textContent = 'Нет данных для изменения';
        return;
    }
    console.log(id);
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        
        let result = "Измененные поля:\n";
        for (const [key, value] of Object.entries(updateData)) {
            result += `${key}: ${value}\n`;
        }
        
        document.getElementById('changeDataResult').textContent = result;
    } catch (error) {
        document.getElementById('changeDataResult').textContent = 'Ошибка: ' + error.message;
    }
}













function toggleChangeSection(button) {
    const section = button.parentElement;
    const content = section.nextElementSibling;
    
    if (content.style.display === "none") {
        content.style.display = "block";
        button.textContent = " ▼ ";
    } else {
        content.style.display = "none";
        button.textContent = " ▶ ";
    }
}

// Инициализация - скрываем все блоки контента при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const button = section.querySelector('button.collapseButton');
        const content = section.querySelector('.changeSectionContent');
        
        content.style.display = "none";
        button.textContent = " ▶ ";
    });
});