// const global_oAuth = new oAuth()
// const global_dmProjects = new DMProjects()  
// const global_msSet = new MSSet()
// const global_clashRawView= new ClashRawView() 
// const global_clashBreakdownView= new ClashBreakdownView()
// const global_clashMatrixView= new ClashMatrixView()  
// const global_ClashPDF = new ClashPDF() 
// const global_forgeViewer= new ForgeViewer()
// const global_navHelp= new NavHelp()
// const global_Utility = new Utility()



function random_rgba() {
  var o = Math.round, r = Math.random, s = 255;
  return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 0.5 + ')';
}

var randomScalingFactor = function() {
  return Math.round(Math.random() * 100);
};

var config1 = {
  type: 'pie',
  data: {
    datasets: [{
      data: [
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
      ] ,
      backgroundColor:[random_rgba(),random_rgba(),random_rgba(),random_rgba(),random_rgba()],
      label: 'Dataset 1'
    }],
    labels: [
      'Red',
      'Orange',
      'Yellow',
      'Green',
      'Blue'
    ]
  },
  options: {
    responsive: true
  }
};

var config2 = {
  type: 'bar',
  data: {
    datasets: [{
      data: [
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
      ] ,
      backgroundColor:[random_rgba(),random_rgba(),random_rgba(),random_rgba(),random_rgba()],
      label: 'Dataset 2'
    }],
    labels: [
      'Red',
      'Orange',
      'Yellow',
      'Green',
      'Blue'
    ]
  },
  options: {
    responsive: true
  }
};


var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		var config3 = {
			type: 'line',
			data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [{
					label: 'My First dataset',
					backgroundColor: random_rgba(),
					borderColor: random_rgba(),
					data: [
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor()
					],
					fill: false,
				}, {
					label: 'My Second dataset',
					fill: false,
					backgroundColor: random_rgba(),
					borderColor: random_rgba(),
					data: [
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor()
					],
				}]
			},
			options: {
				responsive: true,
				title: {
					display: true,
					text: 'Chart.js Line Chart'
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: false,
							labelString: 'Month'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Value'
						}
					}]
				}
			}
		};

     
		var chartColors = random_rgba();
    var color = Chart.helpers.color;		var config4 = {
			data: {
				datasets: [{
					data: [
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
					],
					backgroundColor: [
            random_rgba(),
            random_rgba(),
            random_rgba(),
            random_rgba(),
            random_rgba()
					],
					label: 'My dataset' // for legend
				}],
				labels: [
					'Red',
					'Orange',
					'Yellow',
					'Green',
					'Blue'
				]
			},
			options: {
				responsive: true,
				legend: {
					position: 'right',
				},
				title: {
					display: true,
					text: 'Chart.js Polar Area Chart'
				},
				scale: {
					ticks: {
						beginAtZero: true
					},
					reverse: false
				},
				animation: {
					animateRotate: false,
					animateScale: true
				}
			}
		};
$(document).ready(function () {


  var canvas = document.getElementById('stat_1');
  var ctx = canvas.getContext('2d');
  var v = new Chart(ctx, config1);
  v.update();

  canvas = document.getElementById('stat_2');
  ctx = canvas.getContext('2d');
  v = new Chart(ctx, config2);
  v.update();

  canvas = document.getElementById('stat_3');
  ctx = canvas.getContext('2d');
  v = new Chart(ctx, config3);
  v.update();

  canvas = document.getElementById('stat_4');
  ctx = canvas.getContext('2d');
  v = new Chart.PolarArea(ctx, config4);
  v.update();

 
  canvas = document.getElementById('stat_5');
  ctx = canvas.getContext('2d');
  v = new Chart(ctx, config2);
  v.update();

  canvas = document.getElementById('stat_6');
  ctx = canvas.getContext('2d');
  v = new Chart(ctx, config4);
  v.update();

  canvas = document.getElementById('stat_7');
  ctx = canvas.getContext('2d');
  v = new Chart(ctx, config1);
  v.update();

  canvas = document.getElementById('stat_8');
  ctx = canvas.getContext('2d');
  v = new Chart(ctx, config3);
  v.update();

  // $('#iconlogin').click(global_oAuth.forgeSignIn);

  // var currentToken = global_oAuth.getForgeToken(); 

  // if (currentToken === '')
  //   $('#signInButton').click(global_oAuth.forgeSignIn); 
  // else {
  //   (async()=>{
  //     let profile = await global_oAuth.getForgeUserProfile() 
      
  //     $('#signInProfileImage').removeClass();  
  //     $('#signInProfileImage').html('<img src="' + profile.picture + '" height="30"/>')
  //     $('#signInButtonText').text(profile.name);
  //     $('#signInButtonText').attr('title', 'Click to Sign Out');
  //     $('#signInButton').click(global_oAuth.forgeLogoff); 
    
  //     let r = await global_dmProjects.refreshBIMHubs()
  //     if(!r)
  //       return
      
  //     //delegate the event when one hub is selected
  //     delegateHubSelection()
  //     //delegate the event when one project is selected
  //     delegateProjectSelection() 
  //     //delegate the event when one modelset is selected 
  //     delegateModelsetSelection()
  //     //delegate the event when one table item is selected
  //     delegateBreakdownModelChange() 
  //     //delegate the event when search items within breakdown list
  //     delegateBreakdownSearch()
  //     //delegate event when refresh MC icon is clicked
  //     delegateRefreshMC() 
  //     //delegate event when refresh Clash icon is clicked
  //     delegateRefreshClash()
  //     //
  //     delegateExportPDF()
  //   })() 
  // } 
  // //initialize the helps
  // global_navHelp.init()   

});   

