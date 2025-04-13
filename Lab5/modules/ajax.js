class Ajax {
    post(url, params = {}) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const urlWithParams = `${url}?${new URLSearchParams(params)}`;
            
            xhr.open('POST', urlWithParams);
            xhr.send();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            resolve(data);
                        } catch (e) {
                            console.error('Error parsing response:', e);
                            reject({ error: 'Invalid JSON response' });
                        }
                    } else {
                        reject({ error: `Request failed with status ${xhr.status}` });
                    }
                }
            };
        });
    }

    
}

export const ajax = new Ajax();