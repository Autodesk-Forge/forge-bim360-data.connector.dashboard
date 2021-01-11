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
      'issues-issues.csv',
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

  configData(dataKey,data){

    if(dataKey == 'issues-issues.csv'){

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