var dropdownMenu;
$(window).on('show.bs.dropdown', function (e) {
    dropdownMenu = $(e.target).find('.dropdown-menu');
    $('body').append(dropdownMenu.detach());
    var eOffset = $(e.target).offset();
    dropdownMenu.css({
        'display': 'block',
        'top': eOffset.top + $(e.target).outerHeight(),
        'left': eOffset.left
    });
});
$(window).on('hide.bs.dropdown', function (e) {
    $(e.target).append(dropdownMenu.detach());
    dropdownMenu.hide();
});

function droplistFormatter(value, row, index) {
  var re = "<div class='btn-group' astyle='position: absolute'><button type='button' class='btn btn-primary btn-xs dropdown-toggle' data-toggle='dropdown'>Options<span class='caret'></span></button><ul class='dropdown-menu text-left' role='menu' style='position:absolute'>";
  value.forEach(async element => {
    re += `<li><a><span class='glyphicon glyphicon-edit'></span>&nbsp;&nbsp;${element}</a></li>`;
  });
  re += "</ul></div>"; 
  return re
}

function urlFormatter(value, row, index) {
  var re = ``
    value.forEach(async element => { 
      re += `<a href="${element}">${element}</a>&nbsp|&nbsp`;
    }); 

  return re
}

$(document).ready(function () {

  const columns  =  [
    { field: 'description', title: "description", align: 'center' },
    { field: 'type', title: "type", align: 'center' },
    { field: 'recur', title: "recur", align: 'center' },

    { field: 'created_time', title: "created time", align: 'center' }, 
    { field: 'jobs', title: "jobs", align: 'center',formatter:droplistFormatter },
    { field: 'status', title: "status", align: 'center',formatter:droplistFormatter },
    { field: 'data', title: "data", align: 'left',formatter:urlFormatter } 
    ]; 

    var data = [
      {description:'extract issues', created_time:'2020-12-03',type:'one time',recur:'n/a',jobs:['2020-12-03'],status:['complete'],data:['issues']},
      {description:'extract rfis', created_time:'2020-12-04',type:'day',recur:'1',jobs:['2020-12-04','2020-12-05','next-2020-12-06'],status:['complete','complete','queued'],data:['rfis']},
      {description:'extract admin checklist', created_time:'2020-12-05',type:'week',recur:'2',jobs:['2020-12-04','2020-12-11','next-2020-12-18'],status:['complete','running','queued'],data:['admin','checklists']},
      {description:'extract all', created_time:'2020-12-10',type:'month',recur:'1',jobs:['2020-12-04','2021-01-04','next-2021-02-04'],status:['complete','complete','running'],data:['admin','checklists','rfis','cost','dailylog','locations','submittals']}

    ]

    $(`#requestsTable`).bootstrapTable({
      parent:this,
      data: data,
      editable: false,
      clickToSelect: true,
      cache: false,
      showToggle: false,
      showPaginationSwitch: false,
      pagination: true,
      pageList: [5, 10, 25, 50, 100],
      pageSize: 10,
      pageNumber: 1,
      uniqueId: 'id',
      striped: true,
      search: false,
      showRefresh: true,
      minimumCountColumns: 2,
      smartDisplay: true,
      columns: columns 
    });


})

function delegateHubSelection(){ 
  $(document).on('click', '#hubs_list a', function(e) {
    $('#hub_dropdown_title').html($(this).html());
    const hub_id_without_b = $(this).attr('id')
    const hub_id_with_b = 'b.' + hub_id_without_b
    global_dmProjects.refreshProjects(hub_id_with_b) 
    $('#hubs_list .active').removeClass('active');
     $(this).toggleClass('active') 
  });
}

function delegateProjectSelection(){ 
  $(document).on('click', '#projects_list a', function(e) {
    $('#project_dropdown_title').html($(this).html());
    const proj_id_without_b = $(this).attr('id')
    global_msSet.refreshModelSets(proj_id_without_b) 

     $('#projects_list .active').removeClass('active');
     $(this).toggleClass('active') 
  }); 
}

