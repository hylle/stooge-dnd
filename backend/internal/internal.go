package internal

import (
	"net/http"

	scribble "github.com/nanobox-io/golang-scribble"
)

// HandlerFuncType is the type signature any handler function should have
type HandlerFuncType = func(*AppContext, *http.Request) ([]byte, int, error)

// AppContext provides all the state info that the handlers need to process a request
type AppContext struct {
	Db *scribble.Driver
}

// AppHandler defines a reusable struct that enables parsing context to a handler function
type AppHandler struct {
	*AppContext
	HandlerFn HandlerFuncType
}
