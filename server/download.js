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

const fs = require("fs")
const mkdir = require('mkdirp')
const utility = require("./utility")  
const mcMSServices = require('./services/mc.modelset.services')
const mcClashServices = require('./services/dc.services');

const clashDataFolder = './ClashData/'

var DataNameEnum = {
  MS_VERSIONS: 'modelset-version.json',
  CLASH_TESTS: 'clash-tests.json',
  SCOPE_INSTANCE: 'scope-version-clash-instance.2.0.0.json.gz',
  SCOPE_CLASH: 'scope-version-clash.2.0.0.json.gz',
  SCOPE_DOCUMENTS: 'scope-version-document.2.0.0.json.gz',
  CLASH_ISSUES: 'clash-issues.json',
  DOCUMENTS_MAP:'documents-map.json' 
};

if(!fs.existsSync(clashDataFolder))
  mkdir.mkdirp(clashDataFolder,(err)=>{if(!err)console.log('folder ./ClashData/ is created')})
const statusFolder = './Status/'
if(!fs.existsSync(statusFolder))
  mkdir.mkdirp(statusFolder,(err)=>{if(!err)console.log('folder ./Status/ is created')})
  
module.exports = { 
  prepareClashData: prepareClashData,
  buildDocsMap: buildDocsMap,
  getRawClashData: getRawClashData,
  getDocsMap: getDocsMap, 
  getBreakdownData: getBreakdownData,
  getMatrixData:getMatrixData
}

async function prepareClashData(input, jobId) { 

  try {
    const mc_container_id  = input.mc_container_id
    const ms_id = input.ms_id
    const ms_v_id = input.ms_v_id

    //create a folder to store the clash data for this modelset version
    const thisClashVersionFolder = clashDataFolder + mc_container_id + '/'+ ms_id + '/' + ms_v_id + '/'
    if (!fs.existsSync(thisClashVersionFolder)){
      fs.mkdirSync(thisClashVersionFolder, { recursive: true })
    }  

    //the data will be produced if it is missing.. 
    await getModelSetVersionData(thisClashVersionFolder,input)
    await getClashData(thisClashVersionFolder,input)
    await buildDocsMap(thisClashVersionFolder) 

    utility.storeStatus(jobId, 'succeeded')

  }
  catch (ex) {
    console.log(ex.toString())
    utility.storeStatus(jobId, 'failed')
  }

}
 
async function getModelSetVersionData(folder,input){ 

  if(fs.existsSync(folder + DataNameEnum.MS_VERSIONS)) { 
    //model version  info is available 
    console.log(DataNameEnum.MS_VERSIONS + ' are available at' + folder) 
  }else{
      //get versions info of one specific model set 
      const msversions = await mcMSServices.getModelSetVersion(input)
      await utility.saveJsonObj(folder, DataNameEnum.MS_VERSIONS, msversions) 
      console.log(DataNameEnum.MS_VERSIONS + ' downloaded at ' + folder ) 
   } 
} 

async function getClashData(folder,input){ 
   
  if(fs.existsSync(folder + DataNameEnum.CLASH_TESTS) &&
     fs.existsSync(folder + DataNameEnum.SCOPE_DOCUMENTS)&&  
     fs.existsSync(folder + DataNameEnum.SCOPE_INSTANCE)&&
     fs.existsSync(folder + DataNameEnum.SCOPE_CLASH)){
     //all clash data are available
     console.log('  all clash data are available at' + folder) 

     return
   }

  const clashTestsRes = await mcClashServices.getClashTests(input) 
  //one model set version with one clash test
  const oneTest = clashTestsRes.tests.filter(function (item) {
    return item.modelSetVersion === parseInt(input.ms_v_id);
  })

  // one clash test data
  if (oneTest && oneTest.length > 0) {
    
    await utility.saveJsonObj(folder, 'clash-tests.json', oneTest) 
    console.log(DataNameEnum.CLASH_TESTS + ' downloaded at ' + folder ) 

    let testid = oneTest[0].id
    input.testid = testid
    let testRes = await mcClashServices.getClashTestResources(input)
    for (let index in testRes.resources) {
      let resurl = testRes.resources[index].url
      let headers = testRes.resources[index].headers
      let filename = testRes.resources[index].type + '.'+ testRes.resources[index].extension
      let downloadRes = await utility.downloadResources(resurl, headers, folder, filename)
      console.log(' Clash data downloaded at ' + folder ) 
    }
  } 
}


