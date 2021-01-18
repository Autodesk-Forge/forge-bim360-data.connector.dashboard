const SocketEnum = {
  DC_TOPIC: 'dc topic',
  EXPORT_HUBS_DONE:'export hubs done',
  EXPORT_REQUESTS_DONE:'export requests done',
  ONE_TIME_JOB_CREATED:'job of one_time type is available',
  CALLBACK_DONE: 'callback done',
  DC_ERROR:'dc errors'
};  

socketio = io('http://localhost:3000');
socketio.on(SocketEnum.DC_TOPIC, async (d) => {

  const jsonData = JSON.parse(d) 

  switch (jsonData.message) {
    case SocketEnum.EXPORT_REQUESTS_DONE: 
      //refresh the data
      global_DataConnector._data['requestsTable'] = jsonData.data 
      //refresh the table view
      global_DataConnector.refreshRequestsTable(jsonData.data)

      $('.req_progress').hide();

      console.log('export requests done')
      break;
    case SocketEnum.ONE_TIME_JOB_CREATED:  
        console.log('job of one_time type is available')

        break;
    case SocketEnum.DC_ERROR: 
       
    $('.req_progress').hide();

      console.log('problem with the process')
      break; 
  }

})