function delegateModelsetSelection(){
    $(document).on('click', '#modelsetList .list-group-item', function(e) {
      $('#modelsetList .active').removeClass('active')
      $(this).toggleClass('active') 

      const mc_containter_id =  $('#projects_list .active').attr('id')
      const ms_id =  $(this).attr("id");   
      const ms_v_id =  $(this).find("span")[0].innerHTML.replace('v-','');

      (async(mc_containter_id,ms_id,ms_v_id)=>{

        $('#clashviewSpinner').css({ display: "block" })
        $('#forgeSpinner').css({ display: "block" })

        global_clashBreakdownView.reset()
        //refresh clash data
        let r = await global_msSet.refreshOneModelset(mc_containter_id,ms_id,ms_v_id) 
        if(r)
          r = await global_clashRawView.getRawData(mc_containter_id,ms_id,ms_v_id) 
        if(r)
          r = await global_clashMatrixView.produceClashMatrixTable(mc_containter_id,ms_id,ms_v_id) 
        if(r)
           r = await global_clashBreakdownView.initBreakdownList(mc_containter_id,ms_id,ms_v_id)
        if(r)
          global_forgeViewer.launchViewer(global_msSet._docsMap)

        $('#clashviewSpinner').css({ display: "none" })
        $('#forgeSpinner').css({ display: "none" })
 
      })(mc_containter_id,ms_id,ms_v_id)
  })
}

function delegateBreakdownModelChange(){
  $(document).on('click', '#models_list .dropdown-item', function(e) {
    if(global_msSet._docsMap.length> Object.keys(global_forgeViewer._clashDocToModel).length){
      alert('not all models are loaded in viewer. try after a moment!')
      return
    } 
    const docName = $(this).html() 
    $('#models_dropdown_title').html(docName);
    global_clashBreakdownView.produceBreakdownView(docName)
  })  
}
 
function delegateExportPDF(){
  $(document).on('click', '#btnExportPDF', function(e) {

      const mc_containter_id =  $('#projects_list .active').attr('id');  
      if(!mc_containter_id) return
      const ms_id =  $('#modelsetList .active').attr("id"); 
      if(!ms_id) return 
      const ms_v_id =  $('#modelsetList .active').find("span")[0].innerHTML.replace('v-',''); 
      if(!ms_v_id) return

      var checked_clashes = []; 
      $("#breakdownTree").jstree("get_checked",true).forEach(item=>{ 
         if(item.data && item.data.clashes && item.data.level == 3){
          checked_clashes = checked_clashes.concat(item.data.clashes)
         } 
      }) 
      if(checked_clashes.length > 30){
        alert('To have better export performance, please select no more than 30 clashes!') 
      }else{
        (async(mc_containter_id,ms_id,ms_v_id)=>{
          //add spinning 
          var exportbtn = $('#btnExportPDF')
          let i = document.createElement("i")
          i.classList.add('spinner-border')
          i.classList.add('spinner-border-sm') 
          exportbtn.append(i) 
          $('#btnExportPDF').contents().filter(function() {
            return this.nodeType == 3 && this.textContent.trim();
          })[0].textContent = 'Exporting...'
          exportbtn.prop('disabled', true); 

          await global_ClashPDF.exportPDF(mc_containter_id,ms_id,ms_v_id,checked_clashes)

          //remove spinning
          exportbtn.prop('disabled', false); 
          exportbtn.remove(i)
          $('#btnExportPDF').contents().filter(function() {
            return this.nodeType == 3 && this.textContent.trim();
          })[0].textContent = 'Exporting...'
          exportbtn.text('Export PDF') 

        })(mc_containter_id,ms_id,ms_v_id)
      }  
    }) 
} 

function delegateRefreshMC(){
  $(document).on('click', '#btnRefreshMC', function(e) {
    const proj_id_without_b =  $('#projects_list .active').attr('id');  
    if(proj_id_without_b) 
      global_msSet.refreshModelSets(proj_id_without_b) 
  }) 
}  

function delegateBreakdownSearch(){ 
  $(document).on('keyup','#search-input',function(e){
    var searchString = $(this).val();
    $('#breakdownTree').jstree('search', searchString);
  })  
}

function delegateRefreshClash(){
  $(document).on('click', '#btnRefreshClash', function(e) {
    const mc_containter_id =  $('#projects_list .active').attr('id');  
    const ms_id =  $('#modelsetList .active').attr("id");   
    const ms_v_id =  $('#modelsetList .active').find("span")[0].innerHTML.replace('v-',''); 
    //refresh clash data

    (async(mc_containter_id,ms_id,ms_v_id)=>{
      //refresh clash data
      let r = await global_msSet.refreshOneModelset(mc_containter_id,ms_id,ms_v_id)
      if(r)
         r = await global_clashRawView.produceClashRawTable(mc_containter_id,ms_id,ms_v_id,true)
      if(r)
         global_forgeViewer.launchViewer(global_msSet._docsMap)

    })(mc_containter_id,ms_id,ms_v_id)  
    
  })
     
}  
 

