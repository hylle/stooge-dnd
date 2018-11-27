package routes

import (
	"net/http"
	"reflect"
	"testing"

	"github.com/gorilla/mux"
	"github.com/graphql-go/graphql"
)

func TestMakeAppHandler(t *testing.T) {
	type args struct {
		ah appHandler
	}
	tests := []struct {
		name string
		args args
		want func(w http.ResponseWriter, r *http.Request)
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := MakeAppHandler(tt.args.ah); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("MakeAppHandler() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_createQueryFunction(t *testing.T) {
	type args struct {
		schema graphql.Schema
	}
	tests := []struct {
		name string
		args args
		want queryFunc
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := createQueryFunction(tt.args.schema); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("createQueryFunction() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_loggingMiddleware(t *testing.T) {
	type args struct {
		next http.Handler
	}
	tests := []struct {
		name string
		args args
		want http.Handler
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := loggingMiddleware(tt.args.next); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("loggingMiddleware() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_homeHandler(t *testing.T) {
	type args struct {
		w http.ResponseWriter
		r *http.Request
	}
	tests := []struct {
		name string
		args args
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			homeHandler(tt.args.w, tt.args.r)
		})
	}
}

func Test_importJSONDataFromFile(t *testing.T) {
	type args struct {
		fileName string
		result   interface{}
	}
	tests := []struct {
		name     string
		args     args
		wantIsOK bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if gotIsOK := importJSONDataFromFile(tt.args.fileName, tt.args.result); gotIsOK != tt.wantIsOK {
				t.Errorf("importJSONDataFromFile() = %v, want %v", gotIsOK, tt.wantIsOK)
			}
		})
	}
}

func TestGetRoutes(t *testing.T) {
	type args struct {
		context *appContext
	}
	tests := []struct {
		name string
		args args
		want *mux.Router
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := GetRoutes(tt.args.context); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("GetRoutes() = %v, want %v", got, tt.want)
			}
		})
	}
}
