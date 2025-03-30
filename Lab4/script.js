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
        const newStock = {
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
                    body: JSON.stringify(newStock)
                });
                const data = await response.json();
                document.getElementById('addDataResult').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('addDataResult').textContent = 'Ошибка: ' + error.message;
            }
        }
        
        // 4. Удалить акцию
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