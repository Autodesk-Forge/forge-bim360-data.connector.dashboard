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
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const config = require('../config')
const utility = require('../utility')

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
    //res.status(200).end()

    var allRequests = []
    allRequests = await dcServices.getRequests(hubId, allRequests)  
    //get jobs
    let promiseArr = allRequests.map(async (r, index) => {
      const reqId = r.id     
      console.log(`sorting one request ${reqId}`);

      if(r.description.includes('IQ Data Extraction')){
        r.description = 'Extraction by UI'
      }
      var allJobs =[]
      allJobs = await dcServices.getJobs(hubId,reqId,allJobs) 
      r.jobs = allJobs

      //data list of first job
      if(allJobs.length >0 ){
        r.data = r.serviceGroups
      }
      else{
        r.data = []
      }

      //complete date of first job
      if(allJobs.length >0 ){
        r.completedAt = allJobs[0].completedAt
      }
      else{
        r.completedAt = null
      } 
      
      //status of first job
      if(allJobs.length >0 ){
        r.status = allJobs[0].status
      }
      else{
        r.status = null
      }  
      return r
    })

    return Promise.all(promiseArr).then((resultsArray) => {
      console.log(`Promise.all sorting out assets done`); 
      resultsArray = utility.flatDeep(resultsArray, Infinity)
      res.json(resultsArray);
    }).catch(function (err) {
      console.error(`exception when Promise.all sorting out requests: ${err}`);
      res.json([]);
    })


    // utility.socketNotify(utility.SocketEnum.DC_TOPIC,
    //   utility.SocketEnum.EXPORT_REQUESTS_DONE,
    //   allRequests) 

    res.json(allRequests)
 
   } catch(e) {
      // here goes out error handler
      console.log('get all requests failed: '+ e.message)
      // utility.socketNotify(utility.SocketEnum.DC_TOPIC,
      //   utility.SocketEnum.DC_ERROR, {error:e.message})
      // }
      res.status(500).end()
   } 
});  

//create new request
router.post('/requests/:hubId', jsonParser,async (req, res, next) => {

  try {   
    const hubId = req.params['hubId']  
    let body = req.body 
    const createRes = await dcServices.postRequest(hubId,body) 
    if(createRes){
      res.end()
    }else{
      res.status(500).end()
    } 
 
   } catch(e) {
      // here goes out error handler
      console.log('create request failed: '+ e.message)
      res.status(500).end() 
    }
}); 

router.post('/requests/callback', async (req, res, next) => {
  //one job is done....
  res.end() //notify Forge this callback is triggered

  console.log('request callback is triggered!')
  

})

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

router.get('/requests/:hubId/:jobId', async (req, res, next) => {

  try {   
    const hubId = req.params['hubId']  
    const jobId = req.params['jobId']  
     const job = await dcServices.getOneJob(hubId, jobId)   
     res.json(job);

   } catch(e) {
      // here goes out error handler
      console.log('get one job failed: '+ e.message)
      res.status(500).end() 
    }
});  
 
 
module.exports =  router 
 

