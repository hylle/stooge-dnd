package routes

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"stoogebackend/internal"
	"stoogebackend/stoogequeries"
	"stoogebackend/userhandling"

	"github.com/gorilla/mux"
)

// MakeAppHandler curries a function call, so the app context is also provided
func MakeAppHandler(ah internal.AppHandler) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		response, status, err := ah.HandlerFn(ah.AppContext, r)
		if err != nil {
			log.Printf("HTTP %d: %q", status, err)
			switch status {
			case http.StatusNotFound:
				http.NotFound(w, r)
			case http.StatusInternalServerError:
				http.Error(w, http.StatusText(status), status)
			case http.StatusOK:
				json.NewEncoder(w).Encode(response)
			default:
				http.Error(w, http.StatusText(status), status)
			}
		}
	}
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Do stuff here
		fmt.Println(r.RequestURI)
		// Call the next handler, which can be another middleware in the chain, or the final handler.
		next.ServeHTTP(w, r)
	})
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	return
}

//Helper function to import json from file to map
func importJSONDataFromFile(fileName string, result interface{}) (isOK bool) {
	isOK = true
	content, err := ioutil.ReadFile(fileName)
	if err != nil {
		fmt.Print("Error:", err)
		isOK = false
	}
	err = json.Unmarshal(content, result)
	if err != nil {
		isOK = false
		fmt.Print("Error:", err)
	}
	return
}

// GetRoutes returns a router that handles all the endpoints for the service
func GetRoutes(context *internal.AppContext) *mux.Router {
	r := mux.NewRouter()
	executeQuery := stoogequeries.ExampleQueryHandler(context.Db)
	r.Use(loggingMiddleware)
	r.HandleFunc("/", homeHandler)
	r.HandleFunc("/graphql", MakeAppHandler(internal.AppHandler{context, executeQuery}))
	r.HandleFunc("/authenticate", MakeAppHandler(internal.AppHandler{context, userhandling.LoginHandler})).Methods("POST")
	r.HandleFunc("/register-user", MakeAppHandler(internal.AppHandler{context, userhandling.RegisterUserHandler}))
	r.HandleFunc("/refresh-token", MakeAppHandler(internal.AppHandler{context, userhandling.RefreshJSONTokenHandler}))
	r.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		t, err := route.GetPathTemplate()
		if err != nil {
			return err
		}
		fmt.Println(t)
		return nil
	})
	http.Handle("/", r)
	return r
}
