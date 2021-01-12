class DataDashboard {

  constructor() {

    this._data = {
      stat_left: [],
      stat_right: [] 
    }
    this._view = {
      stat_left_view:null,
      stat_right_view:null 
    }
    this._dashboardDefs =[
      'issues_issues.csv',
      'admin_users.csv',
      'checklists_checklists.csv'
    ]
  }

   destoryAllViews(){
    if(this._view.stat_left_view)
      this._view.stat_left_view.destroy();
    if(this._view.stat_right_view)
      this._view.stat_right_view.destroy();
  } 

  async getRenderHTML(html) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: html,
        success: function (data) {
          resolve(data)
        }, error: function (error) {
          reject(error)
        }
     }) 
  })}

  async configData(hubId,jobId,dataKey){

    const data = await global_DataConnector.getOneDataStream(hubId,jobId,dataKey)
    var csvData = $.csv.toObjects(data)

    if(dataKey == 'issues_issues.csv'){

      //add tabs, each tab one chart 
      const issueDashboardHTML = await this.getRenderHTML('issue_dashboard.html')
      $('#dashboard').html( issueDashboardHTML) 
      //some definitions data
      const adminUsers = await global_DataConnector.getOneDataStream(hubId,jobId,'admin_users.csv')
      const csvAdminUsers = $.csv.toObjects(adminUsers)

      const adminProjects = await global_DataConnector.getOneDataStream(hubId,jobId,'admin_projects.csv')
      const csvAminProjects = $.csv.toObjects(adminProjects)

      const issueTypes = await global_DataConnector.getOneDataStream(hubId,jobId,'issues_issue_types.csv')
      const csvIssueTypes = $.csv.toObjects(issueTypes)

      //map meaningful name of issue type

      csvData = csvData.map(function(a) {
        a.issue_type_name =  csvIssueTypes.find(x=>x.issue_type_id == a.type_id ).issue_type
        return a;
      });

      //grouped by projects
      var issues =[]
      csvAminProjects.forEach(async p=>{
         const bim360_project_id = p.id
         const currentTime = (new Date()).getTime()
         const one_project_issues = csvData.filter(x=>x.bim360_project_id == bim360_project_id)
         //find overdue and not-closed issues
         var overDue_OpenIssues = one_project_issues.filter(
           x=>x.due_date!=null 
           && x.due_date!=undefined
           && x.due_date!=''
           && new Date(x.due_date).getTime() < currentTime
           && x.status != 'close')
        //find issues due in this week
        const weekDueStart = new Date()
        var dateAtOneWeek = weekDueStart; 
        dateAtOneWeek.setDate(dateStart.getDate() + 7);
        dateAtOneWeek = dateAtOneWeek.getTime();

        var due_thisWeek_Issues = one_project_issues.filter(
          x=>x.due_date!=null 
          && x.due_date!=undefined
          && x.due_date!=''
          && new Date(x.due_date).getTime() > currentTime && new Date(x.due_date).getTime() < dateAtOneWeek
          && x.status != 'close')

         issues.push({
           project_id:bim360_project_id,
           project_name:p.name,
           project_issues_count:one_project_issues.length,
           overdue_issues_count:overDue_OpenIssues.length,
           due_thisWeek_issues_count:due_thisWeek_Issues,
           issue_types:[]
        })                     
      })
      //issue by projects, sorting the top 10 projects by issues count
      issues.sort(function(a, b){
        return b.project_issues.length - a.project_issues.length;
      });





      //top overdue projects
      issues.sort(function(a, b){
        return b.bim360_project_issues.length - a.bim360_project_issues.length;
      });


      //issue due this week

    }else if(dataKey == 'admin_users.csv'){

    }else if(dataKey == 'checklists_checklists.csv'){

    }

  }
  refresh_stat_left(userData,config) {

     var labels = [], data_map = {}, dataTotals = [], colors = [];
 
    userData.forEach(async u => {
      if (u[config.property] in data_map)
        data_map[u[config.property]]++
      else
        data_map[u[config.property]] = 1
    }); 

    for (var d in data_map) {
      labels.push(d);
      dataTotals.push(data_map[d]);
      colors.push(this.random_rgba())
    }

    var chartData = {
      datasets: [{
        data: dataTotals,
        backgroundColor: colors
      }],
      labels: labels
    };

    var config = {
      type: config.type,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,

        title: {
          display: true,
          text: config.title
        },
        tooltips: {
          mode: 'index',
          intersect: true
        },
        legend: {
          display: true
        },
        plugins: {
          datalabels: {
            display: true,
            align: 'center',
            anchor: 'center'
          }
        }
      }
    }

    var canvas = document.getElementById('stat_one');
    var ctx = canvas.getContext('2d');
    this._view.stat_one_view = new Chart(ctx, config);
    this._view.stat_one_view.update();
  }

  refresh_stat_right(userData, config) {

    var labels = [], data_map = {}, dataTotals = [], colors = [];

    userData.forEach(async u => {
      if (u[config.property] in data_map)
        data_map[u[config.property]]++
      else
        data_map[u[config.property]] = 1
    }); 
    for (var d in data_map) {
      labels.push(d);
      dataTotals.push(data_map[d]);
      colors.push(this.random_rgba())
    }

    var chartData = {
      datasets: [{
        data: dataTotals,
        backgroundColor: colors
      }],
      labels: labels
    };

    var config = {
      type: config.type,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,

        title: {
          display: true,
          text: config.title
        },
        tooltips: {
          mode: 'index',
          intersect: true
        },
        legend: {
          display: true
        },
        plugins: {
          datalabels: {
            display: true,
            align: 'center',
            anchor: 'center'
          }
        }
      }
    }

    var canvas = document.getElementById('stat_two');
    var ctx = canvas.getContext('2d');
    this._view.stat_two_view = new Chart(ctx, config);
    this._view.stat_two_view.update();
  }

  random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 0.5 + ')';
  }


}