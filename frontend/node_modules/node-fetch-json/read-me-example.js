// node read-me-example.js

////////////////////////////////////////////////////////////////////////////////////////////////////
function oldWay() {
   const fetch = require('node-fetch');
   const data = { animal: 'dog', action: 'fetch' };
   const options = {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
         },
      body: JSON.stringify(data)
      };
   function handleJson(data) {
      console.log(data.origin, data.json);
      }
   fetch('https://httpbin.org/post', options)
      .then(response => response.json())
      .then(handleJson)
      .catch(console.log);
   }

////////////////////////////////////////////////////////////////////////////////////////////////////
function newWay() {
   const fetchJson = require('./node-fetch-json.js');
   const data = { animal: 'dog', action: 'fetch' };
   function handleJson(data) {
      console.log(data.origin, data.json);
      }
   fetchJson('https://httpbin.org/post', { method: 'POST', body: data })
      .then(handleJson)
      .catch(console.log);
   }

////////////////////////////////////////////////////////////////////////////////////////////////////
oldWay();
newWay();
