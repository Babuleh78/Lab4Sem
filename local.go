package main

import (
	"html/template"
	"net/http"
	"path/filepath"
)

func handler(w http.ResponseWriter, r *http.Request) {
	filePath := filepath.Join("Lab1", "calculator.html")

	// Создаем новый шаблон
	tmpl, err := template.ParseFiles(filePath)
	if err != nil {
		http.Error(w, "Ошибка при загрузке шаблона", http.StatusInternalServerError)
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

	println("Сервер запущен на http://localhost:2811")
	err := http.ListenAndServe(":2811", nil) // Запускаем сервер на порту 2811
	if err != nil {
		println("Ошибка при запуске сервера:", err)
	}
}
