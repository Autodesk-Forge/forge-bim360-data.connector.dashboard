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
       global_DataConnector.initTable('requestsTable',false)

    }
  })()
});

function delegateHubSelection(){ 
  $(document).on('click', '#hubs_list a', function(e) {
    $('#hub_dropdown_title').html($(this).html());
    const hub_id_without_b = $(this).attr('id')
    const hub_id_with_b = 'b.' + hub_id_without_b
    global_DataConnector.refreshRequestsTable(hub_id_without_b,'requestsTable',false)
  });
}

function delegateCreateRequestButton(){ 
  $(document).on('click', '#createReq', (async e=> {

    const description = $('#description').val()
    const serviceGroups = []
    $('#srvAdmin').is(':checked')?serviceGroups.push('admin'):{}
    $('#srvIssue').is(':checked')?serviceGroups.push('issue'):{}
    $('#srvRfi').is(':checked')?serviceGroups.push('rfis'):{}
    $('#srvChecklist').is(':checked')?serviceGroups.push('checklists'):{}
    $('#srvCost').is(':checked')?serviceGroups.push('cost'):{}
    $('#srvDailylog').is(':checked')?serviceGroups.push('dailylogs'):{}
    $('#srvLocation').is(':checked')?serviceGroups.push('locations'):{}
    $('#srvSubmittal').is(':checked')?serviceGroups.push('submittals'):{}

    const scheduleInterval = $('input:radio[name="schedule"]:checked')[0].id
    const reoccuringInterval = Number($('#interval').val())


    let date = new Date($("#startDate").val()); 
    const startDate = date.getFullYear() 
                  +'-' + (date.getMonth() +1)
                  + '-' +date.getDate();
    date = new Date($("#endDate").val()); 
    const endDate = date.getFullYear() 
                  +'-' + (date.getMonth() +1)
                  + '-' +date.getDate();
    
    let body = {
      description:description,
      isActive:true,
      scheduleInterval:scheduleInterval,
      reoccuringInterval:reoccuringInterval,
      serviceGroups:serviceGroups,
      effectiveFrom:startDate,
      effectiveTo:endDate,
      callback:null //will add valid endpoint of callback on server side 
    } 

    
    await global_DataConnector.createRequest('a4f95080-84fe-4281-8d0a-bd8c885695e0',body)
   
  }))
}

