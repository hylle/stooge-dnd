# node-fetch-json
_A very thin wrapper around node-fetch just for JSON_

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/node-fetch-json/blob/master/LICENSE.txt)
&nbsp;
[![npm](https://img.shields.io/npm/v/node-fetch-json.svg)](https://www.npmjs.com/package/node-fetch-json)
&nbsp;
[![Known Vulnerabilities](https://snyk.io/test/github/center-key/node-fetch-json/badge.svg)](https://snyk.io/test/github/center-key/node-fetch-json)
&nbsp;
[![Build Status](https://travis-ci.org/center-key/node-fetch-json.svg)](https://travis-ci.org/center-key/node-fetch-json)

Why would you fetch anything but json? ;)

### A) Setup
Install with the command:
```shell
$ npm install node-fetch-json --save
```
Then import with the line:
```javascript
const fetchJson = require('node-fetch-json');
```

### B) Usage
**node-fetch-json** depends on and calls **[node-fetch](https://www.npmjs.com/package/node-fetch)**.

#### 1. The low-level way
**node-fetch** enables you to send and receive JSON at a REST endpoint using:
```javascript
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
```

#### 2. A more concise way
With **node-fetch-json**, the above becomes:
```javascript
const fetchJson = require('node-fetch-json');
const data = { animal: 'dog', action: 'fetch' };
function handleJson(data) {
   console.log(data.origin, data.json);
   }
fetchJson('https://httpbin.org/post', { method: 'POST', body: data })
   .then(handleJson)
   .catch(console.log);
```

#### 3. Same result
Both examples produce output that looks like:<br>
**`203.0.113.254 { action: 'fetch', animal: 'dog' }`**

### C) Details
The **node-fetch-json** module:
1. Automatically adds the JSON data type (`'application/json'`) to the HTTP headers.
1. Automatically serializes the body payload with `JSON.stringify()`.
1. Automatically runs `.json()` on the response promise.

The format for using **node-fetch-json** is:
```javascript
fetchJson(url[, options])
```
The `url` and `options` parameters are passed through to **node-fetch**.
See the documentation for the **[node-fetch](https://www.npmjs.com/package/node-fetch)** project.

### D) Questions or enhancements
Feel free to submit an [issue](https://github.com/center-key/node-fetch-json/issues).

---
[MIT License](LICENSE.txt)
