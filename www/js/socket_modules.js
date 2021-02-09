const SocketEnum = {
  DC_TOPIC: 'dc topic',
  EXPORT_HUBS_DONE:'export hubs done',
  EXPORT_REQUESTS_DONE:'export requests done',
  ONE_TIME_JOB_CREATED:'job of one_time type is available',
  CALLBACK_DONE: 'callback done',
  DC_ERROR:'dc errors'
};  

const HOST_URL =  window.location.host; 
socketio = io(HOST_URL);
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
        var request = global_DataConnector._data['requestsTable'].
                          find(x=>x.id==jsonData.data.id)
                         
        //refresh the specific request with jobs list
        if(request){
            request.jobs = jsonData.data.jobs
            request.completedAt = jsonData.data.completedAt
            request.status = jsonData.data.status

             //refresh table view of requests
            global_DataConnector.refreshRequestsTable(global_DataConnector._data['requestsTable'])
        } 
        break;
    case SocketEnum.DC_ERROR: 
       
    $('.req_progress').hide();

      console.log('problem with the process')
      break; 
  }

})