package model

import (
	"reflect"
	"testing"

	scribble "github.com/nanobox-io/golang-scribble"
)

func TestInitiateDb(t *testing.T) {
	type args struct {
		dbDir string
	}
	tests := []struct {
		name    string
		args    args
		want    *scribble.Driver
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := InitiateDb(tt.args.dbDir)
			if (err != nil) != tt.wantErr {
				t.Errorf("InitiateDb() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("InitiateDb() = %v, want %v", got, tt.want)
			}
		})
	}
}
