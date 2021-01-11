const global_oAuth = new oAuth()
const global_DataManagement = new DataManagement()
const global_DataConnector = new DataConnector()

$(document).ready(function () {

  $('#signInButton').click(global_oAuth.forgeSignIn);
  (async () => {
    const currentToken = await global_oAuth.getForgeToken();
    if (currentToken != '') {

      let profile = await global_oAuth.getForgeUserProfile()

      $('#signInProfileImage').removeClass();
      $('#signInProfileImage').html('<img src="' + profile.picture + '" height="30"/>')
      $('#signInButtonText').text(profile.name);
      $('#signInButtonText').attr('title', 'Click to Sign Out');
      $('#signInButton').click(global_oAuth.forgeLogoff);

      global_DataManagement.refreshHubs()

       //delegate the event when one hub is selected
       delegateHubSelection()
       delegateCreateRequestButton()

    }
  })()

  initDefaultParamsOfCreateReq()
  global_DataConnector.initTable('requestsTable',false)

});

function initDefaultParamsOfCreateReq(){
  //description
  let date = new Date(); 

  $("#startDate").datepicker("setDate", date);
  $("#endDate").datepicker("setDate", date);

  const currentDate  = date.getFullYear() 
                      +'-' + (date.getMonth() +1)
                      + '-' +date.getDate();
  $('#description').val(`Created by Dashboard App at ${currentDate}`)
 

}

function delegateHubSelection(){ 
  $(document).on('click', '#hubs_list a', function(e) {
    $('#hub_dropdown_title').html($(this).html());
    const hub_id_without_b = $(this).attr('id')
    const hub_id_with_b = 'b.' + hub_id_without_b
    $('#hidden_hub_id').text(hub_id_without_b); 

    global_DataConnector.refreshRequestsTable(hub_id_without_b,'requestsTable',false)
  });
}

function delegateCreateRequestButton(){ 
  $(document).on('click', '#createReq', (async e=> {

    if($('#hidden_hub_id').text() == ''){
      alert('please select one BIM account!');
      return;
    }

    const hub_id_without_b = $('#hidden_hub_id').text()

    const description = $('#description').val()
    const serviceGroups = []
    $('#srvAdmin').is(':checked')?serviceGroups.push('admin'):{}
    $('#srvIssue').is(':checked')?serviceGroups.push('issues'):{}
    $('#srvRfi').is(':checked')?serviceGroups.push('rfis'):{}
    $('#srvChecklist').is(':checked')?serviceGroups.push('checklists'):{}
    $('#srvCost').is(':checked')?serviceGroups.push('cost'):{}
    $('#srvDailylog').is(':checked')?serviceGroups.push('dailylogs'):{}
    $('#srvLocation').is(':checked')?serviceGroups.push('locations'):{}
    $('#srvSubmittal').is(':checked')?serviceGroups.push('submittals'):{}

    const scheduleInterval = $('input:radio[name="schedule"]:checked')[0].id.toLocaleUpperCase()
    const reoccuringInterval = scheduleInterval=='one_time'?-1:Number($('#interval').val())


 
    let d = new Date($("#startDate").val()); 

    d.setUTCMinutes(d.getUTCMinutes()+10) // start first extration 10 minutes after creating request

    const startDate = d.getFullYear() 
                      +"-" + (("0" + (d.getUTCMonth()+1)).slice(-2) )
                      + "-" +  ("0" + d.getUTCDate()).slice(-2) 
                      + "T" +("0" + d.getUTCHours()).slice(-2) 
                      + ":" + ("0" + d.getUTCMinutes()).slice(-2) 
                      + ":" + ("0" + d.getUTCSeconds()).slice(-2) 
                      + ".000Z"
      
    d = new Date($("#endDate").val()); 
    const endDate =  d.getFullYear() 
                    +"-" + (("0" + (d.getUTCMonth()+1)).slice(-2) )
                    + "-" +  ("0" + d.getUTCDate()).slice(-2) 
                    + "T" +("0" + d.getUTCHours()).slice(-2) 
                    + ":" + ("0" + d.getUTCMinutes()).slice(-2) 
                    + ":" + ("0" + d.getUTCSeconds()).slice(-2) 
                    + ".000Z"
    
    let body = {
      description:description,
      isActive:true,
      scheduleInterval:scheduleInterval,
      reoccuringInterval:reoccuringInterval,
      serviceGroups:serviceGroups,
      effectiveFrom:startDate,
      effectiveTo:endDate,
      callbackUrl:null //will add valid endpoint of callback on server side 
    } 


    await global_DataConnector.createRequest(hub_id_without_b,body)
    global_DataConnector.refreshRequestsTable(hub_id_without_b,'requestsTable',false)

  }))
}

