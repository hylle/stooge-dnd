package model

import (
	"fmt"

	scribble "github.com/nanobox-io/golang-scribble"
)

// InitiateDb returns a pointer to a driver storing data in the given folder
func InitiateDb(dbDir string) (*scribble.Driver, error) {
	db, err := scribble.New(dbDir, nil)
	if err != nil {
		fmt.Println("Error", err)
		return nil, err
	}
	return db, nil
}
