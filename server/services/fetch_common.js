const request = require('request'); 
const fetch = require('node-fetch');

async function get(endpoint, headers) {
    const options = { headers };
    const response = await fetch(endpoint, options);
    if (response.status == 200) {
        const json = await response.json();
        return json
    } else {
        const message = await response.text(); 
        throw new Error(response.status+ ' ' + response.statusText + ' ' + message);
    }
}

async function fileStreamGet(endpoint, headers) {
    const options = { headers };
    const response = await fetch(endpoint, options);
    if (response.status == 200) {
        return response.body
    } else {
        const message = await response.text(); 
        throw new Error(response.status+ ' ' + response.statusText + ' ' + message);
    }
}

async function post(endpoint, headers, body) {
    const options = { method: 'POST', headers: headers || {}, body: body };
    const response = await fetch(endpoint, options);
    if (response.status == 200 || response.status == 201 ) {
        const json = await response.json();
        return json;
    } else if (response.status == 204){

        return true
    }
    else {
        const message = await response.text();
        throw new Error(response.status+ ' ' + response.statusText + ' ' + message);
    }
}

async function put(endpoint, headers, body) {
    const options = { method: 'PUT', headers: headers || {}, body: body };
    const response = await fetch(endpoint, options);
    if (response.status == 200) {
        const json = await response.json();
        return json;
    } else {
        const message = await response.text();
        throw new Error(response.status+ ' ' + response.statusText + ' ' + message);
    }
}

async function patch(endpoint, headers, body) {
    const options = { method: 'PATCH', headers: headers || {}, body: body };
    const response = await fetch(endpoint, options);
    if (response.status == 200) {
        const json = await response.json();
        return json;
    } else {
        const message = await response.text();
        throw new Error(response.status+ ' ' + response.statusText + ' ' + message);
    }
}


async function mydelete(endpoint, headers) {
    
  return new Promise(function (resolve, reject) {

    request.delete({
      url: endpoint,
      headers: headers
       
    },
      function (error, response, body) {

        if (error) {
            resolve(false);  
        } else {
           resolve(true)  
        }
      }); 
  }); 
}



module.exports = {
    get,
    post,
    put,
    patch,
    mydelete,
    fileStreamGet
};