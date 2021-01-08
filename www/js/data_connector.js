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
          { field: 'isActive', title: "isActive", align: 'center' },

          { field: 'scheduleInterval', title: "schedule", align: 'center' },
          { field: 'reoccuringInterval', title: "interval", align: 'center' },
          { field: 'createdAt', title: "created time", align: 'center' },

          { field: 'jobs', title: "jobs", align: 'left', formatter: this.parent.droplistFormatter },
          { field: 'status', title: "status", align: 'center'},
          { field: 'serviceGroups', title: "service groups", align: 'left', formatter: this.parent.dataFormatter },
          { field: 'createdByEmail', title: "createdByEmail", align: 'center' },

          { field: 'effectiveTo', title: "effective to", align: 'center' }

        ]
      }
    }
  }


  droplistFormatter(value, row, index) { 
    var $select = $(`<select></select>`, {
    });
    value.forEach(async element => {
      var $option = $("<option></option>", {
          "text": `completedAt:${element.completedAt}`,
          "value": element.id
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
        columns: fixCols//,
        // onPageChange: async ( number, size)=> {
        //   await this.parent.getAssets(accountId_without_b,projectId_without_b,projectName,size,number*size*2)
  
        // }
      });

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

}