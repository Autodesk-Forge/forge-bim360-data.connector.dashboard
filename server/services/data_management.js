/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

'use strict';
const config = require('../config')
const utility = require('../utility')
const { get } = require('./fetch_common')

module.exports = {
  getHubs,
  getUserProfile,
  getAdminUsersList,
  getAdminCompanyList
}

async function getHubs(allHubs) {

  try {
    const endpoint = config.endpoints.bim360DM.get_hubs + `?limit=${limit}&offset=${offset}`
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`get hubs succeeded`)
      allRequests = allRequests.concat(response.results);
      return getRequests(hubId, allRequests, response.results);
    } else {
      return allRequests
    }
  } catch (e) {
    console.error(`all requests of  ${hubId} failed: ${e}`)
    return []
  }


  var hubsAPI = new forgeSDK.HubsApi();
  hubsAPI.getHubs({}, input.oAuth, input.credentials)
    .then((response) => {
      console.log('get hubs succeeded!');
      var hubs = [];
      response.body.data.forEach(function (hub) {
        var hubType;
        switch (hub.attributes.extension.type) {
          case "hubs:autodesk.core:Hub":
            hubType = "hubs";
            break;
          case "hubs:autodesk.a360:PersonalHub":
            hubType = "personalHub";
            break;
          case "hubs:autodesk.bim360:Account":
            hubType = "bim360Hubs";
            break;
        }
        if (hubType == "bim360Hubs") {
          hubs.push({ id: hub.id, name: hub.attributes.name })
        }
      });
      resolve(hubs);
    })
    .catch(function (error) {
      console.log('get BIM hubs failed!');
      reject({ error: error });
    });
})
}

async function getUserProfile(input) {

  const headers = config.hqv1.httpHeaders(input.credentials.access_token)
  const endpoint = config.hqv1.getUserProfileAtMe()
  const options = { method: 'GET', headers: headers || {} };
  const response = await fetch(endpoint, options);
  if (response.status == 200) {
    const json = await response.json();
    return {
      name: json.firstName + ' ' + json.lastName,
      picture: json.profileImages.sizeX20,
      userId: json.userId
    }
  } else {
    const message = await response.text();
    console.log('get getUserProfile failed' + message)
    return null
  }
}

async function getHQUsersList(input) {
  let all = []
  let pageOffset = 0
  let morePagesAvailable = true;

  while (morePagesAvailable) {
    const single = await getAdminUserSinglePage(input, pageOffset)
    all = all.concat(single);
    pageOffset = all.length
    morePagesAvailable = single.length
  }

  return all
}


async function getAdminUserSinglePage(input, pageOffset) {

  return new Promise((resolve, reject) => {

    const headers = {
      Authorization: 'Bearer ' + input.access_token,
      'Content-Type': 'application/json'
    }
    var url =
      'https://developer.api.autodesk.com/hq/v1/accounts/'
      + input.accountId
      + '/users?limit=50&offset=' + pageOffset

    return fetch(url, {
      method: 'GET',
      headers: headers
    }).then(response => response.json()).then(data => {
      resolve(data)
    })
  })
}

async function getAdminCompanyList(input) {
  let all = []
  let pageOffset = 0
  let morePagesAvailable = true;

  while (morePagesAvailable) {
    const single = await getAdminCompanySinglePage(input, pageOffset)
    all = all.concat(single);
    pageOffset = all.length
    morePagesAvailable = single.length
  }

  return all
}

async function getAdminCompanySinglePage(input, pageOffset) {

  return new Promise((resolve, reject) => {

    const headers = {
      Authorization: 'Bearer ' + input.access_token,
      'Content-Type': 'application/json'
    }
    var url =
      'https://developer.api.autodesk.com/hq/v1/accounts/'
      + input.accountId
      + '/companies?limit=50&offset=' + pageOffset

    return fetch(url, {
      method: 'GET',
      headers: headers
    }).then(response => response.json()).then(data => {
      resolve(data)
    })
  })
}





