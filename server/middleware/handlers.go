package middleware

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"go-postgres/models"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

type response struct {
	ID int64 `json:"id,omitempty"`
	Message string `json:"message,omitempty"`
}

const (
	host     = "localhost"
	port     = 5432
	user     = "thomaschamplin"
	password = "stockspass"
	dbname   = "stocksdb"
)

func createConnection() *sql.DB {
	postgresqlDbInfo := fmt.Sprintf("host=%s port=%d user=%s "+
    "password=%s dbname=%s sslmode=disable",
    host, port, user, password, dbname)

	db, err := sql.Open("postgres", postgresqlDbInfo)

	if err != nil {
        panic(err)
	}

	err = db.Ping()

	if err!= nil {
        panic(err)
    }

	fmt.Println("Successfully connected to postgres")
	return db
}


// API function for creating a stock
// Request is from the user, response is what the server returns
func CreateStock(w http.ResponseWriter, r *http.Request) {
	// this creates a var with the type models.Stock (the Stock struct from the models package)
	var stock models.Stock
// this decodes the request (r.Body) from JSON into the format of the stock struct
	err := json.NewDecoder(r.Body).Decode(&stock)

	if err != nil {
        log.Fatalf("Unable to decode the request body. %v", err)
    }				

	// function that takes the stock struct and inserts the stock
	insertID := insertStock(stock)

	// creates a response variable with the response struct from above
	res := response{
		ID: insertID,
		Message: "Stock created successfully",
	}

	// encodes the res
	json.NewEncoder(w).Encode(res)
}

// This function converts the data from the other getStock function so we can use the data (hence the encoding into JSON etc)
func GetStock(w http.ResponseWriter, r *http.Request) {
	// gathers params from request via mux
	 params := mux.Vars(r)
	// converts the "id" gathered from the mux params to a an int (from a string - json is always string) so we can use it
	 id, err := strconv.Atoi(params["id"])

	 if err!= nil {
		log.Fatalf("Unable to convert the string id to an int: %v", err)
	 }

	 //converts the int into an int64
	 stock, err := getStock(int64(id))

	 if err != nil {
		log.Fatalf("Unable to get stock: %v", err)
	 }

	 // encodes the data and sends it as a response
	json.NewEncoder(w).Encode(stock)
}

func GetAllStock(w http.ResponseWriter, r *http.Request) {
	stocks, err := getAllStocks()

	if err != nil {
		log.Fatalf("Unable to get all stocks: %v", err)
	}

	json.NewEncoder(w).Encode(stocks)
}

func UpdateStock(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil {
		log.Fatalf("Unable to convert the string id to an int: %v", err)
	}

	var stock models.Stock

	err = json.NewDecoder(r.Body).Decode(&stock)

	if err != nil {
		log.Fatalf("Unable to decode the request body: %v", err)
	}

	updatedRows := updateStock(int64(id), stock)

	msg := fmt.Sprintf("Stock updated successfully. Total rows/records affected: %v", updatedRows)

	res := response{
		ID: int64(id),
        Message: msg,
    }

	json.NewEncoder(w).Encode(res)
}

func DeleteStock(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Headers", "authentication, content-type")
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err!= nil {
		log.Fatalf("Unable to convert the string id to an int: %v", err)
	}

	deletedRows := deleteStock(int64(id))

	msg := fmt.Sprintf("Stock deleted successfully. Total rows/records affected: %v", deletedRows)

	res := response{
        ID: int64(id),
		Message: msg,
	}

	json.NewEncoder(w).Encode(res)
}

// send a stock, get back the id of the stock
func insertStock(stock models.Stock) int64{
	// connects to Postgres database
	db := createConnection()
	// defers the close to the end of the function
	defer db.Close()
	// sql statement for the db
	sqlStatement := `INSERT INTO stocks(name, price, company) VALUES ($1, $2, $3) RETURNING stockid`
	// creates var for the id (which will be returned for the original function)
	var id int64

	// links the values from the function to the sqlStatement above
	err := db.QueryRow(sqlStatement, stock.Name, stock.Price, stock.Company).Scan(&id)

	if err != nil {
		log.Fatalf("Unable to execute the query: %v", err)
	}

	fmt.Printf("Inserted a single record %v", id)
	// returns the id for the original function
	return id
}

// the first is the arg (what gets sent) the second is what gets returned/the type
// here an id (type int64) is sent to the function, a return (type models.Stock struct) is returned
func getStock(id int64)(models.Stock, error){
	db := createConnection()
	defer db.Close()

	var stock models.Stock

	sqlStatement := `SELECT * FROM stocks WHERE stockid=$1`

	row := db.QueryRow(sqlStatement, id)

	err := row.Scan(&stock.StockID, &stock.Name, &stock.Price, &stock.Company)

	switch err {
	case sql.ErrNoRows:
		fmt.Println("No rows were returned!")
		return stock, nil
	case nil:
		return stock, nil
	default:
		log.Fatalf("Unable to scan the row: %v.", err)
	}
	return stock, err
}

func getAllStocks() ([]models.Stock, error){
	db := createConnection()
	defer db.Close()

	var stocks []models.Stock

	sqlStatement := `SELECT * FROM stocks`

	rows, err := db.Query(sqlStatement)

	if err != nil {
		log.Fatalf("Unable to execute the query: %v", err)
	} 

	defer rows.Close()

	for rows.Next() {
		var stock models.Stock
		err = rows.Scan(&stock.StockID, &stock.Name, &stock.Price, &stock.Company)

		if err!= nil {
			log.Fatalf("Unable to scan the row: %v.", err)
		}
		stocks = append(stocks, stock)

	}
	return stocks, err
}

func updateStock(id int64, stock models.Stock) int64{
	db := createConnection()
	defer db.Close()

	sqlStatement := `UPDATE stocks SET name=$2, price=$3, company=$4 WHERE stockid=$1`

	res, err := db.Exec(sqlStatement, id, stock.Name, stock.Price, stock.Company)

	if err!= nil {
		log.Fatalf("Unable to execute the query: %v", err)
	}

	rowsAffected, err := res.RowsAffected()

	if err!= nil {
		log.Fatalf("Unable to get the number of rows affected: %v", err)
	}
	fmt.Printf("Total rows/records affected: %v", rowsAffected)
	return rowsAffected
}

func deleteStock(id int64) int64{
	db := createConnection()
	defer db.Close()

	sqlStatement := `DELETE FROM stocks WHERE stockid=$1`

	res, err := db.Exec(sqlStatement, id)

	if err!= nil {
		log.Fatalf("Unable to execute the query: %v", err)
	}

	rowsAffected, err := res.RowsAffected()

	if err!= nil {
		log.Fatalf("Unable to get the number of rows affected: %v", err)
	}
	fmt.Printf("Total rows/records affected: %v", rowsAffected)
	return rowsAffected
}


