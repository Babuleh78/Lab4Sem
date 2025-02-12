package main

import (
	"html/template"
	"net/http"
)

var error_counter = 0

func handler(w http.ResponseWriter, r *http.Request) {
	filePath := "calculator.html"

	// Создаем новый шаблон
	tmpl, err := template.ParseFiles(filePath)
	if err != nil {
		error_counter++
		http.Error(w, "Ошибка при загрузке шаблона", http.StatusInternalServerError)
		println("Ошибка %s при загрузке шаблона:", err.Error(), error_counter)
		return
	}

	// Выполняем шаблон и передаем URL путь
	err = tmpl.Execute(w, r.URL.Path)
	if err != nil {
		http.Error(w, "Ошибка при выполнении шаблона", http.StatusInternalServerError)
	}
}

func main() {
	http.HandleFunc("/", handler) // Устанавливаем обработчик для корневого маршрута

	// Обслуживаем статические файлы из директории
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("."))))

	println("Сервер запущен на http://localhost:2811")
	err := http.ListenAndServe(":2811", nil) // Запускаем сервер на порту 2811
	if err != nil {
		println("Ошибка при запуске сервера:", err)
	}
}
