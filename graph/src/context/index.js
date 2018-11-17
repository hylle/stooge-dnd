const context = ({ req }) => {
  // get the user token from the headers
  const token = req.headers.authorization || '';
  
  // try to retrieve a user with the token
  const user = {
    name: 'jh',
    roles: ['admin', 'user'],
  }; // getUser(token);

  // console.log({ user });
  
  // add the user to the context
  return { user };
}

export default context;