package userhandling

import (
	"encoding/json"
	"net/http"

	"github.com/hylle/stooge-dnd/backend/internal"

	jwt "github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

type userCredentials struct {
	Username string `json:"username"`
	Password []byte `json:"password"`
}

type jwtToken struct {
	Token string `json:"token"`
}

func getToken(user *userCredentials) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": user.Username,
		"password": user.Password,
	})
	// TODO: having "secret" being the secret is probably a terrible idea for something in production. Should definitely be changed before then
	tokenString, err := token.SignedString([]byte("secret"))
	return tokenString, err
}

// LoginHandler checks the provided credentials against the user database
func LoginHandler(context *internal.AppContext, r *http.Request) ([]byte, int, error) {
	var user userCredentials
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		return nil, http.StatusBadRequest, err
	}

	var databaseUser userCredentials
	err = context.Db.Read("users", user.Username, &databaseUser)
	if err != nil {
		return nil, http.StatusBadRequest, err
	}

	err = bcrypt.CompareHashAndPassword(databaseUser.Password, []byte(user.Password))
	if err != nil {
		return nil, http.StatusUnauthorized, err
	}

	tokenString, err := getToken(&databaseUser)
	if err != nil {
		return nil, http.StatusUnauthorized, err
	}

	response, err := json.Marshal(jwtToken{Token: tokenString})
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	return response, http.StatusOK, nil
}

// RegisterUserHandler writes the user to the database with a hashed and salted password
// TODO: Add async email verification
func RegisterUserHandler(context *internal.AppContext, r *http.Request) ([]byte, int, error) {
	var user userCredentials
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		// If there is something wrong with the request body, return a 400 status
		return nil, http.StatusBadRequest, err
	}
	// Salt and hash the password using the bcrypt algorithm
	// The second argument is the cost of hashing, which we arbitrarily set as 8 (this value can be more or less, depending on the computing power you wish to utilize)
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 8)

	newUser := userCredentials{user.Username, hashedPassword}
	if err != nil {
		// If there is any issue with inserting into the database, return a 500 error
		return nil, http.StatusInternalServerError, err
	}
	// Next, insert the username, along with the hashed password into the database
	context.Db.Write("user", newUser.Username, newUser)
	// We reach this point if the credentials we correctly stored in the database, and the default status of 200 is sent back
	return nil, http.StatusOK, nil
}

// RefreshJSONTokenHandler does what is says on the tin
func RefreshJSONTokenHandler(context *internal.AppContext, r *http.Request) ([]byte, int, error) {
	var user userCredentials
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		return nil, http.StatusBadRequest, err
	}

	tokenString, err := getToken(&user)
	if err != nil {
		return nil, http.StatusUnauthorized, err
	}

	response, err := json.Marshal(jwtToken{Token: tokenString})
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	return response, http.StatusOK, nil
}

// func RefreshToken(requestUser *models.User) []byte {
// 	authBackend := authentication.InitJWTAuthenticationBackend()
// 	token, err := authBackend.GenerateToken(requestUser.UUID)
// 	if err != nil {
// 		panic(err)
// 	}
// 	response, err := json.Marshal(parameters.TokenAuthentication{token})
// 	if err != nil {
// 		panic(err)
// 	}
// 	return response
// }