//build map with document displayname, index string and clash document id 
async function buildDocsMap(folder) {
 
  if(fs.existsSync(folder + DataNameEnum.DOCUMENTS_MAP)){
    //document map  is available
    console.log(DataNameEnum.DOCUMENTS_MAP + ' are available at' + folder) 
    return    
  }  

  const msversionsBuffer = fs.readFileSync(folder + DataNameEnum.MS_VERSIONS)
  const msversionsJson = JSON.parse(msversionsBuffer)

  const successDocs = msversionsJson.documentVersions.filter(function (data) {
    return data.documentStatus === 'Succeeded'
  })  
 
  const clashDocumentBuffer = fs.readFileSync(folder + DataNameEnum.SCOPE_DOCUMENTS)
  const clashDocumentJson = JSON.parse(clashDocumentBuffer).documents

  let doc_map = []
  let successMap = true

  for (let i in successDocs) {

    let oneItem = {}
     //docNamePair is modelset version detail info
    //it contains display name, version urn and other data
    const docName = successDocs[i].displayName  
    oneItem.name = docName
    oneItem.versionUrn = successDocs[i].versionUrn
    oneItem.viewableGuid = successDocs[i].viewableGuid
    oneItem.viewableId = successDocs[i].viewableId
    oneItem.lineageUrn = successDocs[i].documentLineage.lineageUrn

    const buff = new Buffer.from(successDocs[i].bubbleUrn);
    oneItem.urn = 'urn:' + buff.toString('base64').replace('/', '_').trim('=').split('=').join('')
   
    //map clash doc id (in number) with the document 
    let filter = clashDocumentJson.filter(
      function (data) {
        return data.urn === successDocs[i].versionUrn
      }
    );
    if (filter && filter.length > 0)
        oneItem.clashDocId = filter[0].id
    else {
      console.log(docName + ' clash document id is not found')
      successMap = false
      break
    }

    doc_map.push(oneItem)
  }

  if (successMap) {
    await utility.saveJsonObj(folder, DataNameEnum.DOCUMENTS_MAP, doc_map)
    console.log(DataNameEnum.DOCUMENTS_MAP + ' downloaded at ' + folder ) 
    return doc_map
  }
  else
    console.log(DataNameEnum.DOCUMENTS_MAP + ' FAILED at ' + folder )  
    return null
}

 
function getDocsMap(mc_container_id,ms_id, ms_v_id) {
  try {
    const thisClashVersionFolder = clashDataFolder + mc_container_id + '/'+ ms_id + '/' + ms_v_id + '/'
    if (!fs.existsSync(thisClashVersionFolder))
      return null

    const docsMapBuffer = fs.readFileSync(thisClashVersionFolder + DataNameEnum.DOCUMENTS_MAP)
    const docsMapObj = JSON.parse(docsMapBuffer)

    return docsMapObj
  }
  catch (ex) {
    return null
  }
}

function getRawClashData(mc_container_id,ms_id, ms_v_id) { 
  try {
    const thisClashVersionFolder = clashDataFolder + mc_container_id + '/'+ ms_id + '/' + ms_v_id + '/'
    if (!fs.existsSync(thisClashVersionFolder))
      return null

    var clashInstanceBuffer = fs.readFileSync(thisClashVersionFolder + DataNameEnum.SCOPE_INSTANCE)
    var clashInsJsonObj = JSON.parse(clashInstanceBuffer)

    var clashBuffer = fs.readFileSync(thisClashVersionFolder + DataNameEnum.SCOPE_CLASH)
    var clashJsonObj = JSON.parse(clashBuffer)

    var testBuffer = fs.readFileSync(thisClashVersionFolder + DataNameEnum.CLASH_TESTS)
    var testJsonObj = JSON.parse(testBuffer) 

    //send compressed data
    const inputJson = { testJsonObj:testJsonObj,clashInsJsonObj: clashInsJsonObj, clashJsonObj: clashJsonObj }
    const compressedStreaming = utility.compressStream(inputJson)

    return compressedStreaming
  }
  catch (ex) {
    return null
  }
} 


