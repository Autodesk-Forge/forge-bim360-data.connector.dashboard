class DataConnector {

  constructor() {

    this._dcTable = null
    this._pageLimit = 25
    this._pageOffset = 0
    this._data = {
      requestsTable: []
    }

    this._tableFixComlumns = {
      parent: this,
      requestsTable: function (isRaw) {
        return [
          { field: 'description', title: "description", align: 'left' },

          { field: 'scheduleInterval', title: "schedule", align: 'center' },
          { field: 'reoccuringInterval', title: "interval", align: 'center' },
          { field: 'createdAt', title: "created time", align: 'center' },
          { field: 'effectiveTo', title: "effective to", align: 'center' },

          { field: 'jobs', title: "jobs", align: 'center', formatter: this.parent.droplistFormatter },
          { field: 'completedAt', title: "job completedAt", align: 'left' },
          { field: 'status', title: "job status", align: 'center'},
          { field: 'serviceGroups', title: "service groups", align: 'center', formatter: this.parent.dataFormatter },
          { field: 'createdByEmail', title: "createdByEmail", align: 'center' },
          { field: 'isActive', title: "isActive", align: 'center' }


        ]
      }
    }
  }


  droplistFormatter(value, row, index) { 
    var $select = $(`<select id="${row.id}" data="${index}"></select>`, {
    });
    value.forEach(async element => {
      var $option = $("<option></option>", {
          "text": `startedAt:${element.startedAt}`,
          "value": `${element.id}|${index}`
      }); 
      $select.append($option);
    });
    return $select.prop("outerHTML"); 
  }
  
  dataFormatter(value, row, index) {

    //when initialization, set data list to the data of first job
    //var jobData = JSON.parse(value);

    // var $select = $(`<select></select>`, {
    // });
    // jobData.forEach(async element => {
    //   var $option = $("<option></option>", {
    //       "text": `${element.name}`,
    //       "value": element.key
    //   }); 
    //   $select.append($option);
    // });
    // return $select.prop("outerHTML"); 
    var re = ``
    value.forEach(async element => { 
        re += `<a href="${element}" data=${element}>${element}</a>&nbsp|&nbsp`;
      }); 
  
    return re
  } 

  async refreshRequestsTable(hubId,domId, isRaw = false){
    try { 
      $('.clsInProgress').show(); 
      const requests = await this.getRequests(hubId)
      this._data[domId] = requests
      //refresh table

      $(`#${domId}`).bootstrapTable('destroy'); 

      const fixCols = this._tableFixComlumns[domId](isRaw)

      $(`#${domId}`).bootstrapTable({
        data: requests,
        editable: false,
        clickToSelect: true,
        cache: false,
        showToggle: false,
        showPaginationSwitch: true,
        pagination: true,
        pageList: [5, 10, 25, 50, 100],
        pageSize: 5,
        pageNumber: 1,
        uniqueId: 'id',
        striped: true,
        search: true,
        showRefresh: true,
        minimumCountColumns: 2,
        smartDisplay: true,
        columns: fixCols,
        sortName:'createdAt'
        // onPageChange: async ( number, size)=> {
        //   await this.parent.getAssets(accountId_without_b,projectId_without_b,projectName,size,number*size*2)
  
        // }
      });

      //delegate event of switch one job
      this.delegateJobsEvents() 

      $('.clsInProgress').hide(); 

    }catch(e){
      $('.clsInProgress').hide(); 

    }
  }

  initTable(domId,isRaw) {
    $(`#${domId}`).bootstrapTable('destroy');
    const columns  = this._tableFixComlumns[domId](isRaw)
    $(`#${domId}`).bootstrapTable({
      parent:this,
      data: [],
      title:domId,
      editable: false,
      clickToSelect: true,
      cache: false,
      showToggle: false,
      showPaginationSwitch: true,
      pagination: true,
      pageList: [5, 10, 25, 50, 100],
      pageSize: 10,
      pageNumber: 1,
      uniqueId: 'id',
      striped: true,
      search: true,
      showRefresh: true,
      minimumCountColumns: 2,
      smartDisplay: true,
      columns: columns 
    });
  }


  async getRequests(hubId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/dc/requests/${hubId}`,
        type: 'GET',
        success: function (res) {
          if (res != null && res != [])
            resolve(res)
          else
            resolve(null)
        }
      })
    })
  }

  async getOneJob(hubId,jobId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/dc/requests/${hubId}/${jobId}`,
        type: 'GET',
        success: function (res) {
          if (res != null && res != [])
            resolve(res)
          else
            resolve(null)
        }
      })
    })
  }

  async createRequest(hubId,body) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/dc/requests/${hubId}`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(body),
        success: function (res) {
          if (res != null && res != [])
            resolve(res)
          else
            resolve(null)
        },
        error: function (res) { 
          resolve(null);
        }
      })
    })
  }

  delegateJobsEvents(){
    $(document).on('change', 'select',  function(e) {
       const selectedIndex = $(this)[0].selectedIndex
       const reqId = $(this)[0].id
       const value = $(this)[0].options[selectedIndex].value
       const jobId = value.split('|')[0]
       const rowIndex = value.split('|')[1]

       //job complete at
       //this._data['requestsTable'] stores the data already
       const request = global_DataConnector._data['requestsTable'].find(
         d=>d.id == reqId
       )
       const job = request.jobs.find(
        d=>d.id == jobId
       )  

       var $table = $('#requestsTable')
       $table.bootstrapTable('updateCell', {
        index: rowIndex,
        field: 'completedAt',
        value: job.completedAt
      })
       //job status
       var $table = $('#requestsTable')
       $table.bootstrapTable('updateCell', {
        index: rowIndex,
        field: 'status',
        value: job.status
      })
    })
 
  }

} 