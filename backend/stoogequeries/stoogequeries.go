package stoogequeries

import (
	"encoding/json"
	"log"
	"net/http"
	"stoogebackend/internal"

	"github.com/graphql-go/graphql"
	scribble "github.com/nanobox-io/golang-scribble"
)

// TODO: seems silly to define this twice (here and in the graphql schema)
type userExample struct {
	id   string
	name string
}

// QueryFunction initiates the interface for sending and resolving the graphQL queries
func baseQueryFunction(schema graphql.Schema) internal.HandlerFuncType {
	return func(context *internal.AppContext, r *http.Request) ([]byte, int, error) {
		result := graphql.Do(graphql.Params{
			Schema:        schema,
			RequestString: r.URL.Query().Get("query"),
		})
		if len(result.Errors) > 0 {
			// TODO: return an error instead of just printing to log
			log.Printf("wrong result, unexpected errors: %v", result.Errors)
		}
		response, err := json.Marshal(result)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		return response, http.StatusOK, nil
	}
}

// ExampleQueryHandler shows how to set up a simple graphQL handler for an endpoint with the database backend
// TODO: Make some resolvers instead of passing the db directly
func ExampleQueryHandler(db *scribble.Driver) internal.HandlerFuncType {
	/*
	   Create User object type with fields "id" and "name" by using GraphQLObjectTypeConfig:
	       - Name: name of object type
	       - Fields: a map of fields by using GraphQLFields
	   Setup type of field use GraphQLFieldConfig
	*/
	var user userExample
	var userType = graphql.NewObject(
		graphql.ObjectConfig{
			Name: "User",
			Fields: graphql.Fields{
				"id": &graphql.Field{
					Type: graphql.String,
				},
				"name": &graphql.Field{
					Type: graphql.String,
				},
			},
		},
	)

	/*
	   Create Query object type with fields "user" has type [userType] by using GraphQLObjectTypeConfig:
	       - Name: name of object type
	       - Fields: a map of fields by using GraphQLFields
	   Setup type of field use GraphQLFieldConfig to define:
	       - Type: type of field
	       - Args: arguments to query with current field
	       - Resolve: function to query data using params from [Args] and return value with current type
	*/
	var queryType = graphql.NewObject(
		graphql.ObjectConfig{
			Name: "Query",
			Fields: graphql.Fields{
				"user": &graphql.Field{
					Type: userType,
					Args: graphql.FieldConfigArgument{
						"id": &graphql.ArgumentConfig{
							Type: graphql.String,
						},
					},
					Resolve: func(p graphql.ResolveParams) (interface{}, error) {
						idQuery, isOK := p.Args["id"].(string)
						if isOK {
							err := db.Read("users", idQuery, user)
							if err != nil {
								return nil, err
							}
							return user, nil
						}
						return nil, nil
					},
				},
			},
		})

	var schema, _ = graphql.NewSchema(
		graphql.SchemaConfig{
			Query: queryType,
		},
	)
	return baseQueryFunction(schema)
}
