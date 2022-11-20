package main

import (
	"fmt"
	"go-postgres/middleware"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func handleRequests() {
		router := mux.NewRouter()
	
		
		router.HandleFunc("/api/stock/{id}", middleware.GetStock).Methods("GET", "OPTIONS")
		router.HandleFunc("/api/stock", middleware.GetAllStock).Methods("GET", "OPTIONS")
		router.HandleFunc("/api/newstock", middleware.CreateStock).Methods("POST", "OPTIONS")
		router.HandleFunc("/api/stock/{id}", middleware.UpdateStock).Methods("PUT", "OPTIONS")
		router.HandleFunc("/api/deletestock/{id}", middleware.DeleteStock).Methods("DELETE", "OPTIONS")

	c := cors.New(cors.Options{
        AllowedOrigins: []string{"http://localhost:3000"},
		AllowedHeaders: []string{"Origin", "X-Requested-With", "Content-Type", "Accept"},
        AllowCredentials: true,
		AllowedMethods: []string{"GET", "DELETE", "POST", "PUT", "OPTIONS"},
    })

	fmt.Println("Starting server at port 8080")

	handler := c.Handler(router)
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func main() {
	handleRequests()
}
