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

const express = require('express');
const router = express.Router(); 
const fs = require("fs"); 
const config = require('../config')

const { OAuth } = require('../services/oauth')
const dcServices = require('../services/data_connector'); 

router.use(async (req, res, next) => {
  const oauth = new OAuth(req.session);
  if (!oauth.isAuthorized()) {
    console.log('no valid authorization!')
    res.status(401).end('Please login first')
    return
  }
  req.oauth_client = oauth.getClient();
  req.oauth_token = await oauth.getInternalToken();
  var twoleggedoauth = oauth.get2LeggedClient()
  var twoleggedres = await twoleggedoauth.authenticate()
  config.credentials.token_3legged = req.oauth_token.access_token
  config.credentials.token_2legged = twoleggedres.access_token

  next();
}); 


router.get('/requests/:hubId', async (req, res, next) => {

  try {   
    const hubId = req.params['hubId']  
    res.status(200).end()

    var allRequests = []
    allRequests = await dcServices.getRequests(hubId, allRequests)  
    utility.socketNotify(utility.SocketEnum.DC_TOPIC,
      utility.SocketEnum.EXPORT_REQUESTS_DONE,
      allRequests) 
 
   } catch(e) {
      // here goes out error handler
      console.log('get all requests failed: '+ e.message)
      utility.socketNotify(utility.SocketEnum.DC_TOPIC,
        utility.SocketEnum.DC_ERROR, {error:e.message})
      }
});  

router.get('/requests/:hubId/:reqId', async (req, res, next) => {

  try {   
    const hubId = req.params['hubId']  
    const reqId = req.params['reqId']  

    

    res.status(200).end()

    var allRequests = []
    allRequests = await dcServices.getRequests(hubId, allRequests)  
    utility.socketNotify(utility.SocketEnum.DC_TOPIC,
      utility.SocketEnum.EXPORT_REQUESTS_DONE,
      allRequests) 
 
   } catch(e) {
      // here goes out error handler
      console.log('get all requests failed: '+ e.message)
      utility.socketNotify(utility.SocketEnum.DC_TOPIC,
        utility.SocketEnum.DC_ERROR, {error:e.message})
      }
});  
 
module.exports =  router 
 

