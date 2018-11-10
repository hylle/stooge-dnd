const fetch = require('node-fetch');

module.exports = (url, options) => {
   options = Object.assign({}, options);
   const jsonHeaders = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
   options.headers = Object.assign(jsonHeaders, options.headers);
   if (options.body)
      options.body = JSON.stringify(options.body);
   function toJson(response) { return response.json(); }
   return fetch(url, options).then(toJson);
   };