function getBreakdownData(mc_container_id,ms_id, ms_v_id) {

  try {
    const thisClashVersionFolder = clashDataFolder + mc_container_id + '/' + ms_id + '/' + ms_v_id + '/'
    if (!fs.existsSync(thisClashVersionFolder))
      return null 

    const clashInstanceBuffer = fs.readFileSync(thisClashVersionFolder + DataNameEnum.SCOPE_INSTANCE)
    const clashInsJsonObj = JSON.parse(clashInstanceBuffer).instances

  
    var breakDic = {}
    for (var index in clashInsJsonObj) {
      var eachItem = clashInsJsonObj[index];

      var Ldid = eachItem.ldid
      var Rdid = eachItem.rdid
      var Lvid = eachItem.lvid
      var Rvid = eachItem.rvid 

      if (Ldid in breakDic) {
        if (Lvid in breakDic[Ldid]) {
          if (Rdid in breakDic[Ldid][Lvid]) {
            breakDic[Ldid][Lvid][Rdid].push(Rvid)
          } else {
            breakDic[Ldid][Lvid][Rdid] = []
            breakDic[Ldid][Lvid][Rdid].push(Rvid)
          }

        } else {
          breakDic[Ldid][Lvid] = {}
          breakDic[Ldid][Lvid][Rdid] = []
          breakDic[Ldid][Lvid][Rdid].push(Rvid)
        }
      } else {
        breakDic[Ldid] = {};
        breakDic[Ldid][Lvid] = {}

        breakDic[Ldid][Lvid][Rdid] = []
        breakDic[Ldid][Lvid][Rdid].push(Rvid)
      }

      if (Rdid in breakDic) {
        if (Rvid in breakDic[Rdid]) {
          if (Ldid in breakDic[Rdid][Rvid]) {
            breakDic[Rdid][Rvid][Ldid].push(Lvid)
          } else {
            breakDic[Rdid][Rvid][Ldid] = []
            breakDic[Rdid][Rvid][Ldid].push(Lvid)
          }

        } else {
          breakDic[Rdid][Rvid] = {}
          breakDic[Rdid][Rvid][Ldid] = []
          breakDic[Rdid][Rvid][Ldid].push(Lvid)
        }
      } else {
        breakDic[Rdid] = {};
        breakDic[Rdid][Rvid] = {}
        breakDic[Rdid][Rvid][Ldid] = []
        breakDic[Rdid][Rvid][Ldid].push(Lvid)
      }
    } 
    const compressedStreaming =  utility.compressStream(breakDic) 
    return compressedStreaming
  }
  catch (ex) {
    return null
  }
} 

function getMatrixData(mc_container_id,ms_id, ms_v_id, ignoredAssinedClash) {

  try {
    const thisClashVersionFolder = clashDataFolder + mc_container_id + '/'+ ms_id + '/' + ms_v_id + '/'
    if (!fs.existsSync(thisClashVersionFolder))
      return null

    var clashInstanceBuffer = fs.readFileSync(thisClashVersionFolder + DataNameEnum.SCOPE_INSTANCE)
    var clashInsJsonObj = JSON.parse(clashInstanceBuffer).instances
 
    const docsMapBuffer = fs.readFileSync(thisClashVersionFolder + DataNameEnum.DOCUMENTS_MAP)
    const docsMapObj = JSON.parse(docsMapBuffer)

    var dic = {}

    for (var index in clashInsJsonObj) {
 
      var eachItem = clashInsJsonObj[index];

      var did_pair = eachItem.ldid + '-' + eachItem.rdid

      if (did_pair in dic) {
        if (eachItem.lvid in dic[did_pair]['left']) {
          dic[did_pair]['left'][eachItem.lvid]++
        }
        else {
          dic[did_pair]['left'][eachItem.lvid] = 1
        }
        if (eachItem.rvid in dic[did_pair]['right']) {
          dic[did_pair]['right'][eachItem.rvid]++
        }
        else {
          dic[did_pair]['right'][eachItem.rvid] = 1
        }
      } else {
        dic[did_pair] = {};
        dic[did_pair]['left'] = {}
        dic[did_pair]['left'][eachItem.lvid] = 1

        dic[did_pair]['right'] = {}
        dic[did_pair]['right'][eachItem.rvid] = 1
      }
    }

    let finalView = {}
    finalView.ignoredAssinedClash = ignoredAssinedClash
    finalView.matrixView = []
    for (let key in dic) {
      //the key is built as ldid-rdid. get out ldid and rdid, and find their document names
      const ldid = parseInt(key.split('-')[0])
      const rdid = parseInt(key.split('-')[1])

      let filter = docsMapObj.filter(function(data){
        return data.clashDocId === ldid
      })
      const leftDocName = filter[0].name

      const leftClashObjectCount = Object.keys(dic[key]['left']).length

      filter = docsMapObj.filter(function(data){
        return data.clashDocId === rdid
      })
      const rightDocName = filter[0].name
 
      const rightClashObjectCount = Object.keys(dic[key]['right']).length

      finalView.matrixView.push({
        leftDocName: leftDocName, rightDocName: rightDocName,
        leftClashObjectCount: leftClashObjectCount, rightClachObjectCount: rightClashObjectCount
      })
    }
    //small size of data, no need to compress
    return finalView
  }
  catch (ex) {
    return null
  }